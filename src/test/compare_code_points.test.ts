// Import the 'assert' module from Node.js for making assertions.

import * as assert from "assert";

import { compareByCodePoint } from "../compare_codepoint";

// Test suite for compareByCodePoint
// Mocha uses 'suite' or 'describe' for grouping tests
suite("compareByCodePoint Function Tests", () => {
  // Mocha uses 'test' or 'it' for individual test cases
  test("should return 0 for identical strings", () => {
    assert.strictEqual(
      compareByCodePoint("hello", "hello"),
      0,
      "Test Case 1 Failed: Identical strings"
    );
  });

  test("should return -1 when a < b lexicographically by code point", () => {
    assert.strictEqual(
      compareByCodePoint("apple", "banana"),
      -1,
      "Test Case 2a Failed: a < b"
    ); // 'a' (97) < 'b' (98)
  });

  test("should return 1 when a > b lexicographically by code point", () => {
    assert.strictEqual(
      compareByCodePoint("zebra", "yak"),
      1,
      "Test Case 2b Failed: a > b"
    ); // 'z' (122) > 'y' (121)
  });

  test("should be case-sensitive (uppercase before lowercase)", () => {
    assert.strictEqual(
      compareByCodePoint("Apple", "apple"),
      -1,
      "Test Case 3a Failed: Case sensitivity 'Apple' vs 'apple'"
    ); // 'A' (65) < 'a' (97)
  });

  test("should handle mixed case correctly", () => {
    // 'aPPLE' vs 'apple'
    // 'a' === 'a'
    // 'P' (80) vs 'p' (112) -> 'P' < 'p'
    assert.strictEqual(
      compareByCodePoint("aPPLE", "apple"),
      -1,
      "Test Case 3b Failed: Mixed case 'aPPLE' vs 'apple'"
    );
  });

  test("should return -1 if a is a prefix of b", () => {
    assert.strictEqual(
      compareByCodePoint("cat", "caterpillar"),
      -1,
      "Test Case 4 Failed: a is prefix of b"
    );
  });

  test("should return 1 if b is a prefix of a", () => {
    assert.strictEqual(
      compareByCodePoint("banana", "ban"),
      1,
      "Test Case 5 Failed: b is prefix of a"
    );
  });

  test("should return 0 for two empty strings", () => {
    assert.strictEqual(
      compareByCodePoint("", ""),
      0,
      "Test Case 6a Failed: Two empty strings"
    );
  });

  test("should return -1 when a is empty and b is not", () => {
    assert.strictEqual(
      compareByCodePoint("", "text"),
      -1,
      "Test Case 6b Failed: a is empty, b is not"
    );
  });

  test("should return 1 when b is empty and a is not", () => {
    assert.strictEqual(
      compareByCodePoint("text", ""),
      1,
      "Test Case 6c Failed: b is empty, a is not"
    );
  });

  test("should compare numbers as characters", () => {
    assert.strictEqual(
      compareByCodePoint("100", "20"),
      -1,
      "Test Case 7a Failed: '100' vs '20'"
    ); // '1' (49) < '2' (50)
    assert.strictEqual(
      compareByCodePoint("9", "10"),
      1,
      "Test Case 7b Failed: '9' vs '10'"
    ); // '9' (57) > '1' (49)
  });

  test("should handle special characters based on code points", () => {
    assert.strictEqual(
      compareByCodePoint("!", "#"),
      -1,
      "Test Case 8a Failed: '!' vs '#'"
    ); // '!' (33) < '#' (35)
    assert.strictEqual(
      compareByCodePoint("$", "%"),
      -1,
      "Test Case 8b Failed: '$' vs '%'"
    ); // '$' (36) < '%' (37)
    assert.strictEqual(
      compareByCodePoint("@", ">"),
      1,
      "Test Case 8c Failed: '@' vs '>'"
    ); // '@' (64) > '>' (62)
  });

  test("should correctly compare strings with basic Unicode characters", () => {
    // 'résumé' vs 'resume'
    // 'r' === 'r'
    // 'é' (233) vs 'e' (101) -> 'é' > 'e'
    assert.strictEqual(
      compareByCodePoint("résumé", "resume"),
      1,
      "Test Case 9a Failed: 'résumé' vs 'resume'"
    );
    assert.strictEqual(
      compareByCodePoint("你好", "你好世界"),
      -1,
      "Test Case 9b Failed: '你好' vs '你好世界'"
    ); // "你好" is prefix
  });

  test("should correctly compare strings with supplementary Unicode characters (emojis)", () => {
    // 🍎 (U+1F34E, cp: 127822) vs 🍌 (U+1F34C, cp: 127820)
    assert.strictEqual(
      compareByCodePoint("🍎", "🍌"),
      1,
      "Test Case 9c Failed: '🍎' vs '🍌'"
    );
    assert.strictEqual(
      compareByCodePoint("🍌", "🍎"),
      -1,
      "Test Case 9d Failed: '🍌' vs '🍎'"
    );

    // ⭐ (U+2B50, cp: 11088) vs ✨ (U+2728, cp: 10024)
    assert.strictEqual(
      compareByCodePoint("⭐", "✨"),
      1,
      "Test Case 9e Failed: '⭐' vs '✨'"
    );
    assert.strictEqual(
      compareByCodePoint("✨", "⭐"),
      -1,
      "Test Case 9f Failed: '✨' vs '⭐'"
    );

    assert.strictEqual(
      compareByCodePoint("a🍎b", "a🍌c"),
      1,
      "Test Case 9g Failed: 'a🍎b' vs 'a🍌c'"
    ); // Compares 🍎 and 🍌
    assert.strictEqual(
      compareByCodePoint("🍎a", "🍎b"),
      -1,
      "Test Case 9h Failed: '🍎a' vs '🍎b'"
    ); // Compares a and b
  });

  test('should correctly compare "test" and "testing" (prefix and length)', () => {
    assert.strictEqual(
      compareByCodePoint("test", "testing"),
      -1,
      "Test Case 10a Failed: 'test' vs 'testing'"
    );
  });

  test('should correctly compare "testing" and "test" (prefix and length)', () => {
    assert.strictEqual(
      compareByCodePoint("testing", "test"),
      1,
      "Test Case 10b Failed: 'testing' vs 'test'"
    );
  });

  test('should compare "bca" and "acb" correctly', () => {
    assert.strictEqual(
      compareByCodePoint("bca", "acb"),
      1,
      "Test Case 11 Failed: 'bca' vs 'acb'"
    ); // 'b' > 'a'
  });

  test("should return 0 for identical strings with supplementary characters", () => {
    assert.strictEqual(
      compareByCodePoint("🚀🌌", "🚀🌌"),
      0,
      "Test Case 12 Failed: Identical supplementary chars"
    );
  });

  test("should correctly compare mixed BMP and supplementary characters", () => {
    assert.strictEqual(
      compareByCodePoint("text🍎", "text🍌"),
      1,
      "Test Case 13a Failed: 'text🍎' vs 'text🍌'"
    );
    assert.strictEqual(
      compareByCodePoint("🍎text", "🍌text"),
      1,
      "Test Case 13b Failed: '🍎text' vs '🍌text'"
    );
    assert.strictEqual(
      compareByCodePoint("a🍎", "a🍌"),
      1,
      "Test Case 13c Failed: 'a🍎' vs 'a🍌'"
    );
    assert.strictEqual(
      compareByCodePoint("🍎a", "🍎b"),
      -1,
      "Test Case 13d Failed: '🍎a' vs '🍎b'"
    );
  });

  test("should handle supplementary characters interrupting BMP characters", () => {
    // 'te🌟st' vs 'test'
    // 't' === 't'
    // 'e' === 'e'
    // '🌟' (cp: 127775) vs 's' (cp: 115) -> '🌟' > 's'
    assert.strictEqual(
      compareByCodePoint("te🌟st", "test"),
      1,
      "Test Case 14a Failed: 'te🌟st' vs 'test'"
    );

    // 'test' vs 'te🌟st'
    // 's' (cp: 115) vs '🌟' (cp: 127775) -> 's' < '🌟'
    assert.strictEqual(
      compareByCodePoint("test", "te🌟st"),
      -1,
      "Test Case 14b Failed: 'test' vs 'te🌟st'"
    );
  });

  test("should handle complex cases with null and special Unicode characters", () => {
    assert.strictEqual(
      compareByCodePoint("string1", "string2"),
      -1,
      "Test Case 15a Failed: 'string1' vs 'string2'"
    );
    assert.strictEqual(
      compareByCodePoint("abc\u0000def", "abc\u0001def"),
      -1,
      "Test Case 15b Failed: Null char vs SOH"
    );
    assert.strictEqual(
      compareByCodePoint("abc\uFFFFdef", "abc\uFFFEdef"),
      1,
      "Test Case 15c Failed: U+FFFF vs U+FFFE"
    );
  });

  test("should handle surrogate pairs correctly against single characters", () => {
    const highSurrogate = "\uD83C"; // Part of 🍎 (U+1F34E = D83C DF4E), cp: 55356
    const emojiApple = "\uD83C\uDF4E"; // "🍎", cp: 127822

    // '🍎' (127822) vs 'z' (122)
    assert.strictEqual(
      compareByCodePoint(emojiApple, "z"),
      1,
      "Test Case 16a Failed: emoji vs char"
    );
    // 'z' (122) vs '🍎' (127822)
    assert.strictEqual(
      compareByCodePoint("z", emojiApple),
      -1,
      "Test Case 16b Failed: char vs emoji"
    );

    // 'a' (97) vs high surrogate (55356)
    // Note: A lone surrogate isn't a complete character, but codePointAt will return its value.
    assert.strictEqual(
      compareByCodePoint("a", highSurrogate),
      -1,
      "Test Case 16c Failed: 'a' vs high surrogate"
    );
  });
});
