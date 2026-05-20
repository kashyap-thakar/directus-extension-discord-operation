/**
 * Discord Operation UI Configuration
 * 
 * This file defines the user interface for the Discord operation in Directus flows.
 * It configures form fields, validation rules, and conditional visibility based on
 * user selections (webhook vs bot, simple vs embed messages).
 */

/**
 * Helper function to create conditional visibility rules for embed-only fields
 * @param {boolean} required - Whether the field is required when visible
 * @returns {Array} Array of condition objects for Directus field configuration
 */
const createEmbedConditions = (required = false) => [
  {
    rule: {
      messageType: {
        _eq: "embed",
      },
    },
    hidden: false,
    required,
  },
  {
    rule: {
      messageType: {
        _neq: "embed",
      },
    },
    hidden: true,
    required: false,
  },
];

/**
 * Helper function to create conditional visibility rules for bot-only fields
 * @param {boolean} required - Whether the field is required when visible
 * @returns {Array} Array of condition objects for Directus field configuration
 */
const createBotConditions = (required = false) => [
  {
    rule: {
      integrationMethod: {
        _eq: "bot",
    },
  },
    hidden: false,
    required,
  },
  {
    rule: {
      integrationMethod: {
        _neq: "bot",
      },
    },
    hidden: true,
    required: false,
  },
];

/**
 * Helper function to create conditional visibility rules for simple message fields
 * @param {boolean} required - Whether the field is required when visible
 * @returns {Array} Array of condition objects for Directus field configuration
 */
const createSimpleMessageConditions = (required = false) => [
  {
    rule: {
      messageType: {
        _eq: "simple",
      },
    },
    hidden: false,
    required,
  },
  {
    rule: {
      messageType: {
        _neq: "simple",
    },
  },
    hidden: true,
    required: false,
  },
];

