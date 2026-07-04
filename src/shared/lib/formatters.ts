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

// 2042-02-17T00:00:00.000 → 17.02.2042
export function formatLicenseDate(value: string | null | undefined): string {
  if (!value) return "";
  const stripped = value.replace(/^До\s+/, "");
  const iso = stripped.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return iso ? `${iso[3]}.${iso[2]}.${iso[1]}` : stripped;
}

// 17.02.2042 → 2042-02-17
export function unformatLicenseDate(value: string): string {
  const match = value.trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return value;
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("uk-UA").format(value) + "\u00A0₴";
}

export function formatYAxis(value: number): string {
  if (value === 0) return "0";
  return `${value / 1000}\u00A0000`;
}
