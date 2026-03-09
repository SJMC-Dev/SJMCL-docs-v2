# Download and Install

You can directly [download from this site](/en/downloads/) to get the latest SJMCL release. This page will prioritize files suitable for your current device. You can also visit [GitHub Releases](https://github.com/UNIkeEN/SJMCL/releases) to view all historical versions (including Nightly builds).

## Supported Platforms

| Platform | System Requirement | Supported Architectures | Available Package / Distribution Formats |
| --- | --- | --- | --- |
| Windows | Windows 7 or later | `aarch64`, `i686`, `x86_64` | Installer `.exe`, Portable `.exe` |
| macOS | macOS 10.15 or later | `aarch64`, `x86_64` | `.app`, `.dmg` |
| Linux | `webkit2gtk 4.1` (for example, Ubuntu 22.04) | `aarch64`, `x86_64` | `.AppImage`, `.deb`, `.rpm`, Portable binary |

> [!TIP]
> Some features may be limited by platform or package type.
>
> On Windows, the Portable version is recommended. On macOS, the DMG version is recommended. This gives you full functionality and a workflow closer to typical Minecraft launcher usage.

### Special Note (Windows 7)

If you need to run SJMCL on Windows 7, please [download Microsoft Edge WebView2 Runtime](https://developer.microsoft.com/zh-cn/microsoft-edge/webview2#download) and install it first. The "Evergreen Bootstrapper" is recommended.

## Install from Command Line

### Arch User Repository (AUR)

SJMCL is available on Arch User Repository (AUR), package name: `sjmcl-bin`.

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

## FAQ

TBD
