/** Маска российского номера: +7 (999) 123-45-67 */
export function formatPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");

  if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  if (!digits.startsWith("7")) digits = `7${digits}`;

  const rest = digits.slice(1, 11);
  if (rest.length === 0) return "+7 ";

  let out = "+7 (" + rest.slice(0, 3);
  if (rest.length >= 3) out += ") " + rest.slice(3, 6);
  if (rest.length >= 6) out += "-" + rest.slice(6, 8);
  if (rest.length >= 8) out += "-" + rest.slice(8, 10);

  return out;
}

export function phoneDigits(masked: string): string {
  return masked.replace(/\D/g, "");
}

export const isPhoneComplete = (masked: string) =>
  phoneDigits(masked).length === 11;
