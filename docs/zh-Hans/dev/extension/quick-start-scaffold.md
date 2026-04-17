# 快速开始（使用脚手架）

你可以使用发布在 npm 的脚手架方便地创建 SJMCL 的扩展，它会帮你生成清单文件、源码目录和构建脚本。

## 准备环境

使用脚手架前，请先确保本机安装了 Node.js `18.18.0` 或更高版本。

## 第一步：安装脚手架

先全局安装：

```bash
npm install -g create-sjmcl-extension
```

## 第二步：创建项目

安装完成后，运行：

```bash
npx create-sjmcl-extension
```

## 第三步：按提示填写扩展信息

脚手架会依次询问这些字段：

- `Project directory`：项目目录，默认是 `my-sjmcl-extension`
- `Extension identifier`：扩展标识，必须符合 `org.example.hello` 这样的命名空间格式
- `Extension name`：扩展显示名称
- `Extension description`：（可选）扩展描述
- `Extension author`：（可选）扩展作者
- `Extension version`：（可选）扩展版本；如填写，必须是合法语义化版本
- `Minimal launcher version`：（可选）扩展要求的最低启动器版本；如填写，必须是合法语义化版本
- `Frontend entry`：最终写入 `sjmcl.ext.json` 的前端入口，默认是 `frontend/index.js`

如果项目目录已经存在且不是空目录，脚手架会先询问你是否覆盖。

## 第四步：理解生成出来的工程

脚手架会创建一个可直接构建的扩展项目，典型结构如下：

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

模板默认已经包含：

- 一个首页卡片 `homeWidget`
- 一个设置页 `settingsPage`
- 一个自定义页面，同时可在主窗口内跳转显示或在独立新窗口显示；这个页面使用标准 JSX 语法撰写组件树，脚手架在编译时会转换为和 `homeWidget` 相同的扩展语法（即 `React.createElement`）
- 一套最小可用的本地类型定义与扩展注册入口

其中 `src/index.ts` 是你的源码入口，真正打包进扩展包的前端文件会由构建脚本生成到 `frontend/index.js` 或你填写的其他入口路径。

## 第五步：安装依赖并构建

创建完成后，进入项目目录并执行：

```bash
cd <你的项目目录>
npm install
npm run build
```

`npm run build` 会完成这些事情：

- 使用 `esbuild` 将 `src/index.ts` 打包成单个前端入口文件
- 按 `sjmcl.ext.json` 中的 `frontend.entry` 输出到扩展目录
- 复制 `sjmcl.ext.json`
- 如果存在，也会复制 `icon.png`、`assets/` 和 `data/`
- 生成 `dist/<identifier>/`
- 额外打包出 `dist/<identifier>-<version>.sjmclx`

如果你修改了版本号，建议使用：

```bash
npm run bump -- 0.1.1
```

这个命令会同时更新 `package.json` 和 `sjmcl.ext.json` 里的版本字段。

## 第六步：在模板基础上继续开发

脚手架生成的 `src/index.ts` 已经注册好了扩展，并接入了几个示例贡献点。你通常只需要从这些位置开始修改：

- `src/widgets/home-widget.ts`：首页卡片
- `src/pages/settings-page.ts`：扩展设置页
- `src/pages/example-page.tsx`：自定义页面，可在主窗口内跳转显示，也可在独立新窗口显示

如果你只想先保留一个最小功能，可以删掉不需要的页面贡献，只保留 `homeWidget` 或 `settingsPage`。

## 第七步：安装到 SJMCL

构建完成后，在启动器中导入 `dist/<identifier>-<version>.sjmclx` 即可：

1. 打开启动器。
2. 进入“设置”。
3. 打开“扩展”页面。
4. 点击“添加”并选择刚才生成的 `.sjmclx` 文件。
