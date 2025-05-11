# Iara Sort

A Visual Studio Code extension providing various sorting and text transformation
utilities to streamline your workflow.

## Features

Iara Sort offers a set of commands to help you organize and transform text
within your editor:

- **Sort Selected Lines (ASCII):** Sorts the lines within your current selection
  alphabetically based on their code points. Useful for sorting lists, logs, or
  any block of text line by line.
- **Sort vcpkg.json:** Specifically designed for `vcpkg.json` manifest files.
  This command sorts the `dependencies` and `overrides` arrays alphabetically by
  the package name. It also sorts the features within each dependency object.
  **Requires the Prettier extension** for automatic formatting after sorting.
- **Replace Backslashes with Forward Slashes:** Converts all backslashes (`\`)
  to forward slashes (`/`) within your selected line text. Useful for
  standardizing paths or dealing with different operating system path
  conventions. Supports multiple selections.

## Installation

1.  Open Visual Studio Code.
2.  Go to the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`).
3.  Search for "Iara Sort".
4.  Click **Install**.

## Usage

Once installed, you can access the commands through the VS Code Command Palette
(`Ctrl+Shift+P` or `Cmd+Shift+P`) or via context menus (right-click in the
editor).

- **Sort Selected Lines (ASCII):** Select the lines you wish to sort in a text
  editor, open the Command Palette, and search for "Iara Sort: Sort Selected
  Lines (ASCII)". You can also right-click on the selection and find the command
  in the context menu.
- **Sort vcpkg.json:** Open a `vcpkg.json` file, open the Command Palette, and
  search for "Iara Sort: Sort vcpkg.json". This command is also available in the
  editor context menu when editing a `.json` file (specifically intended for
  `vcpkg.json`). Ensure you have the [Prettier
  extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  installed and active for the best results.
- **Replace Backslashes with Forward Slashes:** Select the text containing
  backslashes you want to convert, open the Command Palette, and search for
  "Iara Sort: Replace Backslashes with Forward Slashes". This command is also
  available in the editor context menu when text is selected.

## Changelog

See the [CHANGELOG.md](CHANGELOG.md) file for details on the changes in each
version.

## License

This project is licensed under the [MIT License](LICENSE.txt).
