# API

This page organizes the extension API by UI contributions, injected objects, host data, and host actions.

## Registration Entry

After the entry script loads, it must call:

```js
window.registerExtension(factory, token);
```

`token` comes from:

```js
const token = document.currentScript?.dataset?.extensionToken || "";
```

Minimal template:

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

## UI Contributions

The object returned by `factory(api)` may declare the following UI contributions.

### `homeWidget`

Single home card.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | `string` | yes | card title |
| `Component` | `React.ComponentType` | yes | card component |
| `description` | `string` | no | card description |
| `icon` | `string` | no | icon field |
| `key` | `string` | no | key for multi-card extensions |
| `defaultWidth` | `number` | no | default width |
| `minWidth` | `number` | no | minimum width |
| `maxWidth` | `number` | no | maximum width |

### `homeWidgets`

Multiple home cards, typed as `homeWidget[]`.

### `settingsPage`

Extension settings page.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `Component` | `React.ComponentType` | yes | settings page component |

Route:

```text
/settings/extension/<identifier>
```

### `page`

Single extension page.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `routePath` | `string` | yes | extension-internal route |
| `Component` | `React.ComponentType` | yes | page component |
| `isStandAlone` | `boolean` | no | whether the page is standalone |

General route:

```text
/extension/<identifier>/<routePath>
```

Standalone route:

```text
/standalone/extension/<identifier>/<routePath>
```

### `pages`

Multiple extension pages, typed as `page[]`.

### `customModal`

Single extension-defined modal. The host renders it inside a Chakra UI `Modal`, with the component mounted in `ModalBody`.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | `string` | yes | unique modal key within the current extension; must be non-empty and must not contain `:` |
| `title` | `string` | yes | modal title |
| `Component` | `React.ComponentType<{ params?: any; close: () => void; }>` | yes | modal content component |
| `params` | `any` | no | default params; can be overridden by `openCustomModal` |
| other fields | `Omit<ModalProps, "children" \| "isOpen">` | no | props forwarded to Chakra UI `Modal`, such as `size`, `closeOnOverlayClick`, and `motionPreset` |

The component receives:

```ts
{
  params?: any;
  close: () => void;
}
```

### `customModals`

Multiple extension-defined modals, typed as `customModal[]`.

### `slots`

Registers action items into host-provided UI slots. All current slots extend item menus on instance detail pages.

Base shape:

```ts
slots: {
  [slotKey]: {
    getItems: (context) => Array<{
      icon: string | IconType;
      label?: string;
      onClick?: MouseEventHandler<HTMLButtonElement>;
      danger?: boolean;
    }>;
  };
}
```

Notes:

- Only known slot keys are accepted by the host; unknown keys are ignored.
- `getItems(context)` returns the extra button items for the current context.
- `icon` may be an icon asset string or a `react-icons` `IconType`.
- When `danger` is `true`, the host renders the item with danger styling.

Currently supported slot keys and contexts:

| Slot Key | Extra `context` Fields |
| --- | --- |
| `ui.instance.world.item_menu_operations` | `save: WorldInfo` |
| `ui.instance.server.item_menu_operations` | `server: GameServerInfo` |
| `ui.instance.mod.item_menu_operations` | `mod: LocalModInfo` |
| `ui.instance.resourcepack.item_menu_operations` | `pack: ResourcePackInfo` |
| `ui.instance.server_resourcepack.item_menu_operations` | `pack: ResourcePackInfo` |
| `ui.instance.schematic.item_menu_operations` | `schematic: SchematicInfo` |
| `ui.instance.shaderpack.item_menu_operations` | `pack: ShaderPackInfo` |

Every slot context also includes this base payload:

```ts
{
  instanceId: string | undefined;
  summary: InstanceSummary | undefined;
}
```

### `dispose`

Cleanup function called during deactivation.

## Injected Objects

The `factory` argument is `api`. It includes the following injected objects.

### `api.React`

The host React runtime.

```js
const React = api.React;
```

### `api.ChakraUI`

The host Chakra UI bundle.

```js
const { Box, Button, Text, VStack } = api.ChakraUI;
```

### `api.Components`

Host business components.

| Field | Description |
| --- | --- |
| `OptionItem` | option card component |
| `OptionItemGroup` | option group component |
| `Section` | page section container |
| `WrapCard` | card component |
| `WrapCardGroup` | card group component |

### `api.identifier`

Extension identifier.

### `api.resolveAssetUrl(path)`

Resolves an extension-relative path to an asset URL.

`path` is relative to the extension root, not to the current script file. For example, if the extension contains `assets/video.mp4`, the argument is `"assets/video.mp4"`.

```js
const videoUrl = api.resolveAssetUrl("assets/video.mp4");
```

## Host

This section describes the host entry points injected into the extension runtime. The host context provides state abilities, action abilities, and reactive host-owned data.

### `api.getHostContext()`

Returns the host context object:

```ts
{
  actions: ExtensionAbilityActions;
  state: {
    useExtensionState: <T>(key: string, initialValue: T) => [T, SetState<T>];
  };
}
```

Common usage:

```js
const host = api.getHostContext();
```

### `api.useHostData()`

