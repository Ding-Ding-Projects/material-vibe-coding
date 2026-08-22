# Material Vibe Coding

A Material Design 3 vibe coding studio for Windows, built on Electron Forge with genuine Squirrel.Windows packaging and permanent no-signing policy.

## Features

- Frameless Material Design 3 dark/light theme window with custom title bar
- Browser-style vertical tab navigation (left-docked by default)
- Code editor with live line/char counts
- Command palette (`Ctrl+Shift+F`)
- Non-blocking notification system
- Dim sum surprise (10% at startup)
- Converter catalog surface
- Local Ollama model manager surface
- Settings, history, and changelog surfaces

## Quick start

```bat
build.bat
```

This installs dependencies and builds the runnable Electron app into `out/`.

To build the Windows Squirrel.Windows installer:

```bat
build-installer.bat
```

Both scripts are idempotent, silent-capable (`/s`), and never require code signing. The resulting installer is unsigned and may trigger an unknown-publisher or SmartScreen warning — this is expected under the permanent no-signing policy.

## Repository structure

```
src/
  main.js           Electron main process
  preload.js        Secure context bridge
  renderer/         UI layer (HTML, CSS, JS)
forge.config.js     Electron Forge packaging configuration
.github/workflows/ GitHub Actions release workflow
build.bat           One-click dependency install + build
build-installer.bat One-click Squirrel.Windows installer build
site/              Landing page and documentation site source
```
