// Predefined embed templates with default values and color schemes
// These templates provide consistent styling for different message types
const embedTemplates = {
  basic: {
    title: "Basic Embed",
    description: "A simple embed message",
    color: 3447003, // Blue color (#3498DB)
  },
  success: {
    title: "Success Notification",
    description: "Operation completed successfully",
    color: 5763719, // Green color (#57F287)
    footer: {
      text: "Success",
    },
  },
  error: {
    title: "Error Notification",
    description: "An error occurred",
    color: 15548997, // Red color (#ED4245)
    footer: {
      text: "Error",
    },
  },
  info: {
    title: "Information Update",
    description: "New information available",
    color: 3426654, // Cyan color (#3498DB)
    footer: {
      text: "Info",
    },
  },
};

// Discord Operation UI Configuration
export default {
  id: "discord",
  name: "Send Discord Message",
  icon: "chat_bubble",
  description: "Send text or rich embed messages to Discord channels/threads",

  // Operation overview display in Directus flows
  overview: ({ channelId, messageType, message, embedData }) => [
    {
      label: "Channel ID/Thread ID",
      text: channelId,
    },
    {
      label: "Type",
      text: messageType,
    },
    {
      label: "Content",
      text: messageType === "simple" ? message : "Embed Message",
    },
  ],

  // Operation configuration options that define the UI form
  options: [
    // Basic Settings Section - Core message configuration
    {
      field: "channelId",
      name: "Channel ID/Thread ID",
      type: "string",
      meta: {
        width: "full",
        interface: "input",
        options: {
          placeholder: "Enter Discord Channel ID/Thread ID",
        },
      },
      required: true,
    },
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
      },
      required: true,
      schema: {
        default_value: "simple",
      },
    },
    {
      field: "message",
      name: "Message",
      type: "text",
      meta: {
        width: "full",
        interface: "input-multiline",
        options: {
          placeholder: "Enter your message",
        },
        // Show/hide based on message type selection
        conditions: [
          {
            rule: {
              messageType: {
                _eq: "simple",
              },
            },
            hidden: false,
            required: true,
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
        ],
      },
    },

    // Embed Template Selection - Predefined styles for different message types
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
        // Only show for embed messages
        conditions: [
          {
            rule: {
              messageType: {
                _eq: "embed",
              },
            },
            hidden: false,
            required: true,
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
        ],
      },
    },

    // Main Embed Content - Title and Description fields
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
        // Only show for embed messages
        conditions: [
          {
            rule: {
              messageType: {
                _eq: "embed",
              },
            },
            hidden: false,
            required: true,
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
        ],
      },
    },
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
        // Only show for embed messages
        conditions: [
          {
            rule: {
              messageType: {
                _eq: "embed",
              },
            },
            hidden: false,
            required: true,
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
        ],
      },
    },

    // Author Section - Optional author information for embeds
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
        // Only show for embed messages
        conditions: [
          {
            rule: {
              messageType: {
                _eq: "embed",
              },
            },
            hidden: false,
          },
          {
            rule: {
              messageType: {
                _neq: "embed",
              },
            },
            hidden: true,
          },
        ],
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
        // Only show for embed messages
        conditions: [
          {
            rule: {
              messageType: {
                _eq: "embed",
              },
            },
            hidden: false,
          },
          {
            rule: {
              messageType: {
                _neq: "embed",
              },
            },
            hidden: true,
          },
        ],
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
        // Only show for embed messages
        conditions: [
          {
            rule: {
              messageType: {
                _eq: "embed",
              },
            },
            hidden: false,
          },
          {
            rule: {
              messageType: {
                _neq: "embed",
              },
            },
            hidden: true,
          },
        ],
      },
    },

    // Images Section - Thumbnail and main image URLs
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
        // Only show for embed messages
        conditions: [
          {
            rule: {
              messageType: {
                _eq: "embed",
              },
            },
            hidden: false,
          },
          {
            rule: {
              messageType: {
                _neq: "embed",
              },
            },
            hidden: true,
          },
        ],
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
        // Only show for embed messages
        conditions: [
          {
            rule: {
              messageType: {
                _eq: "embed",
              },
            },
            hidden: false,
          },
          {
            rule: {
              messageType: {
                _neq: "embed",
              },
            },
            hidden: true,
          },
        ],
      },
    },

    // Fields Section - JSON array of embed fields
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
        // Only show for embed messages
        conditions: [
          {
            rule: {
              messageType: {
                _eq: "embed",
              },
            },
            hidden: false,
          },
          {
            rule: {
              messageType: {
                _neq: "embed",
              },
            },
            hidden: true,
          },
        ],
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
        // Only show for embed messages
        conditions: [
          {
            rule: {
              messageType: {
                _eq: "embed",
              },
            },
            hidden: false,
          },
          {
            rule: {
              messageType: {
                _neq: "embed",
              },
            },
            hidden: true,
          },
        ],
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
        // Only show for embed messages
        conditions: [
          {
            rule: {
              messageType: {
                _eq: "embed",
              },
            },
            hidden: false,
          },
          {
            rule: {
              messageType: {
                _neq: "embed",
              },
            },
            hidden: true,
          },
        ],
      },
    },

    // Timestamp Option - Add current timestamp to embed
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
        // Only show for embed messages
        conditions: [
          {
            rule: {
              messageType: {
                _eq: "embed",
              },
            },
            hidden: false,
          },
          {
            rule: {
              messageType: {
                _neq: "embed",
              },
            },
            hidden: true,
          },
        ],
      },
    },

    // Authentication Section - Discord Bot Token
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
      },
      required: true,
    },
  ],
};
