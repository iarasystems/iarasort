import * as vscode from "vscode";

import { sortActiveVcpkgFile } from "./sort_vcpkg_json";
import { sortAscii } from "./sort_ascii";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("iarasort.sort", sortAscii)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("iarasort.vcpkg_sort", sortActiveVcpkgFile)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "iarasort.replace_path",
      ReplaceBackSlashesWithForwardSlashes
    )
  );
}

export function deactivate() {}

function ReplaceBackSlashesWithForwardSlashes() {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showInformationMessage("No active text editor found.");
    return;
  }

  const document = editor.document;
  // Get all selections (supports multi-cursor).
  const selections = editor.selections;

  // Check if there's any actual selection
  if (selections.length === 0 || selections.every((s) => s.isEmpty)) {
    vscode.window.showInformationMessage(
      "No text selected. Please select the path(s) to convert."
    );
    return;
  }

  // Perform the edit operation.
  editor
    .edit((editBuilder) => {
      selections.forEach((selection) => {
        replaceSelectionForwardSlashByBackSlash(selection, editBuilder);
      });
    })
    .then((success) => {
      if (!success) {
        vscode.window.showErrorMessage(
          "Error: Could not apply path conversion."
        );
      }
    });

  function replaceSelectionForwardSlashByBackSlash(
    selection: vscode.Selection,
    editBuilder: vscode.TextEditorEdit
  ): void {
    for (let i = selection.start.line; i <= selection.end.line; i++) {
      const line = document.lineAt(i); // Get the TextLine object
      const originalLineText = line.text; // Get the full text of the line
      const newLineText = originalLineText.replace(/\\/g, "/");
      if (originalLineText !== newLineText) {
        editBuilder.replace(line.range, newLineText);
      }
    }
  }
}
