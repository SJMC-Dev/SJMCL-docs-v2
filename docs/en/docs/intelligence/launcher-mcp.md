# Launcher MCP Service

> [!NOTE]
> This document was translated from the Simplified Chinese version using AI.

You can enable the Launcher MCP service so external Agent applications can automate control of the launcher.

## Configure the Launcher

Before configuring an external Agent app, first enable the service port in the launcher.

1. Open the launcher **Settings** page.
2. Go to the **Intelligence** tab.
3. Enable **Launcher MCP Service**.
4. **Critical step**: write down the port number shown on the page (default `18970` in the screenshot below).
   > **Note**: Keep the launcher running. The MCP service currently works only while the launcher is running.

![](/images/launcher-mcp-sjmcl-1.png)

## Configure External Agent Apps

### Configure Claude

TBD

---

### Configure Cherry Studio (Windows Example)

Cherry Studio natively supports HTTP (SSE) mode, and setup is straightforward.

#### Step 1: Add a Global MCP Server

1. Open Cherry Studio and click **Settings** (gear icon) in the lower-left corner.
2. Select **MCP Servers** from the left menu.
3. Click **+ Add** in the upper-right corner.
4. Choose **Quick Create**.

   ![](/images/launcher-mcp-cherrystudio-step1.png)

5. Fill in the following fields in the popup:

   | Option | How to fill | Example |
   | :--- | :--- | :--- |
   | **Name** | Custom service name | `SJMCL` |
   | **Type** | Must be this option | `Streamable HTTP (streamableHTTP)` |
   | **URL** | Format: `http://127.0.0.1:{port}/mcp` | `http://127.0.0.1:18970/mcp` |

   > **Tip**: Replace `18970` in the URL with the actual port shown in your launcher settings.

6. Click **Save**.
7. **Check status**: after saving, confirm the switch in the list is **green (enabled)** and the status indicator is lit, which means the connection is established successfully.

   ![](/images/launcher-mcp-cherrystudio-step2.png)

#### Step 2: Enable Tools in an Assistant

After adding the server, you still need to grant the assistant permission to use it.

1. Return to the **main chat page** (the first speech-bubble icon in the sidebar).
2. Select the **default assistant** on the left (or another assistant you created).
3. Click **More options** (three-dot icon) next to the assistant name to open settings.
4. **Model check**: ensure a usable model is selected in “Model Settings” ([Cherry Studio model setup guide](https://docs.cherry-ai.com/pre-basic/providers)).
5. Scroll down to **MCP Servers**.
6. Enable **Manual mode**, find the `SJMCL` service you just added, and toggle it **on**.

   ![](/images/launcher-mcp-cherrystudio-step3.png)

#### Step 3: Verify and Use

You can now send commands in chat to test whether the AI can successfully invoke launcher functions.

![](/images/launcher-mcp-cherrystudio-step4.png)
