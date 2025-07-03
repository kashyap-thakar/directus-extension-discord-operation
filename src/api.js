// Predefined embed templates with color schemes and default footers
// Colors are in decimal format as required by Discord's API
const embedTemplates = {
  basic: {
    color: 3447003, // Blue color (#3498DB)
  },
  success: {
    color: 5763719, // Green color (#57F287)
    footer: {
      text: "Success",
    },
  },
  error: {
    color: 15548997, // Red color (#ED4245)
    footer: {
      text: "Error",
    },
  },
  info: {
    color: 3426654, // Cyan color (#3498DB)
    footer: {
      text: "Info",
    },
  },
};

// Discord Operation API handler
export default {
  id: "discord",
  // Main handler function for processing Discord message operations
  handler: async ({
    channelId, // Discord channel/thread ID to send the message to
    messageType, // Type of message: 'simple' or 'embed'
    message, // Content for simple messages
    embedTemplate, // Template to use for embed messages
    embedTitle, // Title for embed messages
    embedDescription, // Description for embed messages
    embedAuthorName, // Author name for embed messages
    embedAuthorIcon, // Author icon URL for embed messages
    embedAuthorUrl, // Author URL for embed messages
    embedThumbnail, // Thumbnail URL for embed messages
    embedImage, // Main image URL for embed messages
    embedFooterText, // Footer text for embed messages
    embedFooterIcon, // Footer icon URL for embed messages
    embedTimestamp, // Whether to include timestamp in embed
    embedFields, // JSON string of fields array for embed
    token, // Discord Bot token for authentication
  }) => {
    try {
      let payload;

      // Handle simple text messages
      if (messageType === "simple") {
        payload = {
          content: message,
        };
      } else {
        // Handle rich embed messages
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

        // Add optional thumbnail image
        if (embedThumbnail) {
          embed.thumbnail = { url: embedThumbnail };
        }

        // Add optional main image
        if (embedImage) {
          embed.image = { url: embedImage };
        }

        // Add optional footer with text and icon
        if (embedFooterText) {
          embed.footer = {
            text: embedFooterText,
            ...(embedFooterIcon && { icon_url: embedFooterIcon }),
          };
        }

        // Add current timestamp if enabled
        if (embedTimestamp) {
          embed.timestamp = new Date().toISOString();
        }

        // Parse and add optional fields array from JSON string
        if (embedFields) {
          try {
            const fields = JSON.parse(embedFields);
            if (Array.isArray(fields)) {
              embed.fields = fields;
            }
          } catch (e) {
            // Skip fields if JSON parsing fails
            console.warn("Failed to parse embedFields JSON:", e.message);
          }
        }

        payload = {
          embeds: [embed],
        };
      }

      // Send the message to Discord's API using v10 endpoint
      const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bot ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Handle API errors with detailed error message
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Discord API Error: ${error.message}`);
      }

      // Parse and return the successful response
      const result = await response.json();
      return {
        status: "success",
        messageId: result.id,
        channelId: result.channel_id,
        type: messageType,
      };
    } catch (error) {
      // Wrap and rethrow any errors with context
      throw new Error(`Failed to send Discord message: ${error.message}`);
    }
  },
};
