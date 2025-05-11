import * as vscode from "vscode";

import { sortActiveVcpkgFile } from "./sort_vcpkg_json";
import { sortAscii } from "./sort_ascii";
import { ReplaceBackSlashesWithForwardSlashes } from "./replace_backslashes";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("iarasort.sort", sortAscii)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("iarasort.vcpkg_sort", sortActiveVcpkgFile)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "iarasort.replace_backslashes",
      ReplaceBackSlashesWithForwardSlashes
    )
  );
}

export function deactivate() {}
