import * as vscode from "vscode";
import { compareByCodePoint } from "./compare_codepoint";

function sortEditor(
  editor: vscode.TextEditor,
  startLine: number,
  endLine: number,
  linesToSort: string[],
  caseInsensitive: boolean
) {
  const startPosition = new vscode.Position(startLine, 0);
  const endPosition = editor.document.lineAt(endLine).range.end;
  const rangeToSort = new vscode.Range(startPosition, endPosition);
  const sortedText = linesToSort
    .sort((a, b) => {
      return compareByCodePoint(a, b, caseInsensitive);
    })
    .join("\n");

  editor.edit((editBuilder) => {
    editBuilder.replace(rangeToSort, sortedText);
  });
}

function sortSelectedLines(
  editor: vscode.TextEditor,
  caseInsensitive: boolean
) {
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

  sortEditor(editor, startLine, endLine, linesToSort, caseInsensitive);
}

export function sortAscii(caseInsensitive: boolean): any {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    sortSelectedLines(editor, caseInsensitive);
  } else {
    vscode.window.showInformationMessage("No active text editor.");
  }
}
