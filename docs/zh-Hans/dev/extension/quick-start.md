# 快速开始

这一页会带你从零做出一个最小可运行的 SJMCL 扩展。

## 第一步：创建目录

先建立一个扩展目录，例如：

```text
org.example.hello/
├─ sjmcl.ext.json
├─ icon.png
└─ frontend/
   └─ index.js
```

目录名可以与 `identifier` 保持一致，便于调试与重新打包。

## 第二步：编写 `sjmcl.ext.json`

```json
{
  "identifier": "org.example.hello",
  "name": "Hello Extension",
  "description": "My first SJMCL extension.",
  "version": "0.1.0",
  "minimalLauncherVersion": "0.8.0",
  "frontend": {
    "entry": "frontend/index.js"
  }
}
```

这里需要注意几件事：

- `identifier` 必须是合法命名空间格式，例如 `org.example.hello`
- `name` 不能为空
- `version` 使用语义化版本
- `minimalLauncherVersion` 应写成你实际支持的最低版本
- `frontend.entry` 是相对于扩展根目录的路径

## 第三步：编写前端入口

下面是一个最小但完整的扩展示例。它会在首页添加一个卡片，并展示实例信息与一个可持久化的计数器。

```js
(function registerHelloExtension(factory) {
  const token = document.currentScript?.dataset?.extensionToken || "";

  if (!token) {
    throw new Error("Missing extension activation token");
  }

  window.registerExtension(factory, token);
})(function (api) {
  const React = api.React;
  const { Badge, Button, HStack, Text, VStack } = api.ChakraUI;

  function HelloWidget() {
    const host = api.getHostContext();
    const hostData = api.useHostData();
    const [count, setCount] = host.state.useExtensionState("count", 0);

    return React.createElement(
      VStack,
      { align: "stretch", spacing: 3 },
      React.createElement(
        HStack,
        { justify: "space-between", align: "center" },
        React.createElement(Text, { fontWeight: "bold" }, "Hello Extension"),
        React.createElement(
          Badge,
          { colorScheme: "green", variant: "subtle" },
          hostData.selectedInstance?.name || "No Instance"
        )
      ),
      React.createElement(
        Text,
        { fontSize: "sm" },
        "Current player: ",
        hostData.selectedPlayer?.name || "None"
      ),
      React.createElement(
        Button,
        {
          size: "sm",
          onClick: function () {
            setCount((value) => value + 1);
          },
        },
        "Clicked ",
        String(count),
        " times"
      )
    );
  }

  return {
    homeWidget: {
      title: "Hello",
      defaultWidth: 320,
      minWidth: 260,
      Component: HelloWidget,
    },
  };
});
```

这段代码体现了扩展的几个基本规则：

- 启动时必须读取 `document.currentScript.dataset.extensionToken`
- 必须调用 `window.registerExtension(factory, token)` 完成注册
- 组件写法基于宿主注入的 `React` 与 `ChakraUI`
- 需要动态读取启动器数据时，用 `api.useHostData()`
- 需要跨重挂载保存状态时，用 `host.state.useExtensionState()`

## 第四步：（可选）为插件制作设置页面

如果你希望扩展在设置页里有独立入口，可以继续返回 `settingsPage`：

```js
function SettingsPage() {
  const React = api.React;
  const { Box, Text } = api.ChakraUI;

  return React.createElement(
    Box,
    null,
    React.createElement(Text, null, "Hello from extension settings.")
  );
}

return {
  homeWidget: {
    title: "Hello",
    Component: HelloWidget,
  },
  settingsPage: {
    Component: SettingsPage,
  },
};
```

只要扩展返回了 `settingsPage`，启动器就会在扩展管理页里为这个扩展显示设置入口。

## 第五步：打包

SJMCL 目前接受 `.sjmclx` 和 `.zip`。本质上它们都是 zip 包，只是 `.sjmclx` 更适合作为扩展分发格式。

如果你的扩展目录是 `org.example.hello/`，可以直接把它压缩成一个包：

```bash
zip -r org.example.hello.sjmclx org.example.hello
```

你也可以生成 `org.example.hello.zip`，启动器同样可以识别。

## 第六步：安装到 SJMCL

1. 打开启动器。
2. 进入“设置”。
3. 打开“扩展插件”页面。
4. 点击“添加”并选择刚才生成的 `.sjmclx` 或 `.zip`。

安装成功后，扩展会默认加入启用列表。若你的扩展提供了首页卡片或页面，它会在刷新扩展列表后自动加载。

## 调试

可以通过下面这些方式排查问题：

- 用 `host.actions.logger` 打日志
- 先从单个 `homeWidget` 开始，确认注册链路没问题
- 把状态放进 `useExtensionState()`，避免页面切换后状态丢失
- 静态资源统一走 `api.resolveAssetUrl()`
- 需要重新激活时，调用 `host.actions.reloadSelf()`

如果扩展导入失败，优先检查这几项：

- `sjmcl.ext.json` 是否在扩展根目录
- `identifier` 是否合法
- `frontend.entry` 路径是否存在
- `minimalLauncherVersion` 是否高于启动器版本
- 入口脚本是否真的调用了 `window.registerExtension(...)`
