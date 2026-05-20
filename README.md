# Directus Discord Operation Extension | Send Messages to Discord from Directus Flows

[![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)](https://github.com/kashyap-thakar/directus-extension-discord-operation)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/kashyap-thakar/directus-extension-discord-operation/blob/main/LICENSE)
[![Directus](https://img.shields.io/badge/Directus-10.10.0+-purple.svg)](https://directus.io)

> **A powerful Directus custom operation extension that enables sending text messages and rich embed messages to Discord channels via webhooks or Discord Bot directly from your Directus automation flows. Perfect for notifications, alerts, updates, and team communication.**

**🔗 Repository:** [directus-extension-discord-operation](https://github.com/kashyap-thakar/directus-extension-discord-operation) | **📦 npm:** `directus-extension-discord-operation`

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Discord Bot Setup](#discord-bot-setup)
- [Discord Webhook Setup](#discord-webhook-setup)
- [Usage in Directus Flows](#usage-in-directus-flows)
- [Configuration Examples](#configuration-examples)
- [Embed Fields Format](#embed-fields-format)
- [Troubleshooting](#troubleshooting)
- [Validation & Error Handling](#validation--error-handling)
- [Contributing](#contributing)
- [License](#license)

## Screenshots & Visual Guide

Visual demonstration of the Directus Discord operation extension in action:

1. **Operation in Directus Flow Builder:**
   ![Directus Discord Operation in Flow Builder - Send Discord messages from Directus automation flows](https://raw.githubusercontent.com/kashyap-thakar/directus-extension-discord-operation/main/images/operation-listing.png)

2. **Integration Method Selection (Webhook vs Bot):**
   ![Integration Method Selection - Choose between webhook or bot integration method](https://raw.githubusercontent.com/kashyap-thakar/directus-extension-discord-operation/main/images/message-type.png)

3. **Message Configuration Interface:**
   ![Directus Discord operation configuration - Simple message setup with webhook or bot](https://raw.githubusercontent.com/kashyap-thakar/directus-extension-discord-operation/main/images/simple-example.png)

4. **Simple Text Message Result:**
   ![Discord simple text message example sent from Directus flow](https://raw.githubusercontent.com/kashyap-thakar/directus-extension-discord-operation/main/images/simple-message-example.png)

5. **Rich Embed Templates:**
   ![Discord embed message templates - Basic, Success, Error, Info themes](https://raw.githubusercontent.com/kashyap-thakar/directus-extension-discord-operation/main/images/embed-templates.png)

6. **Embed Message Configuration:**
   ![Discord rich embed message configuration in Directus - Custom fields, images, author info](https://raw.githubusercontent.com/kashyap-thakar/directus-extension-discord-operation/main/images/embed-example.png)

7. **Rich Embed Message Result:**
   ![Discord rich embed message example with custom fields and styling](https://raw.githubusercontent.com/kashyap-thakar/directus-extension-discord-operation/main/images/embed-message-example.png)

## Features

### 🔌 Dual Integration Methods

Choose between **Discord Webhooks** or **Discord Bot** integration:

- **Webhooks**: Simple URL-based integration (no bot setup required) - perfect for quick notifications
- **Discord Bot**: Traditional bot-based integration with full channel access - ideal for advanced use cases

### 💬 Message Types

- **Simple Text Messages**: Send plain text messages to any Discord channel or thread
- **Rich Embed Messages**: Create beautiful, structured messages with:
  - Pre-designed templates (Basic, Success, Error, Info)
  - Custom titles and descriptions
  - Author information with name, icon, and URL
  - Thumbnail and main images
  - Custom fields with inline options
  - Footer text and icon
  - Timestamp
- **Dynamic Templates**:
  - 🟦 Basic Embed - Clean, professional blue theme (#3498DB)
  - 🟩 Success Notification - Positive green theme (#57F287)
  - 🟥 Error Notification - Alert red theme (#ED4245)
  - ⬜️ Information Update - Informative cyan theme (#3498DB)
- **Secure Authentication**:
  - Discord Bot tokens stored securely using Directus's password field type
  - Webhook URLs can be entered directly (no special storage required)
- **Robust Validation**:
  - Automatic validation of webhook URL format
  - Channel/Thread ID format validation (17-19 digit numbers)
  - Required field validation based on selected method and message type
  - Clear, descriptive error messages for troubleshooting
- **Enhanced Error Handling**:
  - Comprehensive error messages from Discord API
  - Network error detection and reporting
  - JSON parsing validation for embed fields

## Requirements

- Directus version ^10.10.0
- Node.js version >=18.0.0
- **For Bot Method:**
  - A Discord bot with:
    - `Send Messages` permission
    - `Embed Links` permission (for rich embeds)
- **For Webhook Method:**
  - A Discord webhook URL (no special permissions required)

## Installation

Install the Directus Discord operation extension via npm, yarn, or pnpm:

```bash
# Using npm
npm install directus-extension-discord-operation

# Using yarn
yarn add directus-extension-discord-operation

# Using pnpm
pnpm add directus-extension-discord-operation
```

After installation, restart your Directus instance. The extension will be available in the Flow Builder operations list.

## Quick Start

1. **Install the extension** (see Installation above)
2. **Set up Discord integration** (choose webhook or bot method - see setup guides below)
3. **Create a Directus Flow** and add the "Send Discord Message" operation
4. **Configure your message** (simple text or rich embed)
5. **Test and deploy** your automation flow

**Need help?** Check the [Troubleshooting](#troubleshooting) section or review the [Configuration Examples](#configuration-examples).

## Discord Bot Setup

Follow these steps to set up a Discord Bot for use with this Directus extension:

### Step 1: Create a Discord Application

   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Click "New Application" and give it a name
   - Navigate to the "Bot" section
   - Click "Add Bot"
   - Copy the bot token (you'll need this later)
   - **Learn more**: [Discord Developer Documentation - Getting Started](https://discord.com/developers/docs/getting-started)

### Step 2: Invite the Bot to Your Server

   - Go to the "OAuth2" section
   - In "Scopes", select "bot"
   - In "Bot Permissions", select:
     - Send Messages
     - Embed Links
   - Copy the generated URL and open it in a browser
   - Select your server and authorize the bot

### Step 3: Get Channel/Thread ID
   - Enable Developer Mode in Discord (User Settings > App Settings > Advanced)
   - Right-click on the channel/thread
   - Click "Copy ID"
   - Channel/Thread IDs are 17-19 digit numbers (the extension validates this format)

## Discord Webhook Setup

The webhook method is simpler and requires no bot setup. Follow these steps:

### Step 1: Create a Discord Webhook

   - Go to your Discord server
   - Right-click on the channel where you want to send messages
   - Select "Edit Channel"
   - Go to the "Integrations" tab
   - Click "Webhooks"
   - Click "New Webhook"
   - Give your webhook a name and optional avatar
   - Copy the webhook URL (you'll need this later)

### Step 2: Webhook Permissions
   - Webhooks automatically have permission to send messages
   - No additional permissions setup required

### Step 3: Webhook URL Format
   - The webhook URL should be in the format: `https://discord.com/api/webhooks/{webhook_id}/{webhook_token}`
   - The extension automatically validates the webhook URL format
   - **Learn more**: [Discord Support - Intro to Webhooks](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks)

## Usage in Directus Flows

### Adding the Operation to Your Flow

1. **Open Flow Builder**: Navigate to your Directus project → Settings → Flows
2. **Create or Edit Flow**: Create a new flow or edit an existing one
3. **Add Operation**: Click "Add Operation" and select **"Send Discord Message"**

### Configuration Steps

#### Step 1: Choose Discord Integration Type

- **Discord Webhook**: Select for simple URL-based integration (recommended for beginners)
- **Discord Bot**: Select for traditional bot-based integration (more control, requires bot setup)

#### Step 2: Configure Based on Selected Type

**For Webhook Method:**
- Enter your Discord Webhook URL (from Discord channel settings)
- Choose Message Type: Simple text or Rich embed
- Configure message content based on selected type

**For Bot Method:**
- Enter Channel ID or Thread ID (17-19 digit number)
- Enter your Discord Bot Token (from Discord Developer Portal)
- Choose Message Type: Simple text or Rich embed
- Configure message content based on selected type

#### Step 3: Test and Save

- Test your flow configuration
- Save the flow
- Activate the flow to start sending Discord messages automatically

## Embed Fields Format

When adding fields to your embed, use JSON array format:

```json
[
  {
    "name": "Field Title",
    "value": "Field Value",
    "inline": true
  },
  {
    "name": "Another Field",
    "value": "More information",
    "inline": false
  }
]
```

## Configuration Examples

Complete JSON configuration examples for different use cases:

### Simple Message (Webhook)

```json
{
  "integrationMethod": "webhook",
  "channelId": "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN",
  "messageType": "simple",
  "message": "Hello from Directus via Webhook!"
}
```

### Simple Message (Bot)

```json
{
  "integrationMethod": "bot",
  "channelId": "YOUR_CHANNEL_ID",
  "messageType": "simple",
  "message": "Hello from Directus!",
  "token": "YOUR_BOT_TOKEN"
}
```

### Success Embed (Webhook)

```json
{
  "integrationMethod": "webhook",
  "channelId": "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN",
  "messageType": "embed",
  "embedTemplate": "success",
  "embedTitle": "Operation Successful",
  "embedDescription": "The backup process completed successfully.",
  "embedFields": "[{\"name\": \"Time\", \"value\": \"5 minutes\", \"inline\": true}, {\"name\": \"Size\", \"value\": \"1.2GB\", \"inline\": true}]",
  "embedTimestamp": true
}
```

### Success Embed (Bot)

```json
{
  "integrationMethod": "bot",
  "channelId": "YOUR_CHANNEL_ID",
  "messageType": "embed",
  "embedTemplate": "success",
  "embedTitle": "Operation Successful",
  "embedDescription": "The backup process completed successfully.",
  "embedFields": "[{\"name\": \"Time\", \"value\": \"5 minutes\", \"inline\": true}, {\"name\": \"Size\", \"value\": \"1.2GB\", \"inline\": true}]",
  "embedTimestamp": true,
  "token": "YOUR_BOT_TOKEN"
}
```

## Troubleshooting

Common issues, error messages, and their solutions:

### Webhook Issues

1. **Webhook Not Working**

   - Verify webhook URL is correct and complete
   - Ensure webhook URL follows the format: `https://discord.com/api/webhooks/{id}/{token}`
   - Check if webhook still exists in Discord channel settings
   - Ensure webhook hasn't been deleted or regenerated
   - The extension validates webhook URL format automatically - check error messages for details

2. **Invalid Webhook URL Format Error**
   - Make sure the webhook URL starts with `https://discord.com/api/webhooks/`
   - Verify the URL contains both webhook ID and token
   - Copy the complete URL from Discord channel settings

3. **Webhook Rate Limiting**
   - Discord webhooks have rate limits
   - Consider implementing delays between messages if sending many

### Bot Issues

1. **Message Not Sending**

   - Verify bot token is correct
   - Check if bot has required permissions
   - Ensure channel/thread ID is correct (must be 17-19 digits)
   - The extension validates channel ID format automatically

2. **Invalid Channel ID Format Error**
   - Channel/Thread IDs must be 17-19 digit numbers
   - Make sure you copied the full ID (not truncated)
   - Enable Developer Mode in Discord to get the correct ID

3. **Embed Not Showing**

   - Verify bot has "Embed Links" permission
   - Check JSON format for fields
   - Ensure URLs are valid for images
   - Verify embed title and description are provided (required fields)

4. **Fields Not Appearing**
   - Verify JSON array format is correct
   - Maximum 25 fields per embed
   - Field name and value are required for each field
   - Invalid fields are automatically filtered out (check console for warnings)

5. **Validation Errors**
   - All required fields are validated before sending
   - Check error messages for specific missing or invalid fields
   - Simple messages require message content
   - Embed messages require title, description, and template

## Validation & Error Handling

The extension includes comprehensive validation to help prevent errors:

- **Webhook URL Validation**: Automatically validates webhook URL format
- **Channel ID Validation**: Ensures channel/thread IDs are in the correct format (17-19 digits)
- **Required Field Validation**: Validates that all required fields are provided based on:
  - Selected integration method (webhook vs bot)
  - Selected message type (simple vs embed)
- **JSON Field Validation**: Validates and filters embed fields JSON format
- **Clear Error Messages**: Provides descriptive error messages to help troubleshoot issues

## Contributing

We welcome contributions! Whether it's bug fixes, new features, documentation improvements, or examples:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Looking for ideas?** Check open issues or suggest new features!

## Related Resources

- [Directus Documentation](https://docs.directus.io/)
- [Directus Flows Guide](https://docs.directus.io/guides/flows/)
- [Discord API Documentation](https://discord.com/developers/docs/intro)
- [Discord Webhooks Guide](https://discord.com/developers/docs/resources/webhook)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/kashyap-thakar/directus-extension-discord-operation/blob/main/LICENSE) file for details.

## Author & Support

**Kashyap Thakar**

- 🌐 GitHub: [@kashyap-thakar](https://github.com/kashyap-thakar)
- 📧 Issues: [Report a Bug](https://github.com/kashyap-thakar/directus-extension-discord-operation/issues)
- ⭐ Star this repo if you find it useful!

---

**Keywords:** Directus extension, Discord integration, Directus flows, Discord webhook, Discord bot, automation, notifications, Directus custom operation, Discord messages, rich embeds
