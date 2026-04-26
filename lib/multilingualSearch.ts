/**
 * Multilingual search index for Simba Supermarket.
 * Maps French and Kinyarwanda product names/keywords to English product IDs
 * so the local instant search works natively in all supported languages.
 */

// Each entry: [keyword/phrase (lowercase), productId]
// Built from locales/fr.json and locales/rw.json product translations.
const MULTILINGUAL_INDEX: [string, string][] = [
  // ─── French keywords ───────────────────────────────────────────────────────
  ['lait', 'prod-001'],
  ['lait frais', 'prod-001'],
  ['inyange lait', 'prod-001'],
  ['café arabica', 'prod-002'],
  ['café rwandais', 'prod-002'],
  ['café gorilla', 'prod-006'],
  ['torréfaction', 'prod-006'],
  ['avocat', 'prod-003'],
  ['avocats', 'prod-003'],
  ['bière mutzig', 'prod-004'],
  ['mutzig', 'prod-004'],
  ['bière skol', 'prod-011'],
  ['skol', 'prod-011'],
  ['farine', 'prod-005'],
  ['farine de blé', 'prod-005'],
  ['bananes', 'prod-007'],
  ['banane', 'prod-007'],
  ['miel', 'prod-008'],
  ['akarabo', 'prod-008'],
  ['yaourt', 'prod-009'],
  ['yaourt fraise', 'prod-009'],
  ['tomates', 'prod-010'],
  ['tomate fraîche', 'prod-010'],
  ['riz', 'prod-012'],
  ['riz basmati', 'prod-012'],
  ['œufs', 'prod-013'],
  ['oeufs', 'prod-013'],
  ['œuf', 'prod-013'],
  ['oignons', 'prod-014'],
  ['oignon rouge', 'prod-014'],
  ['huile', 'prod-015'],
  ['huile de tournesol', 'prod-015'],
  ['poivrons', 'prod-016'],
  ['poivron vert', 'prod-016'],
  ['eau', 'prod-017'],
  ['eau inyange', 'prod-017'],
  ['sucre', 'prod-018'],
  ['sucre blanc', 'prod-018'],
  ['fromage', 'prod-019'],
  ['fromage cheddar', 'prod-019'],
  ['cheddar', 'prod-019'],
  ['jus', 'prod-020'],
  ['jus de fruit', 'prod-020'],
  ['passion', 'prod-020'],
  ['bière', 'prod-004'],
  ['café', 'prod-002'],
  ['thé noir', 'prod-023'],
  ['the noir', 'prod-023'],
  ['thé', 'prod-023'],
  ['croissant', 'prod-024'],
  ['croissants', 'prod-024'],
  ['boulangerie', 'prod-024'],
  ['bœuf', 'prod-025'],
  ['boeuf', 'prod-025'],
  ['viande', 'prod-025'],
  ['chips de manioc', 'prod-026'],
  ['manioc', 'prod-026'],
  ['chips', 'prod-026'],
  ['fruits surgelés', 'prod-027'],
  ['surgelé', 'prod-027'],
  ['baies', 'prod-027'],
  ['couches', 'prod-028'],
  ['couche bébé', 'prod-028'],
  ['bébé', 'prod-028'],
  ['nettoyant', 'prod-029'],
  ['produit ménager', 'prod-029'],
  ['cuisine', 'prod-029'],

  // ─── Kinyarwanda keywords ──────────────────────────────────────────────────
  ['amata', 'prod-001'],
  ['amata y\'inyange', 'prod-001'],
  ['ikawa', 'prod-002'],
  ['ikawa y\'arabica', 'prod-002'],
  ['ikawa ya gorilla', 'prod-006'],
  ['avoka', 'prod-003'],
  ['byeri ya mutzig', 'prod-004'],
  ['byeri', 'prod-004'],
  ['byeri ya skol', 'prod-011'],
  ['ifu', 'prod-005'],
  ['ifu y\'ingano', 'prod-005'],
  ['ibitoki', 'prod-007'],
  ['ubuki', 'prod-008'],
  ['ubuki bwa akarabo', 'prod-008'],
  ['yaourt', 'prod-009'],
  ['yaourt y\'inkeri', 'prod-009'],
  ['inyanya', 'prod-010'],
  ['umuceri', 'prod-012'],
  ['umuceri basmati', 'prod-012'],
  ['amagi', 'prod-013'],
  ['ibitunguru', 'prod-014'],
  ['ibitunguru bitukura', 'prod-014'],
  ['amavuta', 'prod-015'],
  ['amavuta ya tournesol', 'prod-015'],
  ['poivuroni', 'prod-016'],
  ['amazi', 'prod-017'],
  ['amazi y\'inyange', 'prod-017'],
  ['isukari', 'prod-018'],
  ['fromage', 'prod-019'],
  ['umutobe', 'prod-020'],
  ['umutobe w\'amafaranga', 'prod-020'],
  ['icyayi', 'prod-023'],
  ['icyayi cy\'u rwanda', 'prod-023'],
  ['imigati', 'prod-024'],
  ['croissant', 'prod-024'],
  ['inyama', 'prod-025'],
  ['ubwo bwa inka', 'prod-025'],
  ['ubunyobwa bwa kasava', 'prod-026'],
  ['kasava', 'prod-026'],
  ['ibiribwa bikonje', 'prod-027'],
  ['baies bikonje', 'prod-027'],
  ['pampers', 'prod-028'],
  ['pelete', 'prod-028'],
  ['diapers', 'prod-028'],
  ['iby\'abana', 'prod-028'],
  ['isuku', 'prod-029'],
  ['gusukura', 'prod-029'],
  ['nettoyant', 'prod-029'],

  // ─── Common conversational stopwords to strip ──────────────────────────────
  // (handled in the search function below)
];

const STOPWORDS = new Set([
  // English
  'do', 'you', 'have', 'i', 'need', 'want', 'search', 'for', 'please',
  'get', 'me', 'find', 'show', 'a', 'an', 'the', 'some', 'any',
  // French
  'avez', 'vous', 'est', 'ce', 'que', 'je', 'veux', 'cherche', 'du',
  'de', 'la', 'le', 'les', 'des', 'un', 'une', 'avec', 'et', 'ou',
  // Kinyarwanda
  'mfite', 'murafite', 'nshaka', 'gerageza', 'nkeneye',
]);

/**
 * Given a raw search query, returns a Set of product IDs matched by
 * multilingual keyword lookup (FR + RW), complementing the English text match.
 */
export function multilingualSearchIds(query: string): Set<string> {
  const lower = query.toLowerCase().trim();
  const matched = new Set<string>();

  // Check full phrase matches first
  for (const [keyword, id] of MULTILINGUAL_INDEX) {
    if (lower.includes(keyword)) {
      matched.add(id);
    }
  }

  // Also try stripping stopwords and matching individual tokens
  const tokens = lower
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));

  for (const token of tokens) {
    for (const [keyword, id] of MULTILINGUAL_INDEX) {
      if (keyword.includes(token) || token.includes(keyword)) {
        matched.add(id);
      }
    }
  }

  return matched;
}
