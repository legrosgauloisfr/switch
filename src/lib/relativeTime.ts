// Small French relative-time formatter — used for notifications sourced from Supabase
// (created_at timestamp) instead of hand-typed "when" strings.
export function relativeTimeFr(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "À l'instant";
  if (min < 60) return `Il y a ${min} minute${min > 1 ? "s" : ""}`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? "s" : ""}`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days} jours`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `Il y a ${weeks} semaine${weeks > 1 ? "s" : ""}`;
  return new Date(iso).toLocaleDateString("fr-FR");
}
