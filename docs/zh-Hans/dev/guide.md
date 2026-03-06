# 基础工作流

## 前置准备

本项目使用 [Tauri v2](https://v2.tauri.app/)。请先安装：

- [Node.js >= 22](https://nodejs.org/)
- [Rust](https://www.rust-lang.org/learn/get-started)
- [Tauri](https://v2.tauri.app/)

对于 Linux 系统，可能还需要安装一些前置依赖，参考 [Tauri Prerequisites](https://tauri.app/start/prerequisites/)。

先 Fork [本仓库](https://github.com/UNIkeEN/SJMCL)，然后克隆之：

```bash
git clone git@github.com:<your-github-username>/SJMCL.git
```

然后安装依赖：

```bash
npm install
```

## 配置环境变量

将 `.env.template` 复制为 `.env`，并根据模板注释填写必要环境变量。

这些值会在编译时嵌入到 Rust 后端中。

## 本地运行

```bash
npm run tauri dev
```

## 检查代码风格

前端使用 `ESLint` 与 `Prettier`，后端使用 `rustfmt` 保证格式统一。

```bash
npm run lint-staged
```

如果需要手动检查或修复，请使用：

```bash
# 前端
npx eslint "src/**/*.{js,jsx,ts,tsx}" --no-fix     # check
npx eslint "src/**/*.{js,jsx,ts,tsx}" --fix        # fix

# 后端（Linux、macOS 或 Windows Git Bash）
rustfmt --check src-tauri/src/**/*.rs              # check
rustfmt src-tauri/src/**/*.rs                      # fix

# 后端（Windows PowerShell）
cd src-tauri
cargo fmt -- --check src/**/*.rs                   # check
cargo fmt -- src/**/*.rs                           # fix
```

如果你使用 VS Code 开发，建议在工作区设置中将 `rust-analyzer.check.command` 设置为 `clippy`，以获得更严格的代码检查。

## 构建

构建可执行产物：

```bash
npm run tauri build
```

如需跨平台编译、指定打包格式或了解更多细节，请参考官方 [Tauri distribution guide](https://tauri.app/distribute/)。
