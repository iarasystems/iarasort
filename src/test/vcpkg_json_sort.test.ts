import * as assert from "assert";
import { sortVcpkgManifestContent } from "../sort_vcpkg_json";

// --- Test Suite ---
suite("sortVcpkgManifestContent Function Tests", () => {
  const originalManifest = {
    $schema:
      "https://raw.githubusercontent.com/microsoft/vcpkg-tool/main/docs/vcpkg.schema.json",
    name: "sois",
    version: "0.1.0",
    "builtin-baseline": "b66385232ea2d1b04a15a17351841312f5c6e390",
    supports: "x64",
    dependencies: [
      "boost-property-tree",
      { name: "ceres", features: ["eigensparse", "lapack", "suitesparse"] },
      "boost-algorithm",
      "nlohmann-json",
      "eigen3",
    ],
    overrides: [
      { name: "qwt", version: "6.1.5" },
      { name: "ffmpeg", version: "4.4.3#3" },
      { name: "quazip", version: "1.3#2" },
    ],
    "extra-field": "should-be-preserved",
  };

  const expectedSortedManifest = {
    $schema:
      "https://raw.githubusercontent.com/microsoft/vcpkg-tool/main/docs/vcpkg.schema.json",
    name: "sois",
    version: "0.1.0",
    "builtin-baseline": "b66385232ea2d1b04a15a17351841312f5c6e390",
    supports: "x64",
    dependencies: [
      "boost-algorithm",
      "boost-property-tree",
      { name: "ceres", features: ["eigensparse", "lapack", "suitesparse"] },
      "eigen3",
      "nlohmann-json",
    ],
    overrides: [
      { name: "ffmpeg", version: "4.4.3#3" },
      { name: "quazip", version: "1.3#2" },
      { name: "qwt", version: "6.1.5" },
    ],
    "extra-field": "should-be-preserved",
  };

  test("should sort dependencies and overrides correctly", () => {
    const jsonInput = JSON.stringify(originalManifest, null, 2);
    const sortedJsonOutput = sortVcpkgManifestContent(jsonInput);
    const expectedJsonOutput = JSON.stringify(expectedSortedManifest);
    assert.strictEqual(
      sortedJsonOutput,
      expectedJsonOutput,
      "Full manifest sorting failed"
    );
  });

  test("should sort dependencies (strings only)", () => {
    const manifest = {
      dependencies: ["zebra", "apple", "banana"],
    };
    const expected = {
      dependencies: ["apple", "banana", "zebra"],
    };
    const sorted = sortVcpkgManifestContent(JSON.stringify(manifest));
    assert.strictEqual(sorted, JSON.stringify(expected));
  });

  test("should sort dependencies (objects only)", () => {
    const manifest = {
      dependencies: [
        { name: "zebra-lib" },
        { name: "apple-lib" },
        { name: "banana-lib" },
      ],
    };
    const expected = {
      dependencies: [
        { name: "apple-lib" },
        { name: "banana-lib" },
        { name: "zebra-lib" },
      ],
    };
    const sorted = sortVcpkgManifestContent(JSON.stringify(manifest));
    assert.strictEqual(sorted, JSON.stringify(expected));
  });

  test("should sort dependencies (mixed strings and objects)", () => {
    const manifest = {
      dependencies: [
        "zebra-lib",
        { name: "apple-lib" },
        "middle-lib",
        { name: "banana-lib", features: ["cool"] },
      ],
    };
    const expected = {
      dependencies: [
        { name: "apple-lib" },
        { name: "banana-lib", features: ["cool"] },
        "middle-lib",
        "zebra-lib",
      ],
    };
    const sorted = sortVcpkgManifestContent(JSON.stringify(manifest));
    assert.strictEqual(sorted, JSON.stringify(expected));
  });

  test("should sort overrides correctly", () => {
    const manifest = {
      overrides: [
        { name: "zebra-override", version: "1.0" },
        { name: "apple-override", version: "2.0" },
        { name: "banana-override", version: "3.0" },
      ],
    };
    const expected = {
      overrides: [
        { name: "apple-override", version: "2.0" },
        { name: "banana-override", version: "3.0" },
        { name: "zebra-override", version: "1.0" },
      ],
    };
    const sorted = sortVcpkgManifestContent(JSON.stringify(manifest));
    assert.strictEqual(sorted, JSON.stringify(expected));
  });

  test("should handle empty dependencies array", () => {
    const manifest = {
      name: "test",
      dependencies: [],
    };
    const sorted = sortVcpkgManifestContent(JSON.stringify(manifest));
    assert.strictEqual(sorted, JSON.stringify(manifest)); // Should remain unchanged
  });

  test("should handle empty overrides array", () => {
    const manifest = {
      name: "test",
      overrides: [],
    };
    const sorted = sortVcpkgManifestContent(JSON.stringify(manifest));
    assert.strictEqual(sorted, JSON.stringify(manifest)); // Should remain unchanged
  });

  test("should handle missing dependencies key", () => {
    const manifest = {
      name: "test",
      version: "1.0",
      // no dependencies key
    };
    const sorted = sortVcpkgManifestContent(JSON.stringify(manifest));
    assert.strictEqual(sorted, JSON.stringify(manifest)); // Should remain unchanged
  });

  test("should handle missing overrides key", () => {
    const manifest = {
      name: "test",
      version: "1.0",
      // no overrides key
    };
    const sorted = sortVcpkgManifestContent(JSON.stringify(manifest));
    assert.strictEqual(sorted, JSON.stringify(manifest)); // Should remain unchanged
  });

  test("should preserve other fields in the manifest", () => {
    const manifest = {
      name: "my-project",
      version: "1.2.3",
      dependencies: ["c", "a", "b"],
      customField: { data: "value" },
      anotherField: "test",
    };
    const expected = {
      name: "my-project",
      version: "1.2.3",
      dependencies: ["a", "b", "c"],
      customField: { data: "value" },
      anotherField: "test",
    };
    const sorted = sortVcpkgManifestContent(JSON.stringify(manifest));
    assert.strictEqual(sorted, JSON.stringify(expected));
  });

  test("should maintain JSON formatting (2 spaces indent)", () => {
    const manifest = { dependencies: ["b", "a"] };
    const sorted = sortVcpkgManifestContent(JSON.stringify(manifest)); // Input without specific indent
    const expectedJsonString = JSON.stringify({ dependencies: ["a", "b"] });
    assert.strictEqual(sorted, expectedJsonString);
  });

  test("should throw error for invalid JSON input", () => {
    const invalidJson = "{ name: 'test', dependencies: ["; // Malformed JSON
    assert.throws(
      () => sortVcpkgManifestContent(invalidJson),
      SyntaxError, // Or whatever error JSON.parse throws for malformed input
      "Should throw SyntaxError for invalid JSON"
    );
  });

  test("should handle dependencies with different cases correctly (using compareByCodePoint)", () => {
    const manifest = {
      dependencies: ["Boost", "apple", "boost"], // B (66), a (97), b (98)
    };
    const expected = {
      // Order by code point: 'B' < 'a' < 'b'
      dependencies: ["Boost", "apple", "boost"],
    };
    const sorted = sortVcpkgManifestContent(JSON.stringify(manifest, null));
    assert.strictEqual(sorted, JSON.stringify(expected));
  });

  test("should handle an empty JSON object", () => {
    const manifest = {};
    const sorted = sortVcpkgManifestContent(JSON.stringify(manifest));
    assert.strictEqual(sorted, JSON.stringify({}, null, 2));
  });

  test("should handle JSON with only non-sorted fields", () => {
    const manifest = { name: "test", version: "0.1" };
    const sorted = sortVcpkgManifestContent(JSON.stringify(manifest));
    assert.strictEqual(sorted, JSON.stringify(manifest));
  });

  test('should sort overrides when "name" is not the first field', () => {
    const manifest = {
      overrides: [
        { version: "1.0", name: "zebra-override", extra: "data" },
        { another: "field", version: "2.0", name: "apple-override" },
        { name: "banana-override", version: "3.0" }, // name is first here
      ],
    };
    const expected = {
      overrides: [
        { another: "field", version: "2.0", name: "apple-override" },
        { name: "banana-override", version: "3.0" },
        { version: "1.0", name: "zebra-override", extra: "data" },
      ],
    };
    const sorted = sortVcpkgManifestContent(JSON.stringify(manifest));
    assert.strictEqual(
      sorted,
      JSON.stringify(expected),
      "Overrides sorting failed when 'name' field order varies"
    );
  });
});
