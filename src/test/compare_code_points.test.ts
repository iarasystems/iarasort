// Import the 'assert' module from Node.js for making assertions.

import * as assert from "assert";

import { compareByCodePoint } from "../compare_codepoint";

// Test suite for compareByCodePoint
// Mocha uses 'suite' or 'describe' for grouping tests
suite("compareByCodePoint Function Tests", () => {
  test("should return 0 for identical strings", () => {
    assert.strictEqual(compareByCodePoint("hello", "hello"), 0);
  });

  test("should return -1 when a < b lexicographically by code point", () => {
    assert.strictEqual(compareByCodePoint("apple", "banana"), -1); // 'a' (97) < 'b' (98)
  });

  test("should return 1 when a > b lexicographically by code point", () => {
    assert.strictEqual(compareByCodePoint("zebra", "yak"), 1); // 'z' (122) > 'y' (121)
  });

  test("should be case-sensitive (uppercase before lowercase)", () => {
    assert.strictEqual(compareByCodePoint("Apple", "apple"), -1); // 'A' (65) < 'a' (97)
  });

  test("should handle mixed case correctly", () => {
    assert.strictEqual(compareByCodePoint("aPPLE", "apple"), -1);
  });

  test("should return -1 if a is a prefix of b", () => {
    assert.strictEqual(compareByCodePoint("cat", "caterpillar"), -1);
  });

  test("should return 1 if b is a prefix of a", () => {
    assert.strictEqual(compareByCodePoint("banana", "ban"), 1);
  });

  test("should return 0 for two empty strings", () => {
    assert.strictEqual(compareByCodePoint("", ""), 0);
  });

  test("should return -1 when a is empty and b is not", () => {
    assert.strictEqual(compareByCodePoint("", "text"), -1);
  });

  test("should return 1 when b is empty and a is not", () => {
    assert.strictEqual(compareByCodePoint("text", ""), 1);
  });

  test("should compare numbers as characters", () => {
    assert.strictEqual(compareByCodePoint("100", "20"), -1); // '1' (49) < '2' (50)
    assert.strictEqual(compareByCodePoint("9", "10"), 1); // '9' (57) > '1' (49)
  });

  test("should handle special characters based on code points", () => {
    assert.strictEqual(compareByCodePoint("!", "#"), -1); // '!' (33) < '#' (35)
    assert.strictEqual(compareByCodePoint("$", "%"), -1); // '$' (36) < '%' (37)
    assert.strictEqual(compareByCodePoint("@", ">"), 1); // '@' (64) > '>' (62)
  });

  test("should correctly compare strings with basic Unicode characters", () => {
    assert.strictEqual(compareByCodePoint("résumé", "resume"), 1);
    assert.strictEqual(compareByCodePoint("你好", "你好世界"), -1); // "你好" is prefix
  });

  test("should correctly compare strings with supplementary Unicode characters (emojis)", () => {
    // 🍎 (U+1F34E, cp: 127822) vs 🍌 (U+1F34C, cp: 127820)
    assert.strictEqual(compareByCodePoint("🍎", "🍌"), 1);
    assert.strictEqual(compareByCodePoint("🍌", "🍎"), -1);

    // ⭐ (U+2B50, cp: 11088) vs ✨ (U+2728, cp: 10024)
    assert.strictEqual(compareByCodePoint("⭐", "✨"), 1);
    assert.strictEqual(compareByCodePoint("✨", "⭐"), -1);

    assert.strictEqual(compareByCodePoint("a🍎b", "a🍌c"), 1); // Compares 🍎 and 🍌
    assert.strictEqual(compareByCodePoint("🍎a", "🍎b"), -1); // Compares a and b
  });

  test('should correctly compare "test" and "testing" (prefix and length)', () => {
    assert.strictEqual(compareByCodePoint("test", "testing"), -1);
  });

  test('should correctly compare "testing" and "test" (prefix and length)', () => {
    assert.strictEqual(compareByCodePoint("testing", "test"), 1);
  });

  test('should compare "bca" and "acb" correctly', () => {
    assert.strictEqual(compareByCodePoint("bca", "acb"), 1); // 'b' > 'a'
  });

  test("should return 0 for identical strings with supplementary characters", () => {
    assert.strictEqual(compareByCodePoint("🚀🌌", "🚀🌌"), 0);
  });

  test("should correctly compare mixed BMP and supplementary characters", () => {
    assert.strictEqual(compareByCodePoint("text🍎", "text🍌"), 1);
    assert.strictEqual(compareByCodePoint("🍎text", "🍌text"), 1);
    assert.strictEqual(compareByCodePoint("a🍎", "a🍌"), 1);
    assert.strictEqual(compareByCodePoint("🍎a", "🍎b"), -1);
  });

  test("should handle supplementary characters interrupting BMP characters", () => {
    // 'te🌟st' vs 'test'
    // 't' === 't'
    // 'e' === 'e'
    // '🌟' (cp: 127775) vs 's' (cp: 115) -> '🌟' > 's'
    assert.strictEqual(compareByCodePoint("te🌟st", "test"), 1);

    // 'test' vs 'te🌟st'
    // 's' (cp: 115) vs '🌟' (cp: 127775) -> 's' < '🌟'
    assert.strictEqual(compareByCodePoint("test", "te🌟st"), -1);
  });

  test("should handle complex cases with null and special Unicode characters", () => {
    assert.strictEqual(compareByCodePoint("string1", "string2"), -1);
    assert.strictEqual(compareByCodePoint("abc\u0000def", "abc\u0001def"), -1);
    assert.strictEqual(compareByCodePoint("abc\uFFFFdef", "abc\uFFFEdef"), 1);
  });

  test("should handle surrogate pairs correctly against single characters", () => {
    const highSurrogate = "\uD83C"; // Part of 🍎 (U+1F34E = D83C DF4E), cp: 55356
    const emojiApple = "\uD83C\uDF4E"; // "🍎", cp: 127822

    // '🍎' (127822) vs 'z' (122)
    assert.strictEqual(compareByCodePoint(emojiApple, "z"), 1);
    // 'z' (122) vs '🍎' (127822)
    assert.strictEqual(compareByCodePoint("z", emojiApple), -1);

    // 'a' (97) vs high surrogate (55356)
    // Note: A lone surrogate isn't a complete character, but codePointAt will return its value.
    assert.strictEqual(compareByCodePoint("a", highSurrogate), -1);
  });

  test("some special characters", () => {
    assert.strictEqual(compareByCodePoint("a_file.cpp", "a_file", true), 1);
    assert.strictEqual(compareByCodePoint(".", "_", true), -1);
  });

  // Test case 1: Identical strings (case-insensitive)
  test("should return 0 for identical strings regardless of case", () => {
    assert.strictEqual(compareByCodePoint("hello", "hello", true), 0);
    assert.strictEqual(compareByCodePoint("HELLO", "HELLO", true), 0);
    assert.strictEqual(compareByCodePoint("HeLlO", "HeLlO", true), 0);
    assert.strictEqual(compareByCodePoint("", "", true), 0); // Empty strings
  });

  // Test case 2: Strings differing only in case
  test("should return 0 for strings that differ only in case", () => {
    assert.strictEqual(compareByCodePoint("hello", "HELLO", true), 0);
    assert.strictEqual(compareByCodePoint("HELLO", "hello", true), 0);
    assert.strictEqual(compareByCodePoint("HeLlO", "hElLo", true), 0);
  });

  // Test case 3: Comparing strings with different casing and order
  test("should return correct comparison result ignoring case", () => {
    assert.strictEqual(compareByCodePoint("apple", "Banana", true), -1); // 'a' comes before 'b'
    assert.strictEqual(compareByCodePoint("Banana", "apple", true), 1); // 'b' comes after 'a'
    assert.strictEqual(compareByCodePoint("Zebra", "aardvark", true), 1); // 'z' comes after 'a'
    assert.strictEqual(compareByCodePoint("aardvark", "Zebra", true), -1); // 'a' comes before 'z'
  });

  // Test case 4: Comparing strings with different lengths but similar characters (case-insensitive)
  test("should handle different lengths correctly ignoring case", () => {
    assert.strictEqual(compareByCodePoint("test", "testing", true), -1); // 'test' is a prefix of 'testing'
    assert.strictEqual(compareByCodePoint("TEST", "testing", true), -1);
    assert.strictEqual(compareByCodePoint("testing", "test", true), 1);
    assert.strictEqual(compareByCodePoint("TESTING", "test", true), 1);
    assert.strictEqual(compareByCodePoint("abc", "abcd", true), -1);
    assert.strictEqual(compareByCodePoint("ABCD", "abc", true), 1);
  });

  // Test case 5: Comparing strings with special characters (case-insensitive behavior depends on locale, but for code point it might treat them differently)
  // Note: Case-insensitive comparison for non-ASCII characters can be complex and locale-dependent.
  // These tests assume a simple toLowerCase() or similar approach is used internally.
  test("should handle special characters ignoring case", () => {
    // Example with accented characters (behavior might vary based on implementation)
    assert.strictEqual(compareByCodePoint("résumé", "RÉSUMÉ", true), 0); // Assuming 'é' is treated same as 'e' case-insensitively
    assert.strictEqual(compareByCodePoint("Straße", "STRASSE", true), 0); // Assuming 'ß' is treated same as 'ss' case-insensitively
  });

  // Test case 6: Comparing strings with numbers and symbols (case-insensitive doesn't typically affect these)
  test("should handle numbers and symbols correctly ignoring case", () => {
    assert.strictEqual(compareByCodePoint("123", "123", true), 0);
    assert.strictEqual(compareByCodePoint("abc1", "ABC2", true), -1); // '1' < '2'
    assert.strictEqual(compareByCodePoint("!@#", "!@#", true), 0);
    assert.strictEqual(compareByCodePoint("abc!", "ABC@", true), -1); // '!' < '@'
  });

  suite("Stable Sorting Tests", () => {
    test("should preserve order for case-insensitive duplicates (stable sort)", () => {
      const input = ["apple", "Apple", "Banana"];
      const expected = ["apple", "Apple", "Banana"];
      const result = [...input].sort((a, b) => compareByCodePoint(a, b, true));
      assert.deepStrictEqual(result, expected);
    });

    test("should preserve order for case-insensitive duplicates (reversed input)", () => {
      const input = ["Apple", "apple", "Banana"];
      const expected = ["Apple", "apple", "Banana"];
      const result = [...input].sort((a, b) => compareByCodePoint(a, b, true));
      assert.deepStrictEqual(result, expected);
    });

    test("should sort different words case-insensitively", () => {
      const input = ["Banana", "apple"];
      const expected = ["apple", "Banana"];
      const result = [...input].sort((a, b) => compareByCodePoint(a, b, true));
      assert.deepStrictEqual(result, expected);
    });
  });
});
