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

  const displayName = userData?.displayName ?? node.userId;

  if (!options.component) {
    const href = options.userLink
      ? options.userLink(node.userId)
      : `#user-${node.userId}`;

    return h("a", { href, className: "slack-ping" }, `@${displayName}`);
  }

  return h(
    "span",
    {
      className: "slack-ping slack-ping-interactive",
      "data-user-id": node.userId,
      "data-user-name": userData?.displayName,
      "data-user-image": userData?.image,
      "data-user-pronouns": userData?.pronouns,
    },
    `@${displayName}`
  );
};

export const rehypeSlack = (options: RehypeSlackOptions = {}) => {
  return {
    handlers: {
      slackPing: handleSlackPing,
    },
    ...options,
  };
};
