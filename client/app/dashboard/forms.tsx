"use client";

import { KeyRound } from "lucide-react";
import { useId, useState, type ReactNode, type SelectHTMLAttributes } from "react";
import { Field, button, describeError, inputClass } from "./ui";

export type FormErrorState = { message: string; details: string[] } | null;

export const formText = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

export function useSubmit() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<FormErrorState>(null);

  async function run(action: () => Promise<void>) {
    setSubmitting(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(describeError(err));
      setSubmitting(false);
    }
  }

  return { submitting, error, run };
}

export function ModalActions({ submitting, label, onCancel }: { submitting: boolean; label: string; onCancel: () => void }) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <button type="button" onClick={onCancel} className={button("secondary")}>
        Annuler
      </button>
      <button type="submit" disabled={submitting} className={button("primary")}>
        {submitting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />}
        {submitting ? "Enregistrement..." : label}
      </button>
    </div>
  );
}

function generatePassword(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  const chars = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `${chars.slice(0, 6)}-${chars.slice(6, 12)}-${chars.slice(12)}`;
}

export function PasswordField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Field
            label="Mot de passe initial"
            name="password"
            type="text"
            required
            minLength={12}
            maxLength={128}
            autoComplete="new-password"
            spellCheck={false}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="font-mono"
          />
        </div>
        <button type="button" onClick={() => onChange(generatePassword())} className={`${button("secondary")} shrink-0`}>
          <KeyRound className="h-4 w-4" aria-hidden />
          Générer
        </button>
      </div>
      <p className="text-[11px] text-stone-500">12 caractères minimum. Transmettez-le à la personne de façon sécurisée.</p>
    </div>
  );
}

export function SelectField({ label, children, ...props }: { label: string; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold text-stone-700">
        {label}
      </label>
      <select id={id} className={inputClass} {...props}>
        {children}
      </select>
    </div>
  );
}
