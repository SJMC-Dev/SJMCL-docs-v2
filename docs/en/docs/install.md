# Download and Install

You can directly [download from this site](/en/downloads/) to get the latest SJMCL release. This page will prioritize files suitable for your current device. You can also visit [GitHub Releases](https://github.com/UNIkeEN/SJMCL/releases) to view all historical versions (including Nightly builds).

## Supported Platforms

| Platform | System Requirement | Supported Architectures | Available Package / Distribution Formats |
| --- | --- | --- | --- |
| Windows | Windows 7 or later | `aarch64`, `i686`, `x86_64` | Installer `.exe`, Portable `.exe` |
| macOS | macOS 10.15 or later | `aarch64`, `x86_64` | `.app`, `.dmg` |
| Linux | `webkit2gtk 4.1` (for example, Ubuntu 22.04) | `aarch64`, `x86_64` | `.deb`, `.rpm`, Portable binary |

> [!TIP]
> Some features may be limited by platform or package type.
>
> On Windows, the Portable version is recommended. On macOS, the DMG version is recommended. This gives you full functionality and a workflow closer to typical Minecraft launcher usage.

### Special Note (Windows 7)

If you need to run SJMCL on Windows 7, please [download Microsoft Edge WebView2 Runtime](https://developer.microsoft.com/zh-cn/microsoft-edge/webview2#download) and install it first. The "Evergreen Bootstrapper" is recommended.

## Install from Command Line

<InstallCommandTabs />

### Winget

SJMCL provides a Windows Package Manager package with the package ID `SJMC.SJMCL`.

This method is suitable for Windows 10/11:

```powershell
winget install SJMC.SJMCL
```

> [!WARNING]
> The Winget index is publicly maintained. Before installing, consider running `winget show SJMC.SJMCL` to inspect the installer URL, and make sure the download source is from `github.com/UNIkeEN/SJMCL` or `sjmcl.club`.

If you need to run SJMCL on Windows 7, still refer to the WebView2 special note above.

### Homebrew

SJMCL provides a macOS Homebrew Cask named `sjmcl`.

You can install it directly with the fully qualified Cask name without manually adding the tap first:

```bash
brew install --cask SJMC-Dev/SJMCL/sjmcl
```

You can update SJMCL with:

```bash
brew upgrade --cask SJMC-Dev/SJMCL/sjmcl
```

### Linux Install Script

The install script currently supports Linux only. It detects `x86_64` and `aarch64` automatically and installs the latest stable release by default.

The command shown above uses the SJMC source by default, which is recommended for users in mainland China:

```bash
curl -LsSf https://mc.sjtu.cn/sjmcl/releases/install.sh | sh -s -- --source sjmc
```

If `--source` is not specified, the script will automatically select an installation source.

If you do not want to install through the system package manager, you can install the user-level portable version:

```bash
curl -LsSf https://mc.sjtu.cn/sjmcl/releases/install.sh | sh -s -- --portable
```

The portable version is installed to `~/.sjmcl/SJMCL`, and the script creates `~/.local/bin/sjmcl` as the command entry. This mode does not require root privileges.

### DEB Package

If you use a Debian-based distribution such as Debian, Ubuntu, or Linux Mint, you can also download the `.deb` file for your architecture from the [download page](/en/downloads/) or [GitHub Releases](https://github.com/UNIkeEN/SJMCL/releases), then install it manually.

```bash
sudo apt install ./SJMCL_<version>_linux_<arch>.deb
```

Here `<arch>` is usually `x86_64` or `aarch64`. On older systems, you can also install it with `dpkg` and then fix dependencies:

```bash
sudo dpkg -i ./SJMCL_<version>_linux_<arch>.deb
sudo apt install -f
```

### RPM Package

If you use an RPM-based distribution such as Fedora, RHEL, CentOS Stream, or openSUSE, you can download the `.rpm` file for your architecture from the [download page](/en/downloads/) or [GitHub Releases](https://github.com/UNIkeEN/SJMCL/releases), then install it manually.

For Fedora, RHEL, CentOS Stream, and similar distributions, use:

```bash
sudo dnf install ./SJMCL_<version>_linux_<arch>.rpm
```

For openSUSE, use:

```bash
sudo zypper install ./SJMCL_<version>_linux_<arch>.rpm
```

### Arch User Repository (AUR)

SJMCL is available on Arch User Repository (AUR), package name: `sjmcl-bin`.

This method is suitable for Arch Linux and Arch-based distributions.

Install with a common AUR helper (such as `yay`):

```bash
yay -S sjmcl-bin
```

Manual installation without an AUR helper:

```bash
git clone https://aur.archlinux.org/sjmcl-bin.git
cd sjmcl-bin
makepkg -si
```

### Snap

SJMCL is available on Snap Store, package name: `sjmcl`.

This method is suitable for Linux distributions with Snap Store enabled:

```bash
sudo snap install sjmcl
```

> [!NOTE]
> Due to Snap sandboxing, some SJMCL features may not work as expected. If you run into issues, please report them in [GitHub Issues](https://github.com/UNIkeEN/SJMCL/issues) and include logs, screenshots, and reproduction steps when possible.

> [!WARNING]
> When installed via Snap, game data may be stored inside the sandbox directory by default. Before uninstalling the launcher, back up important saves, resource packs, mods, and other data.

## FAQ

TBD

## Troubleshooting

### Linux: Gdk-Message: Error 71 (Protocol error) dispatching to Wayland display.

This is an [upstream issue](https://github.com/tauri-apps/tauri/issues/9394), which usually occurs when using Wayland with an NVIDIA discrete GPU.

Please add the environment variable `__NV_DISABLE_EXPLICIT_SYNC=1` or `WEBKIT_DISABLE_DMABUF_RENDERER=1`.
