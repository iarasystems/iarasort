import * as vscode from "vscode";

function getFullLinesRange(
  document: vscode.TextDocument,
  selection: vscode.Selection
): vscode.Range {
  const startPosition = new vscode.Position(selection.start.line, 0);
  const endPosition = document.lineAt(selection.end.line).range.end;
  return new vscode.Range(startPosition, endPosition);
}

function convertBackslashesToForwardSlashes(text: string): string {
  return text.replace(/\\/g, "/");
}

function applyReplacementToSelection(
  document: vscode.TextDocument,
  editBuilder: vscode.TextEditorEdit,
  selection: vscode.Selection
): boolean {
  const range = getFullLinesRange(document, selection);
  const originalText = document.getText(range);
  const transformedText = convertBackslashesToForwardSlashes(originalText);

  if (originalText !== transformedText) {
    editBuilder.replace(range, transformedText);
    return true;
  }
  return false;
}

export async function ReplaceBackSlashesWithForwardSlashes(): Promise<void> {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showInformationMessage("No active text editor found.");
    return;
  }

  const selections = editor.selections;

  if (selections.length === 0 || selections.every((s) => s.isEmpty)) {
    vscode.window.showInformationMessage(
      "No text selected. Please select the path(s) to convert."
    );
    return;
  }

  const success = await editor.edit((editBuilder) => {
    selections.forEach((selection) => {
      applyReplacementToSelection(editor.document, editBuilder, selection);
    });
  });

  if (!success) {
    vscode.window.showErrorMessage("Error: Could not apply path conversion.");
  }
}
