"use client";

import { card } from "./ui";

/**
 * Base pulsing skeleton block
 */
export function SkeletonBox({ className = "h-4 w-full" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-xl bg-stone-200/70 dark:bg-stone-100 ${className}`}
    />
  );
}

/**
 * Page Header Skeleton matching PageHeader in ui.tsx
 */
export function SkeletonHeader({
  titleWidth = "w-64",
  subtitleWidth = "w-96",
  hasActions = true,
}: {
  titleWidth?: string;
  subtitleWidth?: string;
  hasActions?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <SkeletonBox className="h-6 w-6 rounded-lg" />
          <SkeletonBox className={`h-7 ${titleWidth}`} />
        </div>
        <SkeletonBox className={`h-4 ${subtitleWidth}`} />
      </div>
      {hasActions && (
        <div className="flex flex-wrap items-center gap-2">
          <SkeletonBox className="h-9 w-28 rounded-xl" />
          <SkeletonBox className="h-9 w-36 rounded-xl" />
        </div>
      )}
    </div>
  );
}

/**
 * Top 4 Executive KPI Hero Cards Skeleton
 */
export function SkeletonKpiGrid({ count = 4 }: { count?: number }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${count === 3 ? "lg:grid-cols-3" : "xl:grid-cols-4"}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${card} p-5 space-y-3`}>
          <div className="flex items-center justify-between gap-3">
            <SkeletonBox className="h-3 w-28" />
            <SkeletonBox className="h-8 w-8 rounded-lg" />
          </div>
          <SkeletonBox className="h-8 w-36" />
          <div className="border-t border-stone-100 pt-2 flex items-center justify-between">
            <SkeletonBox className="h-3 w-20" />
            <SkeletonBox className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Smart Alert Banner Skeleton matching SmartActionCenter
 */
export function SkeletonSmartAlerts() {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-50/50 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2.5">
          <SkeletonBox className="h-5 w-5 rounded-md" />
          <SkeletonBox className="h-4 w-48" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SkeletonBox className="h-7 w-44 rounded-full" />
          <SkeletonBox className="h-7 w-40 rounded-full" />
          <SkeletonBox className="h-7 w-36 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * Tab Navigation Skeleton matching Tabs in ui.tsx
 */
export function SkeletonTabs({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonBox key={i} className="h-9 w-32 rounded-xl shrink-0" />
      ))}
    </div>
  );
}

/**
 * Data Table Skeleton matching DataTable in ui.tsx
 */
