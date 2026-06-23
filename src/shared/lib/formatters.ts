// +380XXXXXXXXX → +38097 480 24 28
export function formatPhone(value: string | null | undefined): string {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 12 || !digits.startsWith("380")) return value;
  return `+${digits.slice(0, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`;
}

export function unformatPhone(value: string): string {
  return value.replace(/\s/g, "");
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("uk-UA").format(value) + "\u00A0₴";
}

export function formatYAxis(value: number): string {
  if (value === 0) return "0";
  return `${value / 1000}\u00A0000`;
}
