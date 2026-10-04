export function formatDZD(amount: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(amount)} DZD`;
}
