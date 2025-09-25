import type { Extension } from "mdast-util-from-markdown";

export const remarkFromMarkdown = (): Extension => {
  return {
    enter: {
      slackBold(token) {
        this.enter({ type: "strong", children: [] }, token);
      },
      slackBoldText(token) {
        this.enter({ type: "text", value: "" }, token);
      },
    },
    exit: {
      slackBold(token) {
        this.exit(token);
      },
      slackBoldText(token) {
        const node = this.stack[this.stack.length - 1];
        if (node?.type === "text") {
          node.value = this.sliceSerialize(token);
        }
        this.exit(token);
      },
    },
  };
};
