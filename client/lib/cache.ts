"use client";

import { useEffect, useRef, useState } from "react";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
  ttl: number; // in milliseconds
  tags: string[];
};

// Global in-memory storage for the current browser session
const cacheStore = new Map<string, CacheEntry<unknown>>();
const inFlightRequests = new Map<string, Promise<unknown>>();
const subscribers = new Map<string, Set<(data: unknown) => void>>();

const DEFAULT_TTL_MS = 60 * 1000; // 60 seconds fresh time
const MAX_STALE_MS = 10 * 60 * 1000; // 10 minutes maximum before garbage collection

function notifySubscribers(key: string, data: unknown) {
  const subs = subscribers.get(key);
  if (subs) {
    subs.forEach((cb) => cb(data));
  }
}

/**
 * Retrieve cached entry if available
 */
export function getCached<T>(key: string): { data: T; isFresh: boolean } | null {
  const entry = cacheStore.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;

  const age = Date.now() - entry.timestamp;
  if (age > MAX_STALE_MS) {
    cacheStore.delete(key);
    return null;
  }

  return {
    data: entry.data,
    isFresh: age <= entry.ttl,
  };
}

/**
 * Set or update cache value
 */
export function setCached<T>(
  key: string,
  data: T,
  options?: { ttl?: number; tags?: string[] },
): void {
  const ttl = options?.ttl ?? DEFAULT_TTL_MS;
  const tags = options?.tags ?? [];
  cacheStore.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
    tags,
  });
  notifySubscribers(key, data);
}

/**
 * Invalidate a specific cache key
 */
export function invalidateKey(key: string): void {
  cacheStore.delete(key);
  notifySubscribers(key, null);
}

/**
 * Invalidate all cache entries matching any of the given tags
 */
export function invalidateTags(tags: string[]): void {
  const tagSet = new Set(tags);
  for (const [key, entry] of cacheStore.entries()) {
    if (entry.tags.some((t) => tagSet.has(t))) {
      cacheStore.delete(key);
      notifySubscribers(key, null);
    }
  }
}

/**
 * Clear the entire in-memory cache (e.g. on logout)
 */
export function clearAllCache(): void {
  cacheStore.clear();
  inFlightRequests.clear();
  for (const [key] of subscribers.entries()) {
    notifySubscribers(key, null);
  }
}

/**
 * Core SWR fetcher with promise deduplication and tag-based caching
 */
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: { ttl?: number; tags?: string[]; forceRefresh?: boolean },
): Promise<T> {
  const force = options?.forceRefresh ?? false;

  if (!force) {
    const cached = getCached<T>(key);
    if (cached && cached.isFresh) {
      return cached.data;
    }
  }

  // Deduplicate simultaneous requests for the same key
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key) as Promise<T>;
  }

  const promise = (async () => {
    try {
      const data = await fetcher();
      setCached(key, data, { ttl: options?.ttl, tags: options?.tags });
      return data;
    } finally {
      inFlightRequests.delete(key);
    }
  })();

  inFlightRequests.set(key, promise);
  return promise;
}

/**
 * React Hook for SWR (Stale-While-Revalidate) data fetching
 * Returns cached data immediately (0ms latency), revalidates in background.
 */
export function useApiQuery<T>(
  key: string | null,
  fetcher: () => Promise<T>,
  options?: {
    ttl?: number;
    tags?: string[];
    enabled?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (err: unknown) => void;
  },
) {
  const enabled = options?.enabled !== false && key !== null;
  const initialCache = key ? getCached<T>(key) : null;

  const [data, setData] = useState<T | null>(initialCache ? initialCache.data : null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialCache && enabled);
  const [isRevalidating, setIsRevalidating] = useState<boolean>(Boolean(initialCache && !initialCache.isFresh && enabled));

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!key || !enabled) return;

    let active = true;

    // Subscribe to external cache updates (from other components or mutations)
    if (!subscribers.has(key)) {
      subscribers.set(key, new Set());
    }
    const listener = (updatedData: unknown) => {
      if (active) {
        if (updatedData === null) {
          // Invalidation triggered
          void revalidate(true);
        } else {
          setData(updatedData as T);
        }
      }
    };
    subscribers.get(key)!.add(listener);

    async function revalidate(force = false) {
      if (!key) return;
      const cached = getCached<T>(key);

      if (cached && !force) {
        setData(cached.data);
        if (cached.isFresh) {
          setIsLoading(false);
          setIsRevalidating(false);
          return;
        }
        setIsRevalidating(true);
      } else if (!cached) {
        setIsLoading(true);
      }

      try {
        const freshData = await cachedFetch(key, fetcherRef.current, {
          ttl: optionsRef.current?.ttl,
          tags: optionsRef.current?.tags,
          forceRefresh: force,
        });
        if (!active) return;
        setData(freshData);
        setError(null);
        optionsRef.current?.onSuccess?.(freshData);
      } catch (err) {
        if (!active) return;
        const msg = err instanceof Error ? err.message : "Erreur de chargement";
        setError(msg);
        optionsRef.current?.onError?.(err);
      } finally {
        if (active) {
          setIsLoading(false);
          setIsRevalidating(false);
        }
      }
    }

    void revalidate();

    return () => {
      active = false;
      subscribers.get(key)?.delete(listener);
    };
  }, [key, enabled]);

  // Optimistic or manual mutation
  const mutate = (
    updater: T | ((prev: T | null) => T),
    shouldRevalidate = false,
  ) => {
    if (!key) return;
    const nextData = typeof updater === "function" ? (updater as (prev: T | null) => T)(data) : updater;
    setCached(key, nextData, { ttl: optionsRef.current?.ttl, tags: optionsRef.current?.tags });
    setData(nextData);

    if (shouldRevalidate) {
      void cachedFetch(key, fetcherRef.current, {
        ttl: optionsRef.current?.ttl,
        tags: optionsRef.current?.tags,
        forceRefresh: true,
      }).then((fresh) => {
        setData(fresh);
      });
    }
  };

  const refetch = async (): Promise<T | null> => {
    if (!key) return null;
    setIsRevalidating(true);
    try {
      const fresh = await cachedFetch(key, fetcherRef.current, {
        ttl: optionsRef.current?.ttl,
        tags: optionsRef.current?.tags,
        forceRefresh: true,
      });
      setData(fresh);
      setError(null);
      return fresh;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur de rafraîchissement";
      setError(msg);
      return null;
    } finally {
      setIsRevalidating(false);
    }
  };

  return {
    data,
    error,
    isLoading,
    isRevalidating,
    mutate,
    refetch,
  };
}

