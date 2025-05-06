import * as vscode from "vscode";

/**
 * Compares two strings based on their Unicode code point values.
 * This provides an ASCII-like ordering where comparison is purely numerical
 * based on the character codes.
 * @param a The first string.
 * @param b The second string.
 * @returns -1 if a < b, 1 if a > b, 0 if a === b according to code point order.
 */
function compareByCodePoint(a: string, b: string): number {
  const len = Math.min(a.length, b.length);

  for (let i = 0; i < len; i++) {
    // Use codePointAt for robustness with characters outside BMP
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

function sortSelectedLines(editor: vscode.TextEditor) {
  const startLine = editor.selection.start.line;
  const endLine = editor.selection.end.line;

  const linesToSort: string[] = [];
  for (let i = startLine; i <= endLine; i++) {
    linesToSort.push(editor.document.lineAt(i).text);
  }

  if (linesToSort.length <= 1) {
    vscode.window.showInformationMessage(
      "Selection touches only one line. No sorting performed."
    );
    return;
  }

  const startPosition = new vscode.Position(startLine, 0);
  const endPosition = editor.document.lineAt(endLine).range.end;
  const rangeToSort = new vscode.Range(startPosition, endPosition);
  const sortedText = linesToSort.sort(compareByCodePoint).join("\n");

  editor.edit((editBuilder) => {
    editBuilder.replace(rangeToSort, sortedText);
  });
}

function iaraSort(): (...args: any[]) => any {
  return () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      sortSelectedLines(editor);
    } else {
      vscode.window.showInformationMessage("No active text editor.");
    }
  };
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("iarasort.sort", iaraSort());
  context.subscriptions.push(disposable);
}

export function deactivate() {}
