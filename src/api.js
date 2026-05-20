/**
 * Discord Operation API Handler
 * 
 * This file contains the server-side logic for sending messages to Discord.
 * It supports both webhook and bot methods, and handles both simple text
 * messages and rich embed messages.
 */

/**
 * Predefined embed templates with color schemes and default footers
 * Colors are in decimal format as required by Discord's API
 * Reference: https://discord.com/developers/docs/resources/channel#embed-object-embed-color
 */
const embedTemplates = {
  basic: {
    color: 3447003, // Blue color (#3498DB)
  },
  success: {
    color: 5763719, // Green color (#57F287) - Discord's success green
    footer: {
      text: "Success",
    },
  },
  error: {
    color: 15548997, // Red color (#ED4245) - Discord's error red
    footer: {
      text: "Error",
    },
  },
  info: {
    color: 3426654, // Cyan color (#3498DB) - Discord's info cyan
    footer: {
      text: "Info",
    },
  },
};

/**
 * Validates webhook URL format
 * @param {string} url - The webhook URL to validate
 * @returns {boolean} True if valid, false otherwise
 */
const isValidWebhookUrl = (url) => {
  const webhookPattern = /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[A-Za-z0-9_-]+$/;
  return webhookPattern.test(url);
};

/**
 * Validates Discord channel/thread ID format
 * @param {string} id - The channel/thread ID to validate
 * @returns {boolean} True if valid, false otherwise
 */
const isValidChannelId = (id) => {
  // Discord IDs are 17-19 digit numbers
  const idPattern = /^\d{17,19}$/;
  return idPattern.test(id);
};

/**
 * Builds a Discord embed object from user-provided parameters
 * @param {Object} params - Embed parameters
 * @returns {Object} Discord embed object
 */
const buildEmbed = ({
  embedTemplate,
  embedTitle,
  embedDescription,
  embedAuthorName,
  embedAuthorIcon,
  embedAuthorUrl,
  embedThumbnail,
  embedImage,
  embedFooterText,
  embedFooterIcon,
  embedTimestamp,
  embedFields,
}) => {
  // Get the base template or fallback to basic template
  const template = embedTemplates[embedTemplate] || embedTemplates.basic;

  // Create the embed object with base template and required fields
  const embed = {
    ...template,
    title: embedTitle,
    description: embedDescription,
  };

  // Add optional author information if name is provided
  if (embedAuthorName) {
    embed.author = {
      name: embedAuthorName,
      ...(embedAuthorIcon && { icon_url: embedAuthorIcon }),
      ...(embedAuthorUrl && { url: embedAuthorUrl }),
    };
  }

  // Add optional thumbnail image (small image in top-right corner)
  if (embedThumbnail) {
    embed.thumbnail = { url: embedThumbnail };
  }

  // Add optional main image (large image at bottom)
  if (embedImage) {
    embed.image = { url: embedImage };
  }

  // Add optional footer with text and icon
  // Note: If template has footer, user footer will override it
  if (embedFooterText) {
    embed.footer = {
      text: embedFooterText,
      ...(embedFooterIcon && { icon_url: embedFooterIcon }),
    };
  }

  // Add current timestamp if enabled (ISO 8601 format)
  if (embedTimestamp) {
    embed.timestamp = new Date().toISOString();
  }

  // Parse and add optional fields array from JSON string
  if (embedFields) {
    try {
      const fields = JSON.parse(embedFields);
      if (Array.isArray(fields) && fields.length > 0) {
        // Validate field structure
        const validFields = fields.filter(
          (field) => field && typeof field === "object" && field.name && field.value
        );
        if (validFields.length > 0) {
          embed.fields = validFields;
        }
      }
    } catch (error) {
      // Log warning but don't fail the operation
      console.warn("Failed to parse embedFields JSON:", error.message);
    }
  }

  return embed;
};

/**
 * Validates input parameters based on Discord type and message type
 * @param {Object} params - Operation parameters
 * @throws {Error} If validation fails
 */
