import * as vscode from "vscode";
import * as assert from "assert";

suite("Sort Ascii Integration Tests", () => {
  teardown(async () => {
    await vscode.commands.executeCommand("workbench.action.closeAllEditors");
  });

  test("Should sort multiple independent selections", async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: "banana\napple\n---\nzebra\nyak",
      language: "plaintext",
    });
    const editor = await vscode.window.showTextDocument(doc);

    // Selection 1: banana, apple
    const sel1 = new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(1, 5));
    // Selection 2: zebra, yak
    const sel2 = new vscode.Selection(new vscode.Position(3, 0), new vscode.Position(4, 3));
    
    editor.selections = [sel1, sel2];

    await vscode.commands.executeCommand("iarasort.sort");

    const expectedContent = "apple\nbanana\n---\nyak\nzebra";
    assert.strictEqual(editor.document.getText(), expectedContent);
  });

  test("Should expand partial selection to full lines", async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: "banana\napple",
      language: "plaintext",
    });
    const editor = await vscode.window.showTextDocument(doc);

    // Partial selection in the middle of lines
    const sel = new vscode.Selection(new vscode.Position(0, 2), new vscode.Position(1, 2));
    editor.selection = sel;

    await vscode.commands.executeCommand("iarasort.sort");

    const expectedContent = "apple\nbanana";
    assert.strictEqual(editor.document.getText(), expectedContent);
  });

  test("Should perform stable case-insensitive sort with multiple selections", async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: "apple\nApple\n---\nBanana\nbanana",
      language: "plaintext",
    });
    const editor = await vscode.window.showTextDocument(doc);

    // Selection 1: apple, Apple
    const sel1 = new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(1, 5));
    // Selection 2: Banana, banana
    const sel2 = new vscode.Selection(new vscode.Position(3, 0), new vscode.Position(4, 6));
    
    editor.selections = [sel1, sel2];

    await vscode.commands.executeCommand("iarasort.sort_case_insensitive");

    // Stable sort should preserve original order if they are equal case-insensitively
    const expectedContent = "apple\nApple\n---\nBanana\nbanana";
    assert.strictEqual(editor.document.getText(), expectedContent);
  });
});
