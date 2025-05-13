# Change Log

All notable changes to this project will be documented in this file.

## [0.3.0] - 2025-05-13

- Added command `Sort Selected Lines (ASCII) (case insensitive)` which sorts the
  lines disregarding the character case.

## [0.2.0] - 2025-05-11

### Added

- Added command `Replace Backslashes with Forward Slashes` which converts
  backslashes (`\`) to forward slashes (`/`) within the currently selected text.
  Supports multiple selections.

## [0.1.0] - 2025-05-08

### Added

- Initial release of the extension.
- Added command `Sort vcpkg.json` which sorts the `dependencies` and `overrides`
  arrays alphabetically by package name within the active `vcpkg.json` file.
- Automatically formats the file using Prettier after sorting, if Prettier
  extension is available and active.

## [0.0.1] - 2025-05-06

### Added

- Initial pre-release version.
- Added command `Sort Selected Lines (ASCII)` which sorts the selected lines in
  the active text editor alphabetically based on their code points.