// Discord Operation UI Configuration
export default {
  id: "discord",
  name: "Send Discord Message",
  icon: "chat_bubble",
  description: "Send text or rich embed messages to Discord channels/threads via webhooks or Discord Bot",

  /**
   * Operation overview display in Directus flows
   * Shows a summary of the operation configuration
   */
  overview: ({ integrationMethod, channelId, messageType, message }) => [
    {
      label: "Integration Method",
      text: integrationMethod === "webhook" ? "Webhook" : "Bot",
    },
    {
      label: integrationMethod === "webhook" ? "Webhook URL" : "Channel ID/Thread ID",
      text: channelId || "Not set",
    },
    {
      label: "Message Type",
      text: messageType === "simple" ? "Simple Message" : "Embed Message",
    },
    {
      label: "Content",
      text: messageType === "simple" ? (message || "No message") : "Embed Message",
    },
  ],

  /**
   * Operation configuration options that define the UI form
   * Fields are organized by section: Basic Settings, Embed Options, Authentication
   */
  options: [
    // ============================================
    // BASIC SETTINGS SECTION
    // ============================================

    /**
     * Integration Method Selection
     * Choose between webhook (simpler, no bot setup) or bot (more control, requires bot token)
     */
    {
      field: "integrationMethod",
      name: "Integration Method",
      type: "string",
      meta: {
        width: "full",
        interface: "select-dropdown",
        options: {
          choices: [
            { text: "Discord Webhook", value: "webhook" },
            { text: "Discord Bot", value: "bot" },
          ],
        },
        note: "Webhook: Simple setup, no bot required. Bot: More control, requires bot token.",
      },
      schema: {
        default_value: "webhook",
        is_nullable: false,
      },
    },

    /**
     * Channel ID / Webhook URL
     * For webhooks: Full webhook URL
     * For bot: Discord Channel ID or Thread ID
     */
    {
      field: "channelId",
      name: "Channel ID / Webhook URL",
      type: "string",
      meta: {
        width: "full",
        interface: "input",
        required: true,
        options: {
          placeholder: "Enter Discord Webhook URL or Channel ID",
        },
        note: "For Webhook: Enter the full webhook URL. For Bot: Enter the Channel ID or Thread ID. See README for detailed setup instructions: https://github.com/kashyap-thakar/directus-extension-discord-operation/blob/main/README.md",
      },
      schema: {
        is_nullable: false,
      },
      required: true,
    },

    /**
     * Message Type Selection
     * Choose between simple text message or rich embed message
     */
    {
      field: "messageType",
      name: "Message Type",
      type: "string",
      meta: {
        width: "full",
        interface: "select-dropdown",
        options: {
          choices: [
            { text: "Simple Message", value: "simple" },
            { text: "Embed Message", value: "embed" },
          ],
        },
        note: "Simple: Plain text message. Embed: Rich formatted message with title, description, images, etc.",
      },
      schema: {
        default_value: "simple",
        is_nullable: false,
      },
    },

    /**
     * Simple Message Content
     * Only visible when message type is "simple"
     */
    {
      field: "message",
      name: "Message",
      type: "text",
      meta: {
        width: "full",
        interface: "input-multiline",
        options: {
          placeholder: "Enter your message text",
        },
        conditions: createSimpleMessageConditions(true),
          },
    },

    // ============================================
    // EMBED MESSAGE OPTIONS SECTION
    // ============================================

    /**
     * Embed Template Selection
     * Predefined color schemes and styles for different message types
     */
    {
      field: "embedTemplate",
      name: "Embed Template",
      type: "string",
      meta: {
        width: "full",
        interface: "select-dropdown",
        options: {
          choices: [
            { text: "🟦 Basic Embed", value: "basic" },
            { text: "🟩 Success Notification", value: "success" },
            { text: "🟥 Error Notification", value: "error" },
            { text: "⬜️ Information Update", value: "info" },
          ],
        },
        note: "Choose a template to apply default colors and styling to your embed.",
        conditions: createEmbedConditions(true),
      },
    },

    /**
     * Embed Title
     * Main title displayed at the top of the embed
     */
    {
      field: "embedTitle",
      name: "Embed Title",
      type: "string",
      meta: {
        width: "full",
        interface: "input",
        options: {
          placeholder: "Enter embed title",
        },
        conditions: createEmbedConditions(true),
              },
            },

    /**
     * Embed Description
     * Main content/description text of the embed
     */
    {
      field: "embedDescription",
      name: "Embed Description",
      type: "text",
      meta: {
        width: "full",
        interface: "input-multiline",
        options: {
          placeholder: "Enter embed description",
        },
        conditions: createEmbedConditions(true),
      },
    },

    // Author Section - Optional author information
    {
      field: "embedAuthorName",
      name: "Author Name",
      type: "string",
      meta: {
        width: "full",
        interface: "input",
        options: {
          placeholder: "Enter author name",
        },
        note: "Optional: Display author information at the top of the embed.",
        conditions: createEmbedConditions(),
      },
    },
    {
      field: "embedAuthorIcon",
      name: "Author Icon URL",
      type: "string",
      meta: {
        width: "half",
        interface: "input",
        options: {
          placeholder: "Enter author icon URL",
        },
        conditions: createEmbedConditions(),
      },
    },
    {
      field: "embedAuthorUrl",
      name: "Author URL",
      type: "string",
      meta: {
        width: "half",
        interface: "input",
        options: {
          placeholder: "Enter author URL",
        },
        conditions: createEmbedConditions(),
      },
    },

    // Images Section - Thumbnail and main image
    {
      field: "embedThumbnail",
      name: "Thumbnail URL",
      type: "string",
      meta: {
        width: "half",
        interface: "input",
        options: {
          placeholder: "Enter thumbnail image URL",
        },
        note: "Small image displayed in the top-right corner of the embed.",
        conditions: createEmbedConditions(),
      },
    },
    {
      field: "embedImage",
      name: "Image URL",
      type: "string",
      meta: {
        width: "half",
        interface: "input",
        options: {
          placeholder: "Enter main image URL",
        },
        note: "Large image displayed at the bottom of the embed.",
        conditions: createEmbedConditions(),
      },
    },

    /**
     * Embed Fields (JSON)
     * Custom fields array for structured data display
     * Format: [{"name": "Field Title", "value": "Field Value", "inline": true}]
     */
    {
      field: "embedFields",
      name: "Embed Fields (JSON)",
      type: "text",
      meta: {
        width: "full",
        interface: "input-multiline",
        options: {
          placeholder: '[{"name": "Field Title", "value": "Field Value", "inline": true}]',
        },
        note: "Optional: JSON array of fields to display in the embed. Each field can have 'name', 'value', and 'inline' properties.",
        conditions: createEmbedConditions(),
      },
    },

    // Footer Section - Optional footer text and icon
    {
      field: "embedFooterText",
      name: "Footer Text",
      type: "string",
      meta: {
        width: "half",
        interface: "input",
        options: {
          placeholder: "Enter footer text",
        },
        conditions: createEmbedConditions(),
      },
    },
    {
      field: "embedFooterIcon",
      name: "Footer Icon URL",
      type: "string",
      meta: {
        width: "half",
        interface: "input",
        options: {
          placeholder: "Enter footer icon URL",
        },
        conditions: createEmbedConditions(),
      },
    },

    /**
     * Add Timestamp
     * Include current timestamp in the embed footer
     */
    {
      field: "embedTimestamp",
      name: "Add Timestamp",
      type: "boolean",
      meta: {
        width: "half",
        interface: "boolean",
        options: {
          label: "Include current timestamp",
        },
        note: "Adds the current date and time to the embed footer.",
        conditions: createEmbedConditions(),
          },
    },

    // ============================================
    // AUTHENTICATION SECTION
    // ============================================

    /**
     * Bot Token
     * Discord Bot token for authentication (only required when using bot method)
     * This field is hidden when webhook method is selected
     */
    {
      field: "token",
      name: "Bot Token",
      type: "string",
      meta: {
        width: "full",
        interface: "input",
        special: ["password"],
        options: {
          placeholder: "Enter Discord Bot Token",
        },
        note: "Required for Bot method. Get your bot token from Discord Developer Portal.",
        conditions: createBotConditions(true),
      },
    },
  ],
};
