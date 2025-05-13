/**
 * Compares two strings based on their Unicode code point values.
 * This provides an ASCII-like ordering where comparison is purely numerical
 * based on the character codes.
 * @param a The first string.
 * @param b The second string.
 * @returns -1 if a < b, 1 if a > b, 0 if a === b according to code point order.
 */
export function compareByCodePoint(
  a: string,
  b: string,
  caseInsensitive: boolean = false
): number {
  if (caseInsensitive) {
    a = a.toLocaleUpperCase();
    b = b.toLocaleUpperCase();
  }

  const len = Math.min(a.length, b.length);

  for (let i = 0; i < len; i++) {
    // Use codePointAt for robustness with characters outside BMP (Basic
    // Multilingual Plane).
    const codePointA = a.codePointAt(i);
    const codePointB = b.codePointAt(i);

    // Handle potential undefined if indices were somehow invalid (shouldn't
    // happen here).
    if (codePointA === undefined || codePointB === undefined) {
      break; // Should rely on length comparison below
    }

    if (codePointA !== codePointB) {
      // Return -1 if A < B, 1 if A > B.
      return Math.sign(codePointA - codePointB);
    }
  }

  // If one string is a prefix of the other, the shorter string comes first.
  // Return -1 if a.length < b.length, 1 if a.length > b.length, 0 if equal
  // length.
  return Math.sign(a.length - b.length);
}
