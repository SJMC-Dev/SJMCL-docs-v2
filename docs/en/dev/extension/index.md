# Extension System

> [!NOTE]
>
> Extension support is available starting from launcher version 1.0.0.

The SJMCL extension system is a frontend extension runtime for extending the launcher interface and functionality. Extensions declare themselves through a manifest, attach themselves to the launcher UI through contribution points, and use host-injected APIs to access available capabilities.

## System Model

An extension consists of the following parts:

- manifest: describes the extension identifier, name, version, and entry
- UI contributions: declare different UI contribution points to extend the launcher interface and define extension interaction abilities
- host capabilities: injected by the launcher, including `React`, `ChakraUI`, launcher runtime data, and context interfaces

Extension scripts run inside a constrained host environment.

## Registration Flow

The flow from import to mount is:

1. The user imports a `.sjmclx` or `.zip` package.
2. The launcher extracts the package and reads `sjmcl.ext.json`.
3. If `frontend.entry` exists, the launcher loads the corresponding script.
4. The script reads `document.currentScript.dataset.extensionToken`.
5. The script calls `window.registerExtension(factory, token)`.
6. The host executes `factory(api)` and reads the returned contributions.
7. The contributions are mounted into the home page, settings page, standalone pages, and other locations.

## Mount Points

The launcher allows extensions to provide the following UI contributions:

- home cards
- extension settings page
- custom pages
- standalone custom pages

These entries are declared explicitly by the extension during registration.
