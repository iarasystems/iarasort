import * as vscode from "vscode";
import { compareByCodePoint } from "./compare_codepoint";

function getLinesInRange(
  document: vscode.TextDocument,
  startLine: number,
  endLine: number
): string[] {
  const lines: string[] = [];
  for (let i = startLine; i <= endLine; i++) {
    lines.push(document.lineAt(i).text);
  }
  return lines;
}

function getFullLineRange(
  document: vscode.TextDocument,
  startLine: number,
  endLine: number
): vscode.Range {
  const startPosition = new vscode.Position(startLine, 0);
  const endPosition = document.lineAt(endLine).range.end;
  return new vscode.Range(startPosition, endPosition);
}

function sortLines(lines: string[], caseInsensitive: boolean): string {
  return [...lines]
    .sort((a, b) => compareByCodePoint(a, b, caseInsensitive))
    .join("\n");
}

function processSelections(
  editor: vscode.TextEditor,
  editBuilder: vscode.TextEditorEdit,
  caseInsensitive: boolean
): boolean {
  let performedSort = false;

  for (const selection of editor.selections) {
    const startLine = selection.start.line;
    const endLine = selection.end.line;

    const lines = getLinesInRange(editor.document, startLine, endLine);

    if (lines.length <= 1) {
      continue;
    }

    const range = getFullLineRange(editor.document, startLine, endLine);
    const sortedText = sortLines(lines, caseInsensitive);

    editBuilder.replace(range, sortedText);
    performedSort = true;
  }

  return performedSort;
}

async function performSortOnSelections(
  editor: vscode.TextEditor,
  caseInsensitive: boolean
) {
  if (editor.selections.length === 0) {
    return;
  }

  return editor.edit((editBuilder) => {
    const performedSort = processSelections(
      editor,
      editBuilder,
      caseInsensitive
    );

    if (!performedSort && editor.selections.length === 1) {
      vscode.window.showInformationMessage(
        "Selection touches only one line. No sorting performed."
      );
    }
  });
}

export async function sortAscii(caseInsensitive: boolean): Promise<any> {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    return performSortOnSelections(editor, caseInsensitive);
  } else {
    vscode.window.showInformationMessage("No active text editor.");
  }
}
