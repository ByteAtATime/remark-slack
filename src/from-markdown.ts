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
    },
  };
};