A React Hook for reading host data. The returned value is maintained by the host, and the component receives updated snapshots when players, instances, config, or route parameters change.

```js
const hostData = api.useHostData();
```

The detailed fields are listed below.

## Host Data

`api.useHostData()` returns a read-only snapshot exposed by the launcher. It is used to render UI, branch on launcher state, and react to changes in host-owned data.

`api.useHostData()` returns:

| Field | Type | Description |
| --- | --- | --- |
| `config` | `LauncherConfig` | launcher configuration |
| `selectedPlayer` | `Player \| undefined` | selected player |
| `selectedInstance` | `InstanceSummary \| undefined` | selected instance |
| `playerList` | `Player[]` | player list |
| `instanceList` | `InstanceSummary[]` | instance list |
| `routeQuery` | `Record<string, string \| string[] \| undefined>` | current route query |

## Host State

### `host.state.useExtensionState(key, initialValue)`

Extension-scoped state hook, similar to `useState` in React development.

```js
const host = api.getHostContext();
const [count, setCount] = host.state.useExtensionState("count", 0);
```

The state is stored by the launcher host under the extension scope.

## Host Actions

`host.actions` exposes host-implemented abilities to the extension. These methods are used for config updates, navigation, file access, network requests, and extension reload.

### `getPlayerList`

Gets the player list.

```ts
const players = host.actions.getPlayerList(sync?: boolean);
```

### `getInstanceList`

Gets the instance list.

```ts
const instances = host.actions.getInstanceList(sync?: boolean);
```

### `updateConfig`

Updates the value at a config path.

```ts
host.actions.updateConfig(path: string, value: any);
```

### `navigate`

Navigates within the route scope allowed for the extension.

```ts
await host.actions.navigate(route: string);
```

### `navBack`

Requests a single history back navigation from the host.

```ts
host.actions.navBack();
```

### `openWindow`

Opens a standalone window for the given route.

```ts
host.actions.openWindow(route: string, title: string);
```

### `openExternalLink`

Requests the host to open an external link.

```ts
await host.actions.openExternalLink(url: string);
```

### `openSharedModal`

Opens a shared host modal.

```ts
host.actions.openSharedModal(key: string, params?: any);
```

### `openCustomModal`

Opens a custom modal registered by the current extension.

```ts
host.actions.openCustomModal(key: string, params?: any);
```

`key` must match a modal declared in `customModal` or `customModals`, and can only target the current extension.

### `setHomeWidgetTitle` <Badge type="tip" text="1.1.0" />

Updates a home widget title.

```ts
host.actions.setHomeWidgetTitle(title: string, key?: string);
```

If the extension declares multiple home widgets, pass `key` to target a specific one; omit `key` for the single home widget case.

### `readFile`

Reads a file from the extension `data/` directory.

```ts
const content = await host.actions.readFile(
  path: string,
  mode?: "string" | "base64"
);
```

The default mode is `"string"`. Use `"base64"` for binary content.

### `writeFile`

Writes content into a file under the extension `data/` directory.

```ts
await host.actions.writeFile(
  path: string,
  content: string,
  mode?: "string" | "base64"
);
```

The default mode is `"string"`. Use `"base64"` when writing binary content.

### `deleteFile`

Deletes a file under the extension `data/` directory.

```ts
await host.actions.deleteFile(path: string);
```

### `deleteDirectory`

Deletes a directory under the extension `data/` directory.

```ts
await host.actions.deleteDirectory(path: string);
```

### `request`

Performs an HTTP request and returns a response object.

```ts
const response = await host.actions.request(
  input: URL | Request | string,
  init?: RequestInit
);
```

### `requestText`

Requests text content and decodes it with the given encoding.

```ts
const text = await host.actions.requestText(
  url: string,
  init?: RequestInit,
  encoding?: string
);
```

### `invoke`

Calls a host command and returns its result.

```ts
const result = await host.actions.invoke<T = unknown>(
  command: string,
  payload?: Record<string, unknown>
);
```

#### Example

Get the currently selected instance ID and read `options.txt` from that instance root directory:

```js
const host = api.getHostContext();
const hostData = api.useHostData();

async function readSelectedInstanceOptions() {
  const instanceId = hostData.selectedInstance?.id;
  if (!instanceId) {
    throw new Error("No selected instance");
  }

  const optionsText = await host.actions.invoke("read_instance_file", {
    instanceId,
    dirType: "Root",
    path: "options.txt",
    mode: "string",
  });

  return optionsText;
}
```

`dirType: "Root"` targets the instance root directory. To read from `mods`, `resourcepacks`, and other subdirectories, pass the corresponding `InstanceSubdirType` value.

### `logger`

Accesses the host logger.

```ts
host.actions.logger.info("extension log");
```

### `reloadSelf`

Reloads the extension.

```ts
host.actions.reloadSelf();
```

### `updateSelf`

Requests the host to download an updated extension package and prompt for installation.

```ts
await host.actions.updateSelf(src: string, newVersion: string);
```

## Related Docs

- [Extension System](/en/dev/extension/)
- [File Structure](/en/dev/extension/file-structure)
- [Quick Start](/en/dev/extension/quick-start)
