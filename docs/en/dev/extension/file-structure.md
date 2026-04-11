# File Structure

A typical extension directory looks like this:

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

## Root Directory

The extension root is the directory that contains `sjmcl.ext.json`.

## `sjmcl.ext.json`

The extension manifest file. It must exist at the root.

Example:

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

Fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `identifier` | `string` | yes | extension identifier |
| `name` | `string` | yes | extension name |
| `description` | `string` | no | extension description |
| `author` | `string` | no | author metadata |
| `version` | `string` | no | extension version |
| `minimalLauncherVersion` | `string` | no | minimum launcher version |
| `frontend.entry` | `string` | no | relative frontend entry path |

`identifier` uses a namespaced format such as:

```text
org.example.hello
```

Rules:

- it must contain at least one `.`
- each segment starts with a lowercase letter
- segments may contain lowercase letters, digits, `_`, and `-`

`name` must not be empty.

`version` uses semantic versioning, for example:

```text
0.1.0
1.2.3
```

`minimalLauncherVersion` declares the minimum launcher version.

`frontend.entry` points to the frontend entry file, for example:

```json
{
  "frontend": {
    "entry": "frontend/index.js"
  }
}
```

That file must call:

```js
window.registerExtension(factory, token);
```

## `icon.png`

The extension icon used by the launcher extension management page.

## `frontend/`

The frontend entry and related scripts.

Common layout:

```text
frontend/index.js
```

`frontend.entry` in the manifest points to this file.

## `assets/`

Static assets such as images, audio, and video.

Access assets through `api.resolveAssetUrl(path)`:

```js
const logoUrl = api.resolveAssetUrl("assets/logo.png");
```

## `data/`

The private runtime data directory of the extension.

This directory stores runtime files such as:

- cache
- user input
- local configuration

Extensions access it through file actions such as `readFile()` and `writeFile()`.

## Package Layout

Two package layouts are supported.

### Layout 1: files at archive root

```text
sjmcl.ext.json
icon.png
frontend/index.js
```

### Layout 2: a single nested extension directory

```text
org.example.hello/
├─ sjmcl.ext.json
├─ icon.png
└─ frontend/
   └─ index.js
```

## Related Docs

- [Extension System](/en/dev/extension/)
- [Quick Start](/en/dev/extension/quick-start)
