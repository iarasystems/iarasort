import * as vscode from "vscode";
import * as assert from "assert";

// This suite runs in the VS Code Extension Development Host.
suite("ReplaceBackSlashesWithForwardSlashes Integration Tests", () => {
  // Before each test, clean state (e.g., close editors).
  teardown(async () => {
    await vscode.commands.executeCommand("workbench.action.closeAllEditors");
  });

  test("Should replace backslashes in selected line", async () => {
    // 1. Open a new text document
    const doc = await vscode.workspace.openTextDocument({
      content: "This is a path: C:\\Users\\Document\\file.txt\nAnother line.",
      language: "plaintext",
    });
    const editor = await vscode.window.showTextDocument(doc);

    // 2. Create a selection over the path
    const startPos = new vscode.Position(0, 19); // Start of C:
    const endPos = new vscode.Position(0, 42); // End of .txt
    editor.selection = new vscode.Selection(startPos, endPos);

    await vscode.commands.executeCommand("iarasort.replace_backslashes");

    const expectedContent =
      "This is a path: C:/Users/Document/file.txt\nAnother line.";
    assert.strictEqual(
      editor.document.getText(),
      expectedContent,
      "Backslashes were not replaced correctly."
    );
  });

  test("Should change even if line isn't fully selected", async () => {
    const doc = await vscode.workspace.openTextDocument({
      content:
        "C:\\Outside\\Path\\Before C:\\Inside\\Path\\Here C:\\Outside\\Path\\After",
      language: "plaintext",
    });
    const editor = await vscode.window.showTextDocument(doc);

    // Select only the "Inside" path
    const startPos = new vscode.Position(0, 31); // Start of C:\Inside...
    const endPos = new vscode.Position(0, 49); // End of ...Here
    editor.selection = new vscode.Selection(startPos, endPos);

    await vscode.commands.executeCommand("iarasort.replace_backslashes");

    const expectedContent =
      "C:/Outside/Path/Before C:/Inside/Path/Here C:/Outside/Path/After";
    assert.strictEqual(
      editor.document.getText(),
      expectedContent,
      "Text outside selection was modified."
    );
  });
});
