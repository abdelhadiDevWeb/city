"use client";

import { Calendar, Check, ChevronRight, CircleAlert, Copy, Download, FileSpreadsheet, Info, KeyRound, MessageCircle, Pencil, Printer, Receipt, RefreshCw, Send, ShieldAlert, Trash2, TriangleAlert, X, type LucideIcon } from "lucide-react";
import { formatDZD } from "@/lib/format";
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
import type { Alerte } from "@/lib/annonces-api";

export const card = "rounded-2xl border border-stone-200 bg-white shadow-[0_1px_2px_rgb(28_25_23/0.04)]";

type ButtonVariant = "primary" | "secondary" | "brand" | "danger" | "ghost";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-ink text-white hover:bg-stone-800",
  secondary: "border border-stone-200 bg-white text-ink hover:border-stone-300 hover:bg-stone-50",
  brand: "bg-brand text-white hover:bg-brand-hover",
  danger: "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300",
  ghost: "text-stone-500 hover:bg-stone-100 hover:text-ink",
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
  toolbar,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty?: ReactNode;
  toolbar?: ReactNode;
}) {
  return (
    <div className={`${card} overflow-hidden`}>
      {toolbar && <div className="border-b border-stone-200 bg-stone-50/50 p-3 sm:p-3.5 overflow-x-auto">{toolbar}</div>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-start text-sm">
          <thead className="border-b border-stone-200 bg-stone-50/80">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.header}
                  scope="col"
                  className={`px-4 sm:px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-stone-500 ${col.align === "right" ? "text-end" : "text-start"}`}
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
                      className={`px-4 sm:px-5 py-3.5 align-middle text-stone-700 ${col.align === "right" ? "text-end" : "text-start"} ${col.className ?? ""}`}
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

export function FacetFilter<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string; count?: number }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-stone-200 bg-stone-100/70 p-1">
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              active
                ? "border border-stone-200 bg-white text-ink shadow-xs"
                : "text-stone-600 hover:bg-white/60 hover:text-ink"
            }`}
          >
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  active ? "bg-stone-100 text-ink" : "bg-stone-200/80 text-stone-600"
                }`}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function QuotaProgress({
  current,
  max,
  label = "Quota",
  unit = "",
}: {
  current: number;
  max: number;
  label?: string;
  unit?: string;
}) {
  const ratio = max > 0 ? current / max : 0;
  const pct = Math.min(100, Math.round(ratio * 100));
  const isFull = current >= max;
  const isWarning = ratio >= 0.8 && !isFull;

  return (
    <div className="space-y-1.5 rounded-xl border border-stone-200/80 bg-stone-50/70 p-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-stone-700">{label}</span>
        <span className="font-mono font-bold text-ink">
          {current} / {max} {unit}
          {isFull ? (
            <span className="ml-2 rounded-md bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700">Complet</span>
          ) : isWarning ? (
            <span className="ml-2 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">Proche limite</span>
          ) : null}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200/70">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isFull ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-brand"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function PasswordGeneratorInput({
  label = "Mot de passe initial",
  value,
  onChange,
  hint = "Vous pouvez générer un mot de passe et le copier pour l'envoyer au gestionnaire.",
}: {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  hint?: string;
}) {
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$%";
    let pwd = "";
    for (let i = 0; i < 10; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    pwd += "@2026";
    onChange(pwd);
  };

  const copyPassword = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-stone-700">{label}</label>
        <button
          type="button"
          onClick={generatePassword}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline"
        >
          <RefreshCw className="h-3 w-3" /> Générer automatiquement
        </button>
      </div>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Entrez ou générez un mot de passe"
          className={`${inputClass} pe-24 font-mono text-xs`}
        />
        <button
          type="button"
          onClick={copyPassword}
          disabled={!value}
          className="absolute end-1.5 top-1.5 inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 px-2 py-1 text-[11px] font-semibold text-stone-700 transition hover:bg-stone-100 disabled:opacity-40"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-600" /> <span className="text-emerald-700">Copié !</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> <span>Copier</span>
            </>
          )}
        </button>
      </div>
      {hint && <p className="text-[11px] text-stone-500">{hint}</p>}
    </div>
  );
}

