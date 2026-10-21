// Case-insensitive match that ignores spaces, punctuation and single-letter initials.
const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const core = (s: string) =>
  s.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 1).join('');

export function matches(name: string, query: string): boolean {
  const q = core(query) || squash(query);
  if (!q) return false;
  return core(name).includes(q) || squash(name).includes(squash(query));
}
