# Basic Workflow

## Preliminaries

This project uses [Tauri v2](https://v2.tauri.app/). Please install:

- [Node.js >= 22](https://nodejs.org/)
- [Rust](https://www.rust-lang.org/learn/get-started)
- [Tauri](https://v2.tauri.app/)

For Linux, you may need extra system prerequisites. See [Tauri Prerequisites](https://tauri.app/start/prerequisites/).

Fork [this repository](https://github.com/UNIkeEN/SJMCL) first, then clone your own fork:

```bash
git clone git@github.com:<your-github-username>/SJMCL.git
```

Then install dependencies with `npm`:

```bash
npm install
```

## Configure environment variables

Copy `.env.template` to `.env`, then fill in the required values based on the comments in the template.

These values are embedded into the Rust backend as compile-time constants.

## Run locally

```bash
npm run tauri dev
```

## Check the code style

We use `ESLint` and `Prettier` for frontend code, and `rustfmt` for backend code to ensure consistent formatting.

```bash
npm run lint-staged
```

Alternatively, to manually check and fix formatting issues:

```bash
# For frontend part
npx eslint "src/**/*.{js,jsx,ts,tsx}" --no-fix     # check
npx eslint "src/**/*.{js,jsx,ts,tsx}" --fix        # fix

# For backend part (For Linux, macOS or Git Bash on Windows)
rustfmt --check src-tauri/src/**/*.rs              # check
rustfmt src-tauri/src/**/*.rs                      # fix

# For backend part (For Windows PowerShell)
cd src-tauri
cargo fmt -- --check src/**/*.rs                   # check
cargo fmt -- src/**/*.rs                           # fix
```

If you use VS Code for developing this project, we recommend setting `rust-analyzer.check.command` to `clippy` in your workspace settings for stricter code checking.

## Build

Build the project into an executable:

```bash
npm run tauri build
```

For cross-platform compilation, packaging in a specific format, or more details, please refer to the official [Tauri distribution guide](https://tauri.app/distribute/).
