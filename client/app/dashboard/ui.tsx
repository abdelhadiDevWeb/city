"use client";

import { CircleAlert, Info, TriangleAlert, X, type LucideIcon } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { ApiError } from "@/lib/api";
import type { Alerte } from "@/lib/demo-data";

export const card = "rounded-2xl border border-stone-200 bg-white shadow-[0_1px_2px_rgb(28_25_23/0.04)]";

type ButtonVariant = "primary" | "secondary" | "brand";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-ink text-white hover:bg-stone-800",
  secondary: "border border-stone-200 bg-white text-ink hover:border-stone-300 hover:bg-stone-50",
  brand: "bg-brand text-white hover:bg-brand-hover",
};

export function button(variant: ButtonVariant = "primary", size: "md" | "sm" = "md"): string {
  const sizing = size === "md" ? "gap-2 rounded-xl px-4 py-2.5 text-sm" : "gap-1.5 rounded-lg px-3 py-1.5 text-xs";
  return `inline-flex items-center justify-center whitespace-nowrap font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-60 ${sizing} ${BUTTON_VARIANTS[variant]}`;
}

export type Tone = "neutral" | "success" | "warning" | "danger" | "brand" | "dark";

const PILL_TONES: Record<Tone, string> = {
  neutral: "border-stone-200 bg-stone-50 text-stone-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-red-200 bg-red-50 text-red-700",
  brand: "border-orange-200 bg-orange-50 text-orange-700",
  dark: "border-ink bg-ink text-white",
};

export function Pill({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md border px-2 py-0.5 text-[11px] font-semibold ${PILL_TONES[tone]}`}>
      {children}
    </span>
  );
}

export function AccountStatusPill({ actif }: { actif: boolean }) {
  return <Pill tone={actif ? "success" : "danger"}>{actif ? "Compte actif" : "Compte inactif"}</Pill>;
}

export function PageHeader({
  icon: Icon,
  title,
  subtitle,
  actions,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-ink">
          <Icon className="h-6 w-6 shrink-0 text-brand" strokeWidth={2.2} aria-hidden />
          {title}
        </h1>
        <p className="mt-1 text-sm text-stone-500">{subtitle}</p>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export type TabItem<T extends string> = { id: T; label: string; icon: LucideIcon; count?: number };

export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: TabItem<T>[];
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <div role="tablist" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {tabs.map(({ id, label, icon: Icon, count }) => {
        const selected = id === active;
        return (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={selected}
            onClick={() => onChange(id)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              selected ? "bg-ink text-white shadow-sm" : "border border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-ink"
            }`}
          >
            <Icon className={`h-4 w-4 ${selected ? "text-brand" : ""}`} aria-hidden />
            {label}
            {count !== undefined && <span className={selected ? "text-white/70" : "text-stone-400"}>({count})</span>}
          </button>
        );
      })}
    </div>
  );
}

