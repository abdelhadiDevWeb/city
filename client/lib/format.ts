export function formatDZD(amount: number, locale?: string): string {
  let loc = locale;
  if (!loc && typeof document !== "undefined") {
    loc = document.documentElement.lang || "fr";
  }
  const isAr = loc === "ar";
  const numLoc = isAr ? "ar-DZ" : loc === "en" ? "en-US" : "fr-FR";
  const formatted = new Intl.NumberFormat(numLoc, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount || 0);

  return isAr ? `${formatted} د.ج` : `${formatted} DZD`;
}
