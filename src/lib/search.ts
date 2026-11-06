import { Product } from "@/types";

// =========================================
// Arabic normalization:
// - remove diacritics
// - unify alef / taa marbuta / yaa
// - remove tatweel
// =========================================
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\u064B-\u0652]/g, "") // remove diacritics
    .replace(/\u0640/g, "") // remove tatweel
    .replace(/[أإآ]/g, "ا") // unify alef
    .replace(/ة/g, "ه") // taa marbuta → haa
    .replace(/ى/g, "ي") // alef maqsura → yaa
    .replace(/[^\w\s\u0600-\u06FF]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Strip the Arabic definite article "ال" from the start of a word. */
function stripAl(word: string): string {
  return word.replace(/^ال/, "");
}

// =========================================
// Filter products — every term must match (AND)
// Searches: name (AR/EN), description (AR/EN), categories
// =========================================
export function searchProductsLocal(
  products: Product[],
  query: string,
): Product[] {
  const q = normalizeText(query);
  if (!q) return products;

  const terms = q.split(" ").filter(Boolean);

  return products.filter((p) => {
    const haystack = normalizeText(
      [
        p.name,
        p.nameEn,
        p.description,
        p.descriptionEn,
        ...(p.categories ?? []),
      ].join(" "),
    );

    return terms.every(
      (t) => haystack.includes(t) || haystack.includes(stripAl(t)),
    );
  });
}

// =========================================
// Rank results by relevance:
// - exact name match → highest
// - name starts with query → high
// - name contains query → medium
// - description contains query → low
// =========================================
export function rankSearchResults(
  products: Product[],
  query: string,
): Product[] {
  const q = normalizeText(query);
  if (!q) return products;

  const qNoAl = stripAl(q);

  const scored = products.map((p) => {
    const name = normalizeText(p.name);
    const nameNoAl = stripAl(name);
    const nameEn = normalizeText(p.nameEn);
    const desc = normalizeText(p.description);

    let score = 0;

    if (name === q || nameNoAl === qNoAl) score += 20;
    else if (
      name.startsWith(q) ||
      nameNoAl.startsWith(qNoAl) ||
      nameEn.startsWith(q)
    )
      score += 10;
    else if (name.includes(q) || name.includes(qNoAl) || nameEn.includes(q))
      score += 5;

    if (desc.includes(q)) score += 1;

    return { p, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.p);
}

// =========================================
// ✅ Autocomplete suggestions — accepts a SINGLE character.
// Returns up to `limit` products for the dropdown.
// =========================================
export function getSearchSuggestions(
  products: Product[],
  query: string,
  limit = 6,
): Product[] {
  const q = normalizeText(query);
  if (!q) return [];

  const qNoAl = stripAl(q);

  const matched = products.filter((p) => {
    const name = normalizeText(p.name);
    const nameNoAl = stripAl(name);
    const nameEn = normalizeText(p.nameEn);
    return name.includes(q) || nameNoAl.includes(qNoAl) || nameEn.includes(q);
  });

  // Sort: products starting with the letter first
  return matched
    .sort((a, b) => {
      const aName = stripAl(normalizeText(a.name));
      const bName = stripAl(normalizeText(b.name));
      const aStarts = aName.startsWith(qNoAl) ? 1 : 0;
      const bStarts = bName.startsWith(qNoAl) ? 1 : 0;
      return bStarts - aStarts;
    })
    .slice(0, limit);
}
