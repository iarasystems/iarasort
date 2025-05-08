import * as vscode from "vscode";
import { compareByCodePoint } from "./compare_codepoint";

/**
 * Represents a dependency when it's an object.
 * It must have a 'name' property.
 */
interface VcpkgDependencyObject {
  name: string;
  features?: string[];
  "default-features"?: boolean;
  // For 'overrides', it can also include 'version'.
  version?: string;
  // Allow other properties as vcpkg format might evolve.
  [key: string]: any;
}

/**
 * Represents a dependency, which can be a simple string (package name)
 * or an object with more details.
 */
type VcpkgDependency = string | VcpkgDependencyObject;

/**
 * Represents the structure of a vcpkg.json manifest file.
 */
interface VcpkgManifest {
  $schema?: string;
  name?: string;
  version?: string;
  "builtin-baseline"?: string;
  supports?: string;
  dependencies?: VcpkgDependency[];
  overrides?: VcpkgDependencyObject[]; // Overrides are typically objects with name and version.
  // Allow other top-level properties.
  [key: string]: any;
}

/**
 * Sorts the 'dependencies' and 'overrides' arrays in a vcpkg.json manifest string.
 * Sorting is done alphabetically based on the package name.
 *
 * @param jsonString The string content of the vcpkg.json file.
 * @returns A new string with the sorted vcpkg.json content.
 * @throws Error if the jsonString is not valid JSON.
 */
export function sortVcpkgManifestContent(jsonString: string): string {
  const manifest: VcpkgManifest = JSON.parse(jsonString);
  const getDependencySortKey = (dep: VcpkgDependency): string => {
    if (typeof dep === "string") {
      return dep; // If it's a string, use the string itself as the key.
    }
    return dep.name;
  };

  const getOverrideSortKey = (override: VcpkgDependencyObject): string => {
    return override.name;
  };

  if (manifest.dependencies && Array.isArray(manifest.dependencies)) {
    manifest.dependencies.forEach((dep) => {
      sortFeatures(dep);
    });

    manifest.dependencies.sort((a, b) =>
      compareByCodePoint(getDependencySortKey(a), getDependencySortKey(b))
    );
  }

  if (manifest.overrides && Array.isArray(manifest.overrides)) {
    manifest.overrides.sort((a, b) =>
      compareByCodePoint(getOverrideSortKey(a), getOverrideSortKey(b))
    );
  }

  return JSON.stringify(manifest);
}

function sortFeatures(dep: VcpkgDependency) {
  if (typeof dep === "object" && dep.features && Array.isArray(dep.features)) {
    dep.features.sort(compareByCodePoint);
  }
}

async function formatFileWithPrettier() {
  const prettierExtension = vscode.extensions.getExtension(
    "esbenp.prettier-vscode"
  );

  const isPrettierAvailable = prettierExtension && prettierExtension.isActive;
  if (!isPrettierAvailable || !prettierExtension.isActive) {
    // Prettier is not active or not installed.
    vscode.window.showErrorMessage(
      "Prettier isn't available. Try to install or activate it."
    );
    return;
  }

  // Prettier is active.
  await vscode.commands.executeCommand("prettier.forceFormatDocument");
}

function showFeedbackMessage(success: boolean): void {
  if (success) {
    vscode.window.showInformationMessage(
      "vcpkg.json content sorted successfully."
    );
  } else {
    vscode.window.showErrorMessage(
      "Failed to apply sorted content to vcpkg.json."
    );
  }
}

function replaceEditorText(
  editor: vscode.TextEditor,
  newText: string
): (editBuilder: vscode.TextEditorEdit) => void {
  const document = editor.document;
  return (editBuilder) => {
    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(document.getText().length)
    );
    editBuilder.replace(fullRange, newText);
  };
}

export function sortActiveVcpkgFile(): void {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage("No active text editor found.");
    return;
  }

  const document = editor.document;
  const isVcpkgJson =
    document.fileName.endsWith("vcpkg.json") && document.languageId === "json";
  // It's good practice to check if the command is run on the intended file
  // type, though not strictly necessary if the command is only available via
  // context menus.
  if (!isVcpkgJson) {
    vscode.window.showInformationMessage(
      'This command is intended for use with "vcpkg.json" files.'
    );
    return;
  }
  // Or check languageId
  const originalText = document.getText();
  try {
    const sortedText = sortVcpkgManifestContent(originalText);

    // Replace the entire document content with the sorted version
    editor
      .edit(replaceEditorText(editor, sortedText))
      .then(showFeedbackMessage)
      .then(formatFileWithPrettier);
  } catch (error: any) {
    console.error("Error sorting vcpkg.json:", error);
    vscode.window.showErrorMessage(
      "Failed to sort vcpkg.json: " + (error.message || "Invalid JSON content.")
    );
  }
}
