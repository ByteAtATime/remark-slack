import type { PhrasingContent, Text } from "mdast";
import type { Extension } from "mdast-util-from-markdown";

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
      slackLinkText(token) {
        this.enter({ type: "text", value: "" }, token);
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
      slackLinkUrl(token) {
        this.resume();
        const node = this.stack[this.stack.length - 1];
        if (node?.type !== "link") {
          throw new Error("Expected to be in a link node");
        }
        node.url = this.sliceSerialize(token).trim();
      },
      slackLinkText(token) {
        const node = this.stack[this.stack.length - 1];
        if (node?.type !== "text") {
          throw new Error("Expected to be in a text node");
        }
        const link = this.stack[this.stack.length - 2];
        if (link?.type !== "link") {
          throw new Error("Expected to be in a child of a link node");
        }
        const text = this.sliceSerialize(token);
        node.value = text || link.url;

        this.exit(token);
      },
      slackLink(token) {
        const node = this.stack[this.stack.length - 1];
        if (node?.type !== "link") {
          throw new Error("Expected to be in a link node");
        }

        if (
          node.children[0]?.type === "text" &&
          !node.children[0]!.value.trim().length
        ) {
          (node as unknown as Text).type = "text";
          (node as unknown as Text).value = "";
          delete (node as any).url;
          delete (node as any).children;
        }

        this.exit(token);
      },
    },
  };
};
