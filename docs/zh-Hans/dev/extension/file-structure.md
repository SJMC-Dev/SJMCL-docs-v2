# 文件结构

扩展以 Zip 压缩包格式存储，扩展名为 `.sjmclx`，其解压后通常包含以下内容：

```text
org.example.hello/
├─ sjmcl.ext.json
├─ icon.png
├─ frontend/
│  └─ index.js
├─ assets/
│  └─ banner.png
└─ data/
```

## `sjmcl.ext.json`

扩展清单文件，必须位于根目录。

示例：

```json
{
  "identifier": "org.example.hello",
  "name": "Hello Extension",
  "description": "My first SJMCL extension.",
  "author": "Example Team",
  "version": "0.1.0",
  "minimalLauncherVersion": "0.8.0",
  "frontend": {
    "entry": "frontend/index.js"
  }
}
```

字段如下：

| 字段 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `identifier` | `string` | 是 | 扩展标识符 |
| `name` | `string` | 是 | 扩展名称 |
| `description` | `string` | 否 | 扩展描述 |
| `author` | `string` | 否 | 作者信息 |
| `version` | `string` | 否 | 扩展版本，请使用语义化版本格式 |
| `minimalLauncherVersion` | `string` | 否 | 声明需要的最低启动器版本 |
| `frontend.entry` | `string` | 否 | 前端入口相对路径 |

`identifier` 使用命名空间格式，例如：

```text
org.example.hello
```

`frontend.entry` 指向前端入口文件，例如：

```json
{
  "frontend": {
    "entry": "frontend/index.js"
  }
}
```

这个入口文件加载后需要调用：

```js
window.registerExtension(factory, token);
```

## `icon.png`

扩展图标文件。启动器在扩展管理页中使用它作为扩展图标。

## `frontend/`

前端入口与相关脚本所在目录。

`sjmcl.ext.json` 中的 `frontend.entry` 指向这个入口文件。

## `assets/`

静态资源目录。图片、音频、视频等媒体资源通常放在这里。

扩展代码通过 `api.resolveAssetUrl(path)` 访问资源，例如：

```js
const logoUrl = api.resolveAssetUrl("assets/logo.png");
```

## `data/`

扩展私有数据目录。

这个目录用于运行时读写数据，例如：缓存文件、用户输入 与 扩展的本地配置

扩展通过 `host.actions.readFile()`、`writeFile()`、`deleteFile()`、`deleteDirectory()` 访问这里的内容。传入路径时使用相对路径，宿主会解析到扩展自己的 `data/` 目录下。