const validateParameters = ({
  integrationMethod,
  channelId,
  messageType,
  message,
  embedTitle,
  embedDescription,
  embedTemplate,
  token,
}) => {
  // Validate integration method
  if (!integrationMethod || (integrationMethod !== "webhook" && integrationMethod !== "bot")) {
    throw new Error("integrationMethod must be either 'webhook' or 'bot'");
  }

  // Validate channel ID or webhook URL
  if (!channelId || typeof channelId !== "string" || channelId.trim().length === 0) {
    throw new Error(
      integrationMethod === "webhook"
        ? "Webhook URL is required and cannot be empty"
        : "Channel ID/Thread ID is required and cannot be empty"
    );
  }

  // Validate webhook URL format
  if (integrationMethod === "webhook" && !isValidWebhookUrl(channelId.trim())) {
    throw new Error(
      "Invalid webhook URL format. Expected: https://discord.com/api/webhooks/{id}/{token}"
    );
  }

  // Validate channel ID format for bot method
  if (integrationMethod === "bot" && !isValidChannelId(channelId.trim())) {
    throw new Error(
      "Invalid Channel ID/Thread ID format. Expected a 17-19 digit number."
    );
  }

  // Validate bot token when using bot method
  if (integrationMethod === "bot") {
    if (!token || typeof token !== "string" || token.trim().length === 0) {
      throw new Error("Bot token is required when using Discord Bot method");
    }
  }

  // Validate message type
  if (!messageType || (messageType !== "simple" && messageType !== "embed")) {
    throw new Error("messageType must be either 'simple' or 'embed'");
  }

  // Validate simple message content
  if (messageType === "simple") {
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      throw new Error("Message content is required for simple messages");
    }
  }

  // Validate embed message required fields
  if (messageType === "embed") {
    if (!embedTitle || typeof embedTitle !== "string" || embedTitle.trim().length === 0) {
      throw new Error("Embed title is required for embed messages");
    }
    if (
      !embedDescription ||
      typeof embedDescription !== "string" ||
      embedDescription.trim().length === 0
    ) {
      throw new Error("Embed description is required for embed messages");
    }
    if (!embedTemplate) {
      throw new Error("Embed template is required for embed messages");
    }
  }
};

/**
 * Sends a message to Discord API
 * @param {string} apiUrl - The Discord API endpoint URL
 * @param {Object} headers - HTTP headers for the request
 * @param {Object} payload - The message payload to send
 * @returns {Promise<Object>} Discord API response
 * @throws {Error} If the API request fails
 */
const sendDiscordMessage = async (apiUrl, headers, payload) => {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = `Discord API returned status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(`Discord API Error: ${errorMessage}`);
    }

    return await response.json();
  } catch (error) {
    // Handle network errors or other fetch failures
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Network error: Failed to connect to Discord API");
    }
    throw error;
  }
};

/**
 * Main handler function for processing Discord message operations
 * This is the entry point called by Directus when the operation executes
 */
export default {
  id: "discord",
  handler: async ({
    integrationMethod,
    channelId,
    messageType,
    message,
    embedTemplate,
    embedTitle,
    embedDescription,
    embedAuthorName,
    embedAuthorIcon,
    embedAuthorUrl,
    embedThumbnail,
    embedImage,
    embedFooterText,
    embedFooterIcon,
    embedTimestamp,
    embedFields,
    token,
  }) => {
    try {
      // Validate all input parameters
      validateParameters({
        integrationMethod,
        channelId,
        messageType,
        message,
        embedTitle,
        embedDescription,
        embedTemplate,
        token,
      });

      // Build the message payload based on message type
      let payload;
      if (messageType === "simple") {
        // Simple text message payload
        payload = {
          content: message.trim(),
        };
      } else {
        // Rich embed message payload
        const embed = buildEmbed({
          embedTemplate,
          embedTitle,
          embedDescription,
          embedAuthorName,
          embedAuthorIcon,
          embedAuthorUrl,
          embedThumbnail,
          embedImage,
          embedFooterText,
          embedFooterIcon,
          embedTimestamp,
          embedFields,
        });

        payload = {
          embeds: [embed],
        };
      }

      // Determine the API endpoint and headers based on integration method
      let apiUrl;
      let headers;

      if (integrationMethod === "webhook") {
        // For webhooks, use the webhook URL directly
        // Webhook URL format: https://discord.com/api/webhooks/{webhook_id}/{webhook_token}
        apiUrl = channelId.trim();
        headers = {
          "Content-Type": "application/json",
        };
      } else {
        // For bot, use the channel messages endpoint with bot token
        // API endpoint: https://discord.com/api/v10/channels/{channel_id}/messages
        apiUrl = `https://discord.com/api/v10/channels/${channelId.trim()}/messages`;
        headers = {
          Authorization: `Bot ${token.trim()}`,
          "Content-Type": "application/json",
        };
      }

      // Send the message to Discord's API
      const result = await sendDiscordMessage(apiUrl, headers, payload);

      // Return success response with relevant information
      return {
        status: "success",
        messageId: result.id,
        channelId: result.channel_id || (integrationMethod === "webhook" ? "webhook" : channelId.trim()),
        type: messageType,
        integrationMethod: integrationMethod,
        timestamp: result.timestamp || new Date().toISOString(),
      };
    } catch (error) {
      // Wrap and rethrow any errors with context
      // This ensures all errors are properly formatted for Directus flow error handling
      throw new Error(`Failed to send Discord message: ${error.message}`);
    }
  },
};
