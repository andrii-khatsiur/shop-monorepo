const alphabet: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "yo",
  ж: "zh",
  з: "z",
  и: "y",
  й: "j",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  і: "i",
  є: "e",
  ю: "yu",
  я: "ya",
};

export function slugify(str: string): string {
  const transliterated = str
    .toLowerCase()
    .split("")
    .map((c) => alphabet[c] ?? c)
    .join("");

  return transliterated.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); // обрізаємо "-" на початку/кінці
}

export function calculateDiscount(
  price: number,
  oldPrice?: number | null
): number | null {
  if (!oldPrice || oldPrice <= 0) return null;
  return 100 - Math.round((price / oldPrice) * 100);
}
