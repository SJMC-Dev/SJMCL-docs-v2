# API

这一页按 UI 贡献、注入对象、宿主数据和宿主能力来组织扩展 API。

## 注册入口

扩展入口脚本加载后，需要调用：

```js
window.registerExtension(factory, token);
```

其中 `token` 来自：

```js
const token = document.currentScript?.dataset?.extensionToken || "";
```

最小模板：

```js
(function registerMyExtension(factory) {
  const token = document.currentScript?.dataset?.extensionToken || "";

  if (!token) {
    throw new Error("Missing extension activation token");
  }

  window.registerExtension(factory, token);
})(function (api) {
  return {};
});
```

## UI 贡献

`factory(api)` 返回的对象可以声明以下 UI 贡献。

### `homeWidget`

单个首页卡片。

| 字段 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | 是 | 卡片标题 |
| `Component` | `React.ComponentType` | 是 | 卡片组件 |
| `description` | `string` | 否 | 卡片描述 |
| `icon` | `string` | 否 | 图标字段 |
| `key` | `string` | 否 | 多卡片时的 key |
| `defaultWidth` | `number` | 否 | 默认宽度 |
| `minWidth` | `number` | 否 | 最小宽度 |
| `maxWidth` | `number` | 否 | 最大宽度 |

### `homeWidgets`

多个首页卡片，类型为 `homeWidget[]`。

### `settingsPage`

扩展设置页。

| 字段 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `Component` | `React.ComponentType` | 是 | 设置页组件 |

对应路由：

```text
/settings/extension/<identifier>
```

### `page`

单个扩展页面。

| 字段 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `routePath` | `string` | 是 | 扩展内部路由 |
| `Component` | `React.ComponentType` | 是 | 页面组件 |
| `isStandAlone` | `boolean` | 否 | 是否为独立窗口页面 |

普通页面路由：

```text
/extension/<identifier>/<routePath>
```

独立窗口路由：

```text
/standalone/extension/<identifier>/<routePath>
```

### `pages`

多个扩展页面，类型为 `page[]`。

### `dispose`

扩展停用时调用的清理函数。

## 注入对象

`factory` 的参数为 `api`。`api` 上包含以下注入对象。

### `api.React`

宿主注入的 React 运行时。

扩展组件通过它使用 React 能力，例如：

```js
const React = api.React;
```

### `api.ChakraUI`

宿主注入的 Chakra UI 组件集合。

例如：

```js
const { Box, Button, Text, VStack } = api.ChakraUI;
```

### `api.Components`

宿主注入的业务组件。

| 字段 | 说明 |
| --- | --- |
| `OptionItem` | 选项卡片组件 |
| `OptionItemGroup` | 选项组组件 |
| `Section` | 页面分区容器 |
| `WrapCard` | 卡片组件 |
| `WrapCardGroup` | 卡片组组件 |

### `api.identifier`

扩展标识符。

### `api.resolveAssetUrl(path)`

将扩展内相对路径转换为资源 URL。

`path` 是相对于扩展根目录的路径，而不是相对于当前脚本文件的路径。比如扩展目录中存在 `assets/video.mp4`，那么这里传入的就是 `"assets/video.mp4"`。

示例：

```js
const videoUrl = api.resolveAssetUrl("assets/video.mp4");
```

## Host

这一节介绍宿主注入给扩展的上下文入口。扩展通过这里拿到状态能力、动作能力，以及响应式的宿主数据。

### `api.getHostContext()`

返回宿主上下文对象：

```ts
{
  actions: ExtensionAbilityActions;
  state: {
    useExtensionState: <T>(key: string, initialValue: T) => [T, SetState<T>];
  };
}
```

常见写法：

```js
const host = api.getHostContext();
```

### `api.useHostData()`

这是一个 React Hook，用于读取宿主数据。它返回的值由宿主维护，当账号、实例、配置或路由参数变化时，组件会收到新的数据快照。

```js
const hostData = api.useHostData();
```

具体介绍如下。

## Host Data

`api.useHostData()` 返回的是启动器提供给扩展的只读数据快照。它适合用来驱动界面展示、条件判断和与宿主状态相关的交互逻辑。

`api.useHostData()` 包含以下字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `config` | `LauncherConfig` | 启动器配置 |
| `selectedPlayer` | `Player \| undefined` | 选中的账号 |
| `selectedInstance` | `InstanceSummary \| undefined` | 选中的实例 |
| `playerList` | `Player[]` | 账号列表 |
| `instanceList` | `InstanceSummary[]` | 实例列表 |
| `routeQuery` | `Record<string, string \| string[] \| undefined>` | 路由查询参数 |

## Host State

### `useExtensionState(key, initialValue)`

扩展私有状态 Hook，类似于 React 开发中的 `useState`。

```js
const host = api.getHostContext();
const [count, setCount] = host.state.useExtensionState("count", 0);
```

状态以扩展作用域保存在启动器宿主侧。

## Host Actions

`host.actions` 提供扩展可调用的宿主能力。每个动作都由宿主实现，扩展通过这些方法完成配置更新、页面跳转、文件访问、网络请求和扩展重载等操作。

### `getPlayerList`

获取账号列表。

```ts
const players = host.actions.getPlayerList(sync?: boolean);
```

### `getInstanceList`

获取实例列表。

```ts
const instances = host.actions.getInstanceList(sync?: boolean);
```

### `updateConfig`

更新配置路径对应的值。

```ts
host.actions.updateConfig(path: string, value: any);
```

### `navigate`

在扩展允许的路由范围内跳转页面。

```ts
await host.actions.navigate(route: string);
```

### `openWindow`

打开独立窗口并加载指定路由。

```ts
host.actions.openWindow(route: string, title: string);
```

### `openExternalLink`

请求宿主打开外部链接。

```ts
await host.actions.openExternalLink(url: string);
```

### `openSharedModal`

打开宿主共享弹窗。

```ts
host.actions.openSharedModal(key: string, params?: any);
```

### `readFile`

读取扩展 `data/` 目录中的 UTF-8 文本文件。

```ts
const content = await host.actions.readFile(path: string);
```

### `writeFile`

将文本内容写入扩展 `data/` 目录中的文件。

```ts
await host.actions.writeFile(path: string, content: string);
```

### `deleteFile`

删除扩展 `data/` 目录中的文件。

```ts
await host.actions.deleteFile(path: string);
```

### `deleteDirectory`

删除扩展 `data/` 目录中的目录。

```ts
await host.actions.deleteDirectory(path: string);
```

### `request`

发起 HTTP 请求并返回响应对象。

```ts
const response = await host.actions.request(
  input: URL | Request | string,
  init?: RequestInit
);
```

### `requestText`

请求文本内容，并按指定编码读取响应。

```ts
const text = await host.actions.requestText(
  url: string,
  init?: RequestInit,
  encoding?: string
);
```

### `invoke`

调用宿主的 Tauri 命令并返回结果，部分命令无法被直接调用。

```ts
const result = await host.actions.invoke<T = unknown>(
  command: string,
  payload?: Record<string, unknown>
);
```

### `logger`

访问宿主日志模块。

```ts
host.actions.logger.info("extension log");
```

### `reloadSelf`

重新加载扩展。

```ts
host.actions.reloadSelf();
```

### `updateSelf`

请求宿主下载指定版本的扩展包，并弹出安装更新确认。

> 自 `1.0.0-beta.6` 起支持。

```ts
await host.actions.updateSelf(src: string, newVersion: string);
```
