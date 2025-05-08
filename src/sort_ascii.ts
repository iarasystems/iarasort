import * as vscode from "vscode";
import { compareByCodePoint } from "./compare_codepoint";

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

export function sortAscii(...args: any[]): any {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    sortSelectedLines(editor);
  } else {
    vscode.window.showInformationMessage("No active text editor.");
  }
}
