# Quick Start (Manual Setup)

Besides using the scaffold, you can also write a minimal working SJMCL extension by hand.

## 1. Create the Folder

```text
org.example.hello/
├─ sjmcl.ext.json
├─ icon.png
└─ frontend/
   └─ index.js
```

The folder name can match the extension identifier for easier debugging and packaging.

## 2. Write `sjmcl.ext.json`

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

Key points:

- `identifier` must be namespaced
- `name` must not be empty
- `version` should be semver
- `minimalLauncherVersion` should match your real requirement
- `frontend.entry` is relative to the extension root

## 3. Write the Frontend Entry

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

This covers the basic rules:

- read the activation token from `document.currentScript`
- call `window.registerExtension(factory, token)`
- build UI with injected `React` and `ChakraUI`
- use `api.useHostData()` for reactive host-owned data
- use `host.state.useExtensionState()` for extension-owned state

Besides the home widget, you can also create custom pages and standalone windows. See [UI Contributions](./api.md#ui-contributions).

## 4. Optionally Add a Settings Page

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

If `settingsPage` is returned, SJMCL exposes a dedicated settings entry for the extension.

## 5. Package It

SJMCL accepts both `.sjmclx` and `.zip`. They are both zip archives in practice.

```bash
zip -r org.example.hello.sjmclx org.example.hello
```

You can also generate `org.example.hello.zip`, which the launcher can recognize as well.

## 6. Import It into SJMCL

1. Open the launcher.
2. Go to Settings.
3. Open the Extensions page.
4. Click Add and select the package.

Newly added extensions are enabled by default.
If your extension provides a home widget or page, it will load automatically after the extension list is refreshed.

## Debugging

- log through `host.actions.logger`
- start with one `homeWidget`
- keep persistent UI state in `useExtensionState()`
- resolve assets with `api.resolveAssetUrl()`
- call `host.actions.reloadSelf()` when you need a clean reload

If the extension import fails, check these items first:

- `sjmcl.ext.json` exists at the extension root
- `identifier` is valid
- `frontend.entry` points to an existing path
- `minimalLauncherVersion` is not higher than the launcher version
- the entry script actually calls `window.registerExtension(...)`
