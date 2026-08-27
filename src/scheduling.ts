export function nextOccurrence(time: string, from = new Date()): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const result = new Date(from);
  result.setDate(result.getDate() + 1);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

export function isDue(iso: string | undefined, now = new Date()): boolean {
  return Boolean(iso) && now >= new Date(iso!);
}
