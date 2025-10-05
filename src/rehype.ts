import { h } from "hastscript";
import type { Element } from "hast";
import type { SlackPing } from "./global";

type Handler = (state: any, node: SlackPing) => Element;

type RehypeSlackOptions = {
  component?: boolean;
  userLink?: (userId: string) => string;
};

const handleSlackPing: Handler = (state, node) => {
  const options = state.options as RehypeSlackOptions;
  const userData = node.data;

  if (!options.component) {
    const href = options.userLink
      ? options.userLink(node.userId)
      : `#${node.userId}`;

    return h(
      "a",
      { href, className: "slack-ping", "data-user-id": node.userId },
      `${node.userId}`
    );
  }

  return h("slack-ping", {
    className: "slack-ping slack-ping-interactive",
    "data-user-id": node.userId,
  });
};

export const rehypeSlack = (options: RehypeSlackOptions = {}) => {
  return {
    handlers: {
      slackPing: handleSlackPing,
    },
    ...options,
  };
};
