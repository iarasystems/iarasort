import * as vscode from "vscode";

import { sortActiveVcpkgFile } from "./sort_vcpkg_json";
import { sortAscii } from "./sort_ascii";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("iarasort.sort", sortAscii);
  context.subscriptions.push(disposable);

  let vcpkgSortDisposable = vscode.commands.registerCommand(
    "iarasort.vcpkg_sort",
    sortActiveVcpkgFile
  );
  context.subscriptions.push(vcpkgSortDisposable);
}

export function deactivate() {}