export function Panel({
  title,
  badge,
  children,
  className = "",
}: {
  title: string;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`${card} p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-ink">{title}</h2>
        {badge}
      </div>
      {children}
    </section>
  );
}

export function StatLine({ label, value, strong = false }: { label: string; value: ReactNode; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 text-sm">
      <span className="text-stone-500">{label}</span>
      <span className={`text-right ${strong ? "font-mono text-base font-bold text-ink" : "font-semibold text-ink"}`}>{value}</span>
    </div>
  );
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div role="progressbar" aria-label={label} aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100} className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
      <div className="h-full rounded-full bg-brand" style={{ width: `${clamped}%` }} />
    </div>
  );
}

export type Column<T> = {
  header: string;
  cell: (row: T) => ReactNode;
  align?: "right";
  className?: string;
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  empty = "Aucun élément à afficher.",
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty?: string;
}) {
  return (
    <div className={`${card} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-stone-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.header}
                  scope="col"
                  className={`px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide text-stone-500 ${col.align === "right" ? "text-right" : ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center text-sm text-stone-500">
                  {empty}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={rowKey(row)} className="transition hover:bg-stone-50/70">
                  {columns.map((col) => (
                    <td
                      key={col.header}
                      className={`px-5 py-3.5 align-middle text-stone-700 ${col.align === "right" ? "text-right" : ""} ${col.className ?? ""}`}
                    >
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Mono({ children, strong = false }: { children: ReactNode; strong?: boolean }) {
  return <span className={`whitespace-nowrap font-mono ${strong ? "font-bold text-ink" : "text-xs text-stone-600"}`}>{children}</span>;
}

export function Menu({
  label,
  trigger,
  triggerClassName,
  align = "right",
  width = "w-64",
  children,
}: {
  label: string;
  trigger: ReactNode;
  triggerClassName: string;
  align?: "left" | "right";
  width?: string;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button type="button" aria-label={label} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)} className={triggerClassName}>
        {trigger}
      </button>
      {open && (
        <div
          role="menu"
          className={`absolute top-full z-40 mt-2 ${width} overflow-hidden rounded-2xl border border-stone-200 bg-white p-1.5 shadow-xl shadow-stone-900/10 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export const menuItem =
  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-stone-700 transition hover:bg-stone-100 hover:text-ink";

type Toast = { id: number; message: string };

const ToastContext = createContext<((message: string) => void) | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const notify = useCallback((message: string) => {
    const id = ++nextId.current;
    setToasts((list) => [...list, { id, message }]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto flex max-w-sm items-start gap-3 rounded-xl bg-ink px-4 py-3 text-sm text-white shadow-xl">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" aria-hidden />
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): (message: string) => void {
  const notify = useContext(ToastContext);
  if (!notify) throw new Error("useToast must be used inside <ToastProvider>");
  return notify;
}

export function Avatar({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full bg-stone-100 font-bold text-stone-700 ${
        size === "md" ? "h-8 w-8 text-[11px]" : "h-11 w-11 text-sm"
      }`}
    >
      {letters}
    </span>
  );
}

export const ALERT_STYLES: Record<Alerte["niveau"], { icon: LucideIcon; className: string; label: string }> = {
  critique: { icon: CircleAlert, className: "bg-red-50 text-red-600", label: "Critique" },
  attention: { icon: TriangleAlert, className: "bg-amber-50 text-amber-600", label: "Attention" },
  info: { icon: Info, className: "bg-stone-100 text-stone-600", label: "Information" },
};

export const DEMO_NOTICE = "Démo : cette action sera disponible une fois le backend connecté.";

export function Modal({
  title,
  description,
  onClose,
  children,
}: {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const titleId = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button type="button" aria-label="Fermer" onClick={onClose} className="absolute inset-0 h-full w-full cursor-default bg-ink/40" />
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-lg font-bold text-ink">
              {title}
            </h2>
            {description && <p className="mt-1 text-sm text-stone-500">{description}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

export const inputClass =
  "block w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-stone-400 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:bg-stone-50";

export function Field({ label, hint, className = "", ...inputProps }: { label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold text-stone-700">
        {label}
      </label>
      <input id={id} className={`${inputClass} ${className}`} {...inputProps} />
      {hint && <p className="text-[11px] text-stone-500">{hint}</p>}
    </div>
  );
}

export function describeError(err: unknown): { message: string; details: string[] } {
  if (err instanceof ApiError) {
    if (err.status === 400) return { message: "Certains champs sont invalides.", details: err.details };
    if (err.status === 403) return { message: "Action réservée au Super Admin.", details: [] };
    if (err.status === 429) return { message: "Trop de requêtes. Réessayez dans une minute.", details: [] };
    return { message: err.message, details: [] };
  }
  return { message: "Serveur injoignable. Vérifiez votre connexion.", details: [] };
}

export function FormError({ error }: { error: { message: string; details: string[] } | null }) {
  if (!error) return null;
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <p className="font-semibold">{error.message}</p>
      {error.details.length > 0 && (
        <ul className="mt-1 list-disc pl-5 text-xs">
          {error.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
