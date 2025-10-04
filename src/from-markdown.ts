import type { PhrasingContent, Text } from "mdast";
import type { Extension } from "mdast-util-from-markdown";
import type { SlackPing } from "./global";

const findFirstText = (node: PhrasingContent): Text | null => {
  if (node.type === "text") {
    return node;
  }

  if ("children" in node && node.children.length > 0) {
    return findFirstText(node.children[0]!);
  }

  return null;
};

const findLastText = (node: PhrasingContent): Text | null => {
  if (node.type === "text") {
    return node;
  }

  if ("children" in node && node.children.length > 0) {
    return findLastText(node.children[node.children.length - 1]!);
  }

  return null;
};

export const remarkFromMarkdown = (): Extension => {
  return {
    enter: {
      slackBold(token) {
        this.enter({ type: "strong", children: [] }, token);
      },
      slackLink(token) {
        this.enter({ type: "link", url: "", children: [] }, token);
      },
      slackLinkUrl(token) {
        this.buffer();
      },
      slackPing(token) {
        this.enter({ type: "slackPing", userId: "" } as SlackPing, token);
      },
      slackPingId(token) {
        this.buffer();
      },
    },
    exit: {
      slackBold(token) {
        const node = this.stack[this.stack.length - 1];
        if (node?.type !== "strong") {
          throw new Error("Expected to be in a strong node");
        }

        const firstTextNode = findFirstText(node);
        if (firstTextNode) {
          firstTextNode.value = firstTextNode.value.trimStart();
        }

        const lastTextNode = findLastText(node);
        if (lastTextNode) {
          lastTextNode.value = lastTextNode.value.trimEnd();
        }

        this.exit(token);
      },
      slackLink(token) {
        const link = this.stack[this.stack.length - 1];
        if (link?.type !== "link") {
          throw new Error("Expected to be in a link node");
        }
        if (link.children.length === 0 && link.url) {
          link.children.push({ type: "text", value: link.url });
        }
        this.exit(token);
      },
      slackLinkUrl(token) {
        const url = this.resume().trim();
        const link = this.stack[this.stack.length - 1];
        if (link?.type !== "link") {
          throw new Error("Expected to be in a link node");
        }

        link.url = url;
      },
      slackPing(token) {
        this.exit(token);
      },
      slackPingId(token) {
        this.resume();
        const id = this.sliceSerialize(token);
        const node = this.stack[this.stack.length - 1] as SlackPing;
        node.userId = id;
      },
    },
  };
};
