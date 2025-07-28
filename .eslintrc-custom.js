// Custom ESLint rule to prevent emojis
module.exports = {
  rules: {
    "no-emojis": {
      meta: {
        type: "problem",
        docs: {
          description: "Disallow emojis in code",
        },
        schema: [],
      },
      create(context) {
        // Emoji regex pattern
        const emojiRegex =
          /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;

        return {
          Literal(node) {
            if (typeof node.value === "string" && emojiRegex.test(node.value)) {
              context.report({
                node,
                message:
                  "Emojis are not allowed in code. Use text descriptions instead.",
              });
            }
          },
          TemplateElement(node) {
            if (emojiRegex.test(node.value.raw)) {
              context.report({
                node,
                message:
                  "Emojis are not allowed in code. Use text descriptions instead.",
              });
            }
          },
        };
      },
    },
  },
};