export function SkeletonTable({
  columns = 5,
  rows = 5,
  hasToolbar = true,
}: {
  columns?: number;
  rows?: number;
  hasToolbar?: boolean;
}) {
  return (
    <div className={`${card} overflow-hidden`}>
      {hasToolbar && (
        <div className="border-b border-stone-200/80 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white">
          <SkeletonBox className="h-9 w-full sm:w-64 rounded-xl" />
          <div className="flex items-center gap-2">
            <SkeletonBox className="h-9 w-28 rounded-xl" />
            <SkeletonBox className="h-9 w-28 rounded-xl" />
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-stone-200/80 bg-stone-50/60">
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-4 py-3.5">
                  <SkeletonBox className="h-3 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 bg-white">
            {Array.from({ length: rows }).map((_, r) => (
              <tr key={r}>
                {Array.from({ length: columns }).map((_, c) => (
                  <td key={c} className="px-4 py-3.5">
                    {c === 0 ? (
                      <div className="flex items-center gap-2.5">
                        <SkeletonBox className="h-8 w-8 rounded-full shrink-0" />
                        <div className="space-y-1.5 flex-1">
                          <SkeletonBox className="h-3.5 w-28" />
                          <SkeletonBox className="h-2.5 w-16" />
                        </div>
                      </div>
                    ) : c === columns - 1 ? (
                      <div className="flex justify-end gap-1.5">
                        <SkeletonBox className="h-7 w-16 rounded-lg" />
                      </div>
                    ) : (
                      <SkeletonBox className="h-3.5 w-24" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-stone-100 p-3 flex items-center justify-between text-xs text-stone-400 bg-stone-50/30">
        <SkeletonBox className="h-3 w-32" />
        <SkeletonBox className="h-3 w-24" />
      </div>
    </div>
  );
}

/**
 * Grid of modules skeleton (8 or 10 cards)
 */
export function SkeletonModulesGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <SkeletonBox className="h-5 w-48" />
          <SkeletonBox className="h-3 w-72" />
        </div>
        <SkeletonBox className="h-4 w-20" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`${card} p-5 space-y-3 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between gap-2">
                <SkeletonBox className="h-10 w-10 rounded-xl" />
                <SkeletonBox className="h-5 w-16 rounded-md" />
              </div>
              <SkeletonBox className="mt-3 h-4 w-32" />
              <SkeletonBox className="mt-2 h-3 w-full" />
              <SkeletonBox className="mt-1 h-3 w-4/5" />
            </div>
            <div className="border-t border-stone-100 pt-3 flex items-center justify-between">
              <SkeletonBox className="h-3 w-24" />
              <SkeletonBox className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Full Dashboard Skeleton (used by /dashboard/loading.tsx)
 */
export function SkeletonDashboard() {
  return (
    <div className="space-y-8">
      {/* Header Banner Skeleton */}
      <section className={`${card} p-6 sm:p-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between`}>
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <SkeletonBox className="h-6 w-32 rounded-full" />
            <SkeletonBox className="h-6 w-24 rounded-full" />
          </div>
          <SkeletonBox className="h-8 w-72" />
          <SkeletonBox className="h-4 w-full max-w-xl" />
          <SkeletonBox className="h-3 w-64" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SkeletonBox className="h-10 w-32 rounded-xl" />
          <SkeletonBox className="h-10 w-36 rounded-xl" />
        </div>
      </section>

      {/* Smart Action Center Skeleton */}
      <SkeletonSmartAlerts />

      {/* 4 KPIs Hero */}
      <SkeletonKpiGrid count={4} />

      {/* 8/10 Modules Grid */}
      <SkeletonModulesGrid count={8} />

      {/* 2 Detailed Workspaces Panels */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className={`${card} p-6 lg:col-span-2 space-y-4`}>
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <SkeletonBox className="h-5 w-48" />
            <SkeletonBox className="h-4 w-20" />
          </div>
          <SkeletonBox className="h-10 w-full rounded-xl" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-stone-50">
                <div className="space-y-1">
                  <SkeletonBox className="h-4 w-40" />
                  <SkeletonBox className="h-3 w-28" />
                </div>
                <SkeletonBox className="h-6 w-20 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        <div className={`${card} p-6 space-y-4`}>
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <SkeletonBox className="h-5 w-36" />
            <SkeletonBox className="h-4 w-16" />
          </div>
          <SkeletonBox className="h-16 w-full rounded-xl" />
          <div className="space-y-2.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonBox key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Finances Page Skeleton
 */
export function SkeletonFinancesPage() {
  return (
    <div className="space-y-6">
      <SkeletonHeader titleWidth="w-72" subtitleWidth="w-[32rem]" />
      <SkeletonKpiGrid count={4} />
      <SkeletonTabs count={5} />
      <SkeletonTable columns={6} rows={6} />
    </div>
  );
}

/**
 * Residences Page Skeleton
 */
export function SkeletonResidencesPage() {
  return (
    <div className="space-y-6">
      <SkeletonHeader titleWidth="w-64" subtitleWidth="w-96" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`${card} p-5 space-y-3`}>
            <div className="flex items-center justify-between">
              <SkeletonBox className="h-5 w-32" />
              <SkeletonBox className="h-6 w-20 rounded-full" />
            </div>
            <SkeletonBox className="h-4 w-48" />
            <SkeletonBox className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
      <SkeletonTabs count={2} />
      <SkeletonTable columns={5} rows={5} />
    </div>
  );
}

/**
 * Residents Page Skeleton
 */
export function SkeletonResidentsPage() {
  return (
    <div className="space-y-6">
      <SkeletonHeader titleWidth="w-64" subtitleWidth="w-96" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`${card} p-4 space-y-2`}>
            <SkeletonBox className="h-3 w-24" />
            <SkeletonBox className="h-6 w-32" />
          </div>
        ))}
      </div>
      <SkeletonTable columns={5} rows={6} />
    </div>
  );
}

/**
 * Maintenance Page Skeleton
 */
export function SkeletonMaintenancePage() {
  return (
    <div className="space-y-6">
      <SkeletonHeader titleWidth="w-64" subtitleWidth="w-96" />
      <SkeletonKpiGrid count={3} />
      <SkeletonTabs count={3} />
      <SkeletonTable columns={5} rows={5} />
    </div>
  );
}

/**
 * Assemblees Page Skeleton
 */
export function SkeletonAssembleesPage() {
  return (
    <div className="space-y-6">
      <SkeletonHeader titleWidth="w-72" subtitleWidth="w-96" />
      <div className={`${card} p-6 space-y-4`}>
        <div className="flex items-center justify-between">
          <SkeletonBox className="h-5 w-64" />
          <SkeletonBox className="h-6 w-24 rounded-full" />
        </div>
        <SkeletonBox className="h-4 w-96" />
        <SkeletonBox className="h-3 w-full rounded-full" />
      </div>
      <SkeletonTabs count={2} />
      <SkeletonTable columns={4} rows={4} />
    </div>
  );
}

/**
 * Simple Generic Page Skeleton
 */
export function SkeletonGenericPage({
  titleWidth = "w-64",
  tableColumns = 4,
}: {
  titleWidth?: string;
  tableColumns?: number;
}) {
  return (
    <div className="space-y-6">
      <SkeletonHeader titleWidth={titleWidth} />
      <SkeletonTable columns={tableColumns} rows={5} />
    </div>
  );
}
