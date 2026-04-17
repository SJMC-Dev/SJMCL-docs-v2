# Quick Start (Scaffold)

You can use the npm-published scaffold to create an SJMCL extension project quickly. It generates the manifest, source tree, and build scripts for you.

## Prerequisites

Before using the scaffold, make sure Node.js `18.18.0` or later is installed.

## 1. Install the Scaffold

Install it globally first:

```bash
npm install -g create-sjmcl-extension
```

## 2. Create the Project

After installation, run:

```bash
npx create-sjmcl-extension
```

The CLI will prompt for `Project directory` and uses `my-sjmcl-extension` as the default value, so you do not need to pass a directory name on the command line.

## 3. Fill in the Extension Metadata

The scaffold will prompt for these fields:

- `Project directory`: the project directory, defaulting to `my-sjmcl-extension`
- `Extension identifier`: the extension identifier, which must follow a namespaced format such as `org.example.hello`
- `Extension name`: the display name of the extension
- `Extension description`: (Optional) a short description
- `Extension author`: (Optional) the extension author
- `Extension version`: (Optional) the extension version; if provided, it must be valid semver
- `Minimal launcher version`: (Optional) the minimum launcher version required by the extension; if provided, it must be valid semver
- `Frontend entry`: the frontend entry written into `sjmcl.ext.json`, defaulting to `frontend/index.js`

If the target directory already exists and is not empty, the scaffold asks whether it should overwrite it.

## 4. Understand the Generated Project

The scaffold creates a buildable extension project. A typical layout looks like this:

```text
my-extension/
├─ README.md
├─ package.json
├─ sjmcl.ext.json
├─ tsconfig.json
├─ scripts/
│  ├─ build.mjs
│  └─ bump.mjs
└─ src/
   ├─ index.ts
   ├─ widgets/
   │  └─ home-widget.ts
   ├─ pages/
   │  ├─ settings-page.ts
   │  └─ example-page.tsx
   └─ types/
      └─ host.ts
```

The template already includes:

- one `homeWidget`
- one `settingsPage`
- one example custom page that can be shown in the main window or in a standalone window; this page uses standard JSX component trees, and the scaffold transforms them at build time into the same extension syntax used by `homeWidget` (`React.createElement`)
- a minimal local typing set and extension registration entry

`src/index.ts` is the source entry for your project. The actual frontend file bundled into the extension package is generated into `frontend/index.js`, or whatever output path you entered for `frontend.entry`.

## 5. Install Dependencies and Build

After the project is created, enter the directory and run:

```bash
cd <your-project-directory>
npm install
npm run build
```

`npm run build` does the following:

- bundles `src/index.ts` into a single frontend entry with `esbuild`
- writes that bundle according to `frontend.entry` in `sjmcl.ext.json`
- copies `sjmcl.ext.json`
- also copies `icon.png`, `assets/`, and `data/` when they exist
- creates `dist/<identifier>/`
- packs `dist/<identifier>-<version>.sjmclx`

If you need to update the version, use:

```bash
npm run bump -- 0.1.1
```

This updates the version field in both `package.json` and `sjmcl.ext.json`.

## 6. Continue from the Template

The generated `src/index.ts` already registers the extension and wires up several example contributions. In most cases, you only need to start editing these files:

- `src/widgets/home-widget.ts`: the home widget
- `src/pages/settings-page.ts`: the extension settings page
- `src/pages/example-page.tsx`: the custom page, which can be shown embedded or in a standalone window

If you want the smallest possible starting point, you can remove the contributions you do not need and keep only `homeWidget` or `settingsPage`.

## 7. Install It into SJMCL

After building, import `dist/<identifier>-<version>.sjmclx` into the launcher:

1. Open the launcher.
2. Go to Settings.
3. Open the Extensions page.
4. Click Add and select the generated `.sjmclx` file.
