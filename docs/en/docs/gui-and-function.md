# SJMCL Interface & Features Guide

Welcome to SJMCL (SJMC Launcher)! This guide walks you through the launcher's core UI and features so you can quickly get started and enjoy a modern, efficient Minecraft launch and management experience.

---

## 1. Top Navigation Bar

This area is always visible. From left to right it includes the title and five main clickable sections: **Launch**, **Instances**, **Accounts**, **Search**, and **Settings**.

![Top Navigation Bar](/images/gui-topbar.png)

## 2. Launch Screen

The Launch Screen is the first stop before entering the game. Here you can quickly choose an account, switch instances, and start Minecraft with a single click.

*   **First-run setup**: The first time you open the launcher, this screen appears so you can read the Terms of Service and configure **Language Preferences** (bottom-left) if needed.

![First Run Setup](/images/gui-start-first-start.png)

*   **Launch page**: Shows your custom background and provides the account selector and launch button in the bottom-right.

![Launch Page](/images/gui-start-overview.png)

*   **Quick switch & start**: Before launching, click the **switch button** in the top-right of the **Account** or **Instance** panel to quickly swap accounts or versions from the pop-up overlay. Click **Launch Game** to start Minecraft immediately.

![Account Switch](/images/gui-start-account-select.png)

![Instance Switch](/images/gui-start-game-version-select.png)

*   **Game logs & crash analysis**:
    *   **Live log viewing**: If you enable "Show Game Log" in Settings, a log window opens automatically when the game starts. You can filter by keyword, log level (FATAL, ERROR, etc.), and export logs for troubleshooting.
    ![Game Log](/images/gui-start-game-log.png)
    *   **Smart crash analysis**: If the game crashes unexpectedly, SJMCL captures the crash cause and shows an analysis window (including Java version, system architecture, and crash details) to help you quickly locate and resolve the issue.
    ![Crash Analysis](/images/gui-start-game-error.png)

---

## 3. Instances Screen

The Instances screen is where you manage all game versions, mods, and saves. SJMCL uses a multi-directory, isolated instance storage mechanism.

![Instances Overview](/images/gui-instance-overview.png)

### All Instances

The "All Instances" view displays every instance across your game directories and provides quick actions for each.

![All Instances](/images/gui-instance-all-instance.png)

#### Top Bar

From left to right, the top bar includes refresh and sorting controls:
* **Refresh**: Reloads the current view.
* **Sort & filter**: Sort instances by game version (ascending/descending) or instance name.
* **View toggle**: Switch between grid view and list view.
* **Add & Import**: Navigate to the Add & Import screen.
* **Launch game**: Launch the currently selected instance.

![All Instances Top Bar](/images/gui-instance-topbar.png)

#### Specific Instance

In grid view, click the **"…"** menu in an instance's top-right corner to open the instance folder, go to its details page, or delete the instance.

![Specific Instance](/images/gui-instance-all-instance-certain-one.png)

### Instance Details

Click an instance in the sidebar to open the details view. This page shows multi-dimensional information about the selected instance, including overview, mods, resource packs, and screenshots.

![Instance Details](/images/gui-instance-sub-instance.png)

#### Top Bar

From left to right, the top bar includes instance name, starring, open folder, create shortcut, and more:
* **Instance Name**: Displays the instance name.
* **Star**: Star an instance to pin it to the top of the sidebar and the All Instances list (if sorting hasn't changed, click Refresh in the All Instances top bar).
* **Open Folder**: Opens the instance folder.
* **Create Shortcut**: Creates a desktop shortcut to launch this instance.
* **Export Pack**: Export the instance as a pack.
* **Delete Instance**: Delete the current instance.
* **Launch Instance**: Launch the current instance.

![Instance Details Top Bar](/images/gui-instance-sub-instance-topbar.png)

#### Module Pages

TBD

### Add & Import

In **Add & Import**, you can:
* Install a clean or modded instance with one click.
* Import a local pack or **download and import a pack** directly from major platforms like CurseForge or Modrinth.
* Link and manage an existing local game directory to seamlessly continue using your old data.
* Download vanilla server files for any supported version.

![Add & Import](/images/gui-instance-new-instance.png)

### Global Game Settings

Quick access to the Global Game Settings section in Settings.

---

## 4. Accounts Screen

SJMCL includes a powerful multi-user authentication system that integrates with Microsoft's official account system, supporting multiple profiles and identity switching for different use cases.

![Accounts Overview](/images/gui-account-overview.png)

### Multi-Account Overview

View accounts grouped by source, with grid or list layouts for easy browsing.

### Account Details

TBD

### Import from Other Launchers

Import account information quickly from other launchers.

![Import from Other Launchers](/images/gui-account-upload-other-launcher.png)

### Add Auth Server

Add a skin site authentication server.

![Add Auth Server](/images/gui-account-add-auth.png)

---

## 5. Search & Discovery Screen

SJMCL is not just a launch key — it's also a window into deep Minecraft content.

*   **Unified search**: Click "Search" from anywhere, type a keyword, and search both **local instance resources** and **online game components** in one place. When "Discovery" is enabled, you can also invoke it with Ctrl+S.

![Unified Search](/images/gui-search.png)

*   **Discovery feed**: When you enable "Discovery page" mode in Settings > General, the Search bar becomes **Discovery**.
    *   Browse the latest announcements, news, and guides from configured sources (e.g., the SJMC community home page).
    *   Click any card to open the related webpage.
    *   Manage and add additional content sources at any time.

![Discovery Feed](/images/gui-find.png)

---

## 6. Settings Screen

Provides deep personalization and launcher tuning so SJMCL fits your workflow. Includes Global Game Settings, Java management, General, Appearance, Downloads, Sync & Restore, Docs & Help, About, and more.

![Settings Overview](/images/gui-settings-overview.png)

### TBD

TBD


