"use client";

import { useId } from "react";

export type Series = { name: string; color: string; values: number[] };

const W = 640;
const H = 240;
const PAD = { top: 16, right: 16, bottom: 28, left: 52 };
const TICKS = 4;

const compact = new Intl.NumberFormat("fr-FR", { notation: "compact", maximumFractionDigits: 1 });
const full = new Intl.NumberFormat("fr-FR");

// Rounds the axis up so every tick lands on a readable value (1, 2, 5 × 10^n).
function niceScale(max: number): number {
  if (max <= 0) return TICKS;
  const rawStep = max / TICKS;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const step = [1, 2, 5, 10].map((m) => m * magnitude).find((s) => s >= rawStep) ?? 10 * magnitude;
  return Math.max(step, 1) * TICKS;
}

function Legend({ items }: { items: { name: string; color: string }[] }) {
  return (
    <ul className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-600">
      {items.map((s) => (
        <li key={s.name} className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} aria-hidden />
          {s.name}
        </li>
      ))}
    </ul>
  );
}

function Axes({ labels, yMax }: { labels: string[]; yMax: number }) {
  const innerH = H - PAD.top - PAD.bottom;
  const innerW = W - PAD.left - PAD.right;
  const every = Math.ceil(labels.length / 12);
  return (
    <>
      {Array.from({ length: TICKS + 1 }, (_, i) => {
        const y = PAD.top + innerH - (innerH * i) / TICKS;
        return (
          <g key={i}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="#e7e5e4" strokeDasharray={i === 0 ? undefined : "3 4"} />
            <text x={PAD.left - 8} y={y + 4} textAnchor="end" className="fill-stone-400 text-[11px]">
              {compact.format((yMax * i) / TICKS)}
            </text>
          </g>
        );
      })}
      {labels.map((label, i) =>
        i % every === 0 ? (
          <text
            key={label + i}
            x={PAD.left + (labels.length === 1 ? innerW / 2 : (innerW * i) / (labels.length - 1))}
            y={H - 8}
            textAnchor="middle"
            className="fill-stone-400 text-[11px]"
          >
            {label}
          </text>
        ) : null,
      )}
    </>
  );
}

export function LineChart({ labels, series, area = false, unit = "" }: { labels: string[]; series: Series[]; area?: boolean; unit?: string }) {
  const gradientId = useId();
  const innerH = H - PAD.top - PAD.bottom;
  const innerW = W - PAD.left - PAD.right;
  const yMax = niceScale(Math.max(0, ...series.flatMap((s) => s.values)));
  const x = (i: number) => PAD.left + (labels.length === 1 ? innerW / 2 : (innerW * i) / (labels.length - 1));
  const y = (v: number) => PAD.top + innerH - (innerH * v) / yMax;

  return (
    <div>
      <Legend items={series} />
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={series.map((s) => s.name).join(", ")}>
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={series[0]?.color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={series[0]?.color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <Axes labels={labels} yMax={yMax} />
        {series.map((s, si) => {
          const points = s.values.map((v, i) => `${x(i)},${y(v)}`);
          return (
            <g key={s.name}>
              {area && si === 0 && points.length > 1 && (
                <path d={`M${x(0)},${y(0)} L${points.join(" L")} L${x(s.values.length - 1)},${y(0)} Z`} fill={`url(#${gradientId})`} />
              )}
              <polyline points={points.join(" ")} fill="none" stroke={s.color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
              {s.values.map((v, i) => (
                <circle key={i} cx={x(i)} cy={y(v)} r={3.5} fill="white" stroke={s.color} strokeWidth={2}>
                  <title>{`${s.name} · ${labels[i]} : ${full.format(v)}${unit}`}</title>
                </circle>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function ColumnChart({ labels, values, color, name }: { labels: string[]; values: number[]; color: string; name: string }) {
  const innerH = H - PAD.top - PAD.bottom;
  const innerW = W - PAD.left - PAD.right;
  const yMax = niceScale(Math.max(0, ...values));
  const slot = innerW / Math.max(values.length, 1);
  const barW = Math.min(28, slot * 0.6);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={name}>
      <Axes labels={[]} yMax={yMax} />
      {values.map((v, i) => {
        const h = (innerH * v) / yMax;
        const cx = PAD.left + slot * i + slot / 2;
        return (
          <g key={labels[i] ?? i}>
            <rect x={cx - barW / 2} y={PAD.top + innerH - h} width={barW} height={Math.max(h, 0)} rx={5} fill={color}>
              <title>{`${name} · ${labels[i]} : ${full.format(v)}`}</title>
            </rect>
            {i % Math.ceil(values.length / 12) === 0 && (
              <text x={cx} y={H - 8} textAnchor="middle" className="fill-stone-400 text-[11px]">
                {labels[i]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function DonutChart({ segments, centerLabel }: { segments: { label: string; value: number; color: string }[]; centerLabel: string }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const r = 42;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <svg viewBox="0 0 120 120" className="h-36 w-36 shrink-0 -rotate-90" role="img" aria-label={segments.map((s) => `${s.label} ${s.value}`).join(", ")}>
        <circle cx="60" cy="60" r={r} fill="none" stroke="#f5f5f4" strokeWidth="14" />
        {total > 0 &&
          segments.map((s) => {
            const length = (s.value / total) * circumference;
            const dash = (
              <circle
                key={s.label}
                cx="60"
                cy="60"
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth="14"
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={-offset}
              >
                <title>{`${s.label} : ${full.format(s.value)}`}</title>
              </circle>
            );
            offset += length;
            return dash;
          })}
        <g className="rotate-90" style={{ transformOrigin: "60px 60px" }}>
          <text x="60" y="58" textAnchor="middle" className="fill-ink text-[20px] font-bold">
            {full.format(total)}
          </text>
          <text x="60" y="74" textAnchor="middle" className="fill-stone-400 text-[9px]">
            {centerLabel}
          </text>
        </g>
      </svg>
      <ul className="w-full space-y-2 text-sm">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-stone-600">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} aria-hidden />
              {s.label}
            </span>
            <span className="font-semibold text-ink">
              {full.format(s.value)}
              <span className="ml-1 text-xs font-normal text-stone-400">{total ? Math.round((s.value / total) * 100) : 0}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BarList({ items, empty }: { items: { label: string; value: number }[]; empty: string }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  if (items.length === 0) return <p className="py-8 text-center text-sm text-stone-500">{empty}</p>;
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label}>
          <div className="mb-1 flex justify-between gap-3 text-sm">
            <span className="truncate text-stone-600">{item.label}</span>
            <span className="font-semibold text-ink">{full.format(item.value)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-stone-100">
            <div className="h-full rounded-full bg-brand" style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
