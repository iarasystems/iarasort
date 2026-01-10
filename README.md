# Iara Sort

A Visual Studio Code extension providing various sorting and text transformation utilities to streamline your workflow.

## Features

Iara Sort offers a set of commands to help you organize and transform text within your editor:

- **Sort Selected Lines (ASCII):**
  - **Standard:** Sorts lines alphabetically based on Unicode code points.
  - **Case Insensitive:** Sorts lines disregarding character case. This sort is **stable**, meaning it preserves the original relative order of lines that differ only in case (e.g., "apple" and "Apple").
  - **Multiple Selections:** All sorting commands support multiple independent selections. Each block is sorted individually.
  - **Automatic Line Expansion:** If a selection touches only part of a line, the command automatically includes the entire line in the sort.
- **Sort vcpkg.json:** Specifically designed for `vcpkg.json` manifest files. This command sorts the `dependencies` and `overrides` arrays alphabetically by the package name. It also sorts the features within each dependency object. **Requires the Prettier extension** for automatic formatting after sorting.
- **Replace Backslashes with Forward Slashes:** Converts all backslashes (`\`) to forward slashes (`/`) within your selected text. Useful for standardizing paths or dealing with different operating system path conventions. Supports multiple selections.

## Installation

1.  Open Visual Studio Code.
2.  Go to the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`).
3.  Search for "Iara Sort".
4.  Click **Install**.

## Usage

Once installed, you can access the commands through the VS Code Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) or via context menus (right-click in the editor).

- **Sort Selected Lines (ASCII):** Select the lines you wish to sort, open the Command Palette, and search for "Iara: Sort lines (ASCII order)" or "Iara: Sort lines (ASCII order, case insensitive)".
- **Sort vcpkg.json:** Open a `vcpkg.json` file, open the Command Palette, and search for "Iara: Sort vcpkg.json". Ensure you have the [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) active for best results.
- **Replace Backslashes with Forward Slashes:** Select the text containing backslashes, open the Command Palette, and search for "Iara: Replace backslashes with forward slashes".

## Changelog

See the [CHANGELOG.md](CHANGELOG.md) file for details on the changes in each version.

## License

This project is licensed under the [MIT License](LICENSE.txt).