export function Breadcrumbs({
  items,
}: {
  items: { label: string; onClick?: () => void }[];
}) {
  return (
    <nav aria-label="Fil d'Ariane" className="mb-2 flex items-center gap-1.5 text-xs text-stone-500">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={item.label} className="flex items-center gap-1.5">
            {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-stone-400 rtl:rotate-180" />}
            {item.onClick ? (
              <button
                type="button"
                onClick={item.onClick}
                className="font-medium text-stone-600 hover:text-ink hover:underline"
              >
                {item.label}
              </button>
            ) : isLast ? (
              <span className="font-bold text-ink">{item.label}</span>
            ) : (
              <span className="font-medium text-stone-600">{item.label}</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center sm:p-12">
      <div className="mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-500 shadow-inner">
        <Icon className="h-7 w-7 text-stone-600" />
      </div>
      <h3 className="text-base font-bold text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-stone-500">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Mono({ children, strong = false, className = "" }: { children: ReactNode; strong?: boolean; className?: string }) {
  return <span className={`whitespace-nowrap font-mono ${strong ? "font-bold text-ink" : "text-xs text-stone-600"} ${className}`}>{children}</span>;
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
            align === "right" ? "end-0" : "start-0"
          }`}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export const menuItem =
  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm font-medium text-stone-700 transition hover:bg-stone-100 hover:text-ink";

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
      <div aria-live="polite" className="pointer-events-none fixed bottom-5 end-5 z-50 flex flex-col items-end gap-2">
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
    <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button type="button" aria-label="Fermer" onClick={onClose} className="absolute inset-0 h-full w-full cursor-default bg-ink/40" />
      <div className="relative max-h-[90vh] sm:max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white p-5 sm:p-6 shadow-2xl transition-all">
        {/* Mobile handle indicator */}
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-stone-300 sm:hidden" />
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

export function ConfirmModal({
  title,
  description,
  message,
  confirmLabel = "Supprimer",
  onConfirm,
  onClose,
  onCancel,
  loading = false,
  open = true,
  isOpen = true,
}: {
  title: string;
  description?: string;
  message?: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
  onClose?: () => void;
  onCancel?: () => void;
  loading?: boolean;
  open?: boolean;
  isOpen?: boolean;
}) {
  const isVisible = open && isOpen;
  if (!isVisible) return null;

  const handleClose = onCancel || onClose || (() => {});
  const desc = description || message || "Cette action est irréversible.";

  return (
    <Modal title={title} description={desc} onClose={handleClose}>
      <div className="flex items-center justify-end gap-3 pt-4">
        <button type="button" onClick={handleClose} disabled={loading} className={button("secondary")}>
          Annuler
        </button>
        <button
          type="button"
          onClick={() => void onConfirm()}
          disabled={loading}
          className={button("danger")}
        >
          {loading ? "Suppression..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}


export function ActionGroup({
  onEdit,
  onDelete,
  editLabel = "Modifier",
  deleteLabel = "Supprimer",
}: {
  onEdit?: () => void;
  onDelete?: () => void;
  editLabel?: string;
  deleteLabel?: string;
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          title={editLabel}
          aria-label={editLabel}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 shadow-xs transition hover:border-stone-300 hover:bg-stone-50 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          title={deleteLabel}
          aria-label={deleteLabel}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50/70 text-red-600 shadow-xs transition hover:border-red-300 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden />
        </button>
      )}
    </div>
  );
}

export function downloadCsv(
  param1: Record<string, unknown>[] | string,
  param2?: string | string[],
  param3?: (string | number)[][],
) {
  if (Array.isArray(param1)) {
    const data = param1;
    const filename = typeof param2 === "string" ? param2.replace(/\.csv$/i, "") : "export";
    if (data.length === 0) return;
    const headers = Object.keys(data[0]!);
    const sanitize = (val: unknown) => `"${String(val ?? "").replace(/"/g, '""')}"`;
    const lines = [
      headers.map(sanitize).join(";"),
      ...data.map((item) => headers.map((h) => sanitize(item[h])).join(";")),
    ];
    const csvContent = "\uFEFF" + lines.join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return;
  }

  const filename = typeof param1 === "string" ? param1.replace(/\.csv$/i, "") : "export";
  const headers = Array.isArray(param2) ? param2 : [];
  const rows = param3 ?? [];
  const sanitize = (val: string | number) => `"${String(val ?? "").replace(/"/g, '""')}"`;
  const csvContent = "\uFEFF" + [headers.map(sanitize).join(";"), ...rows.map((row) => row.map(sanitize).join(";"))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function ExportPeriodToolbar({
  title = "Exporter les données",
  onExportCsv,
  onPrint,
  startDate,
  endDate,
  onPeriodChange,
}: {
  title?: string;
  onExportCsv?: () => void;
  onPrint?: () => void;
  startDate: string;
  endDate: string;
  onPeriodChange: (start: string, end: string) => void;
}) {
  function setPreset(type: "month" | "quarter" | "year" | "all") {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

    if (type === "all") {
      onPeriodChange("2024-01-01", today);
      return;
    }
    if (type === "month") {
      const start = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`;
      onPeriodChange(start, today);
      return;
    }
    if (type === "quarter") {
      const qMonth = Math.floor(now.getMonth() / 3) * 3 + 1;
      const start = `${now.getFullYear()}-${pad(qMonth)}-01`;
      onPeriodChange(start, today);
      return;
    }
    if (type === "year") {
      const start = `${now.getFullYear()}-01-01`;
      onPeriodChange(start, today);
      return;
    }
  }

  return (
    <div className={`${card} flex flex-col gap-3 p-4 text-xs sm:flex-row sm:items-center sm:justify-between`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 font-bold text-ink">
          <Calendar className="h-4 w-4 text-brand" aria-hidden />
          {title} :
        </span>
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onPeriodChange(e.target.value, endDate)}
            className="rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
          <span className="text-stone-400">➔</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onPeriodChange(startDate, e.target.value)}
            className="rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPreset("month")}
            className="rounded-md border border-stone-200 bg-stone-50 px-2 py-1 font-medium text-stone-600 hover:bg-stone-100"
          >
            Ce mois
          </button>
          <button
            type="button"
            onClick={() => setPreset("quarter")}
            className="rounded-md border border-stone-200 bg-stone-50 px-2 py-1 font-medium text-stone-600 hover:bg-stone-100"
          >
            Trimestre
          </button>
          <button
            type="button"
            onClick={() => setPreset("year")}
            className="rounded-md border border-stone-200 bg-stone-50 px-2 py-1 font-medium text-stone-600 hover:bg-stone-100"
          >
            Année
          </button>
          <button
            type="button"
            onClick={() => setPreset("all")}
            className="rounded-md border border-stone-200 bg-stone-50 px-2 py-1 font-medium text-stone-600 hover:bg-stone-100"
          >
            Tout
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        {onExportCsv && (
          <button
            type="button"
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-800 hover:bg-emerald-100"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
            Excel / CSV
          </button>
        )}
        {onPrint && (
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 font-semibold text-stone-700 shadow-xs hover:bg-stone-50 hover:text-ink"
          >
            <Printer className="h-3.5 w-3.5 text-stone-500" aria-hidden />
            Imprimer / PDF
          </button>
        )}
      </div>
    </div>
  );
}

export function formatWhatsAppPhone(phone?: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    return `213${cleaned.slice(1)}`;
  }
  return cleaned;
}

export function shareViaWhatsApp(phone: string | undefined, message: string) {
  const intlPhone = formatWhatsAppPhone(phone);
  const encodedText = encodeURIComponent(message);
  const url = intlPhone ? `https://wa.me/${intlPhone}?text=${encodedText}` : `https://api.whatsapp.com/send?text=${encodedText}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function QuittanceModal({
  paiement,
  residenceNom = "Résidence",
  onClose,
}: {
  paiement: {
    resident: string;
    logement: string;
    montant: number;
    date: string;
    reference: string;
    mode: string;
    telephone?: string;
    encaissePar?: string;
  };
  residenceNom?: string;
  onClose: () => void;
}) {
  const whatsappMsg = `Bonjour ${paiement.resident}, voici votre quittance de règlement des charges de copropriété pour le logement ${paiement.logement} : Montant ${formatDZD(paiement.montant)}, date ${paiement.date}, réf ${paiement.reference}. Document officiel délivré par le Syndic ${residenceNom}. Merci pour votre contribution !`;

  return (
    <Modal title="Quittance de Cotisation & Charges" description="Reçu d'encaissement officiel pour le copropriétaire ou locataire." onClose={onClose}>
      <div id="quittance-print" className="space-y-6 rounded-2xl border border-stone-200 bg-stone-50/50 p-6 text-sm">
        <div className="flex items-start justify-between border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white font-black text-sm">C</span>
              <span className="text-base font-extrabold tracking-tight text-ink">CITY SYNDIC</span>
            </div>
            <p className="mt-1 text-xs text-stone-500">{residenceNom}</p>
          </div>
          <div className="text-right">
            <span className="rounded-md border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
              ACQUITTÉ
            </span>
            <p className="mt-1 font-mono text-xs text-stone-500">Réf : {paiement.reference}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-stone-400">Copropriétaire / Résident</p>
            <p className="mt-0.5 text-sm font-bold text-ink">{paiement.resident}</p>
            {paiement.telephone && <p className="font-mono text-xs text-stone-500">{paiement.telephone}</p>}
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-stone-400">Logement Assigné</p>
            <p className="mt-0.5 text-sm font-bold text-ink">{paiement.logement}</p>
            <p className="text-xs text-stone-500">Charges communes & entretien</p>
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2 text-xs text-stone-500">
            <span>Désignation</span>
            <span>Date d&apos;encaissement</span>
            <span>Montant Réglé</span>
          </div>
          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="font-bold text-ink">Charges de Copropriété</p>
              <p className="text-xs text-stone-500">Règlement par {paiement.mode}</p>
            </div>
            <span className="text-xs text-stone-600">{paiement.date}</span>
            <span className="font-mono text-lg font-bold text-emerald-600">+{formatDZD(paiement.montant)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-stone-500">
          <div>
            <span className="font-medium text-stone-400">Encaissé par : </span>
            <span className="font-semibold text-ink">{paiement.encaissePar || "Administration du Syndic"}</span>
          </div>
          <div className="text-right italic">
            Document officiel tenant lieu de reçu de paiement.
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-stone-200 pt-4 print:hidden">
          <button type="button" onClick={onClose} className={button("secondary")}>
            Fermer
          </button>
          <button
            type="button"
            onClick={() => shareViaWhatsApp(paiement.telephone, whatsappMsg)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
          >
            <MessageCircle className="h-4 w-4 text-emerald-600" aria-hidden />
            Partager WhatsApp
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className={button("primary")}
          >
            <Printer className="h-4 w-4" aria-hidden />
            Imprimer la Quittance
          </button>
        </div>
      </div>
    </Modal>
  );
}

export type RelanceLevel = "amiable" | "avertissement" | "mise_en_demeure";

export function RelanceMiseEnDemeureModal({
  impaye,
  residenceNom = "Résidence",
  onClose,
}: {
  impaye: {
    resident: string;
    logement: string;
    totalDu: number;
    moisImpayes: number;
    telephone?: string;
    dernierReglement?: string;
  };
  residenceNom?: string;
  onClose: () => void;
}) {
  const [level, setLevel] = useState<RelanceLevel>("amiable");
  const today = new Date().toLocaleDateString("fr-FR");

  const levelConfigs = {
    amiable: {
      badge: "Niveau 1 · Rappel Amiable",
      badgeTone: "warning" as Tone,
      title: "RAPPEL DE CHARGES IMPAYÉES (RELANCE AMIABLE)",
      delai: "8 jours",
      objet: `Rappel de cotisations en attente - Logement ${impaye.logement}`,
      intro: `Sauf erreur ou omission de notre part, nous constatons à ce jour que votre compte de charges de copropriété présente un solde débiteur.`,
      actionText: `Nous vous invitons courtoisement à bien vouloir régulariser cette situation sous un délai de huit (8) jours, soit par virement, versement bancaire/CCP ou directement auprès du bureau du syndic.`,
      legalNotice: `En cas de paiement déjà effectué entre-temps, nous vous prions de ne pas tenir compte de cette présente correspondance.`,
      whatsappIntro: `Bonjour ${impaye.resident}, nous constatons un retard de cotisation de ${formatDZD(impaye.totalDu)} (${impaye.moisImpayes} mois) pour votre logement ${impaye.logement}. Merci de bien vouloir régulariser auprès du Syndic sous 8 jours. Bien cordialement.`,
    },
    avertissement: {
      badge: "Niveau 2 · Avertissement Formel",
      badgeTone: "danger" as Tone,
      title: "AVERTISSEMENT FORMEL POUR RETARD DE COTISATION",
      delai: "8 jours",
      objet: `Dernier avis avant mise en demeure - Logement ${impaye.logement}`,
      intro: `Malgré notre précédent rappel resté sans suite favorable, votre compte présente toujours un arriéré important de ${impaye.moisImpayes} mois d'impayés pour un montant total de ${formatDZD(impaye.totalDu)}.`,
      actionText: `Le bon fonctionnement des services communs (électricité Sonelgaz, sécurité, ascenseurs, hygiène) dépend de la contribution rigoureuse de chaque copropriétaire. Nous vous demandons impérativement de solder ce montant sous huitaine.`,
      legalNotice: `À défaut de régularisation intégrale dans ce délai, une procédure officielle de mise en demeure avec majorations et frais de recouvrement sera engagée à votre charge.`,
      whatsappIntro: `AVIS FORMEL : M./Mme ${impaye.resident}, malgré nos relances, vos charges de copropriété (${impaye.logement}) demeurent impayées pour un total de ${formatDZD(impaye.totalDu)}. Merci de régulariser d'urgence sous 8 jours afin d'éviter l'ouverture d'un contentieux.`,
    },
    mise_en_demeure: {
      badge: "Niveau 3 · Mise en Demeure Officielle",
      badgeTone: "dark" as Tone,
      title: "MISE EN DEMEURE OFFICIELLE (SOMMATION DE PAYER SOUS 15 JOURS)",
      delai: "15 jours francs",
      objet: `SOMMATION DE PAYER AVANT ACTION CONTENTIEUSE ET SAISIE - Logement ${impaye.logement}`,
      intro: `Par la présente, en notre qualité de Syndic légalement mandaté de la copropriété ${residenceNom}, nous vous METTONS EN DEMEURE FORMELLE de procéder au règlement immédiat de votre dette s'élevant à ${formatDZD(impaye.totalDu)}.`,
      actionText: `Vous disposez d'un délai impératif de QUINZE (15) JOURS FRANCS à compter de la date de notification de la présente pour solder l'intégralité de cette créance liquide et exigible.`,
      legalNotice: `Vu les dispositions légales régissant la copropriété des immeubles bâtis (Ordonnance n° 76-80 et décrets d'application), à défaut de paiement intégral dans le délai imparti de 15 jours, le dossier sera transmis à notre conseil juridique pour saisine de la juridiction compétente en référé-provision, inscription de privilège immobilier et recouvrement forcé par voie d'huissier de justice, tous frais de justice et intérêts de retard restant intégralement à votre charge exclusive.`,
      whatsappIntro: `MISE EN DEMEURE OFFICIELLE : M./Mme ${impaye.resident} (Logement ${impaye.logement}). Vous êtes mis en demeure de payer la somme de ${formatDZD(impaye.totalDu)} sous 15 jours francs. Passé ce délai, le dossier sera transmis à l'huissier de justice pour poursuite judiciaire. Syndic ${residenceNom}.`,
    },
  };

  const current = levelConfigs[level];

  return (
    <Modal
      title="Recouvrement & Relance Officielle"
      description="Génération de relance amiable, avertissement ou mise en demeure officielle avec sommation de payer."
      onClose={onClose}
    >
      <div className="space-y-6 text-sm">
        {/* Level selector tabs */}
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 p-2">
          <button
            type="button"
            onClick={() => setLevel("amiable")}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold transition ${
              level === "amiable" ? "bg-amber-100 text-amber-900 shadow-xs" : "text-stone-600 hover:bg-stone-200/50"
            }`}
          >
            1. Rappel Amiable
          </button>
          <button
            type="button"
            onClick={() => setLevel("avertissement")}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold transition ${
              level === "avertissement" ? "bg-red-100 text-red-900 shadow-xs" : "text-stone-600 hover:bg-stone-200/50"
            }`}
          >
            2. Avertissement
          </button>
          <button
            type="button"
            onClick={() => setLevel("mise_en_demeure")}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold transition ${
              level === "mise_en_demeure" ? "bg-stone-900 text-white shadow-xs" : "text-stone-600 hover:bg-stone-200/50"
            }`}
          >
            3. Mise en Demeure (15j)
          </button>
        </div>

        {/* Legal Letter Document to Print / Preview */}
        <div id="relance-print" className="space-y-5 rounded-2xl border border-stone-300 bg-white p-6 shadow-xs text-stone-800">
          <div className="flex items-start justify-between border-b border-stone-200 pb-4">
            <div>
              <p className="font-extrabold tracking-tight text-ink text-base">LE SYNDIC DE COPROPRIÉTÉ</p>
              <p className="text-xs text-stone-600 font-semibold">{residenceNom}</p>
              <p className="text-xs text-stone-500">Bureau de gestion immobilière</p>
            </div>
            <div className="text-right">
              <Pill tone={current.badgeTone}>{current.badge}</Pill>
              <p className="mt-1 text-xs text-stone-500">Date : {today}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 rounded-xl bg-stone-50 p-4 border border-stone-200">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Destinataire (Copropriétaire)</p>
              <p className="text-sm font-bold text-ink mt-0.5">{impaye.resident}</p>
              <p className="text-xs text-stone-600">Lot assigné : {impaye.logement}</p>
              {impaye.telephone && <p className="font-mono text-xs text-stone-500">{impaye.telephone}</p>}
            </div>
            <div className="sm:text-right">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Situation Comptable</p>
              <p className="font-mono text-base font-black text-red-600 mt-0.5">{formatDZD(impaye.totalDu)}</p>
              <p className="text-xs text-stone-500">{impaye.moisImpayes} mois d&apos;arriérés constatés</p>
              <p className="text-xs text-stone-400">Dernier règlement : {impaye.dernierReglement || "Néant"}</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold uppercase text-stone-700 tracking-wide">
              Objet : <span className="text-ink">{current.objet}</span>
            </p>
            <p className="text-xs leading-relaxed text-stone-700">{current.intro}</p>
            <div className="rounded-lg border border-red-200 bg-red-50/60 p-3 text-xs font-medium text-red-900 leading-relaxed">
              {current.actionText} Délai accordé : <strong className="underline">{current.delai}</strong>.
            </div>
            <p className="text-[11px] leading-relaxed text-stone-500 italic border-l-2 border-stone-300 pl-3">
              {current.legalNotice}
            </p>
          </div>

          <div className="flex items-end justify-between border-t border-stone-200 pt-4 text-xs text-stone-600">
            <div>
              <p className="font-semibold text-ink">Pour le Syndic de Copropriété</p>
              <p className="text-[11px] text-stone-400">Signature & Cachet Officiel</p>
            </div>
            <div className="h-14 w-32 border border-dashed border-stone-300 rounded flex items-center justify-center text-[10px] text-stone-400 italic">
              Emplacement Cachet
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-stone-200 pt-4 print:hidden">
          <button type="button" onClick={onClose} className={button("secondary")}>
            Fermer
          </button>
          <button
            type="button"
            onClick={() => shareViaWhatsApp(impaye.telephone, current.whatsappIntro)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
          >
            <MessageCircle className="h-4 w-4 text-emerald-600" aria-hidden />
            Envoyer via WhatsApp
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className={button("primary")}
          >
            <Printer className="h-4 w-4" aria-hidden />
            Imprimer Lettre Recommandée / PDF
          </button>
        </div>
      </div>
    </Modal>
  );
}
