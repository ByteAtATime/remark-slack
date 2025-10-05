import { h } from "hastscript";
import type { Element } from "hast";
import type { SlackPing, SlackChannel } from "./global";

type PingHandler = (state: any, node: SlackPing) => Element;
type ChannelHandler = (state: any, node: SlackChannel) => Element;

type RehypeSlackOptions = {
  component?: boolean;
  userLink?: (userId: string) => string;
  channelLink?: (channelId: string) => string;
};

const handleSlackPing: PingHandler = (state, node) => {
  const options = state.options as RehypeSlackOptions;

  if (!options.component) {
    const href = options.userLink
      ? options.userLink(node.userId)
      : `#${node.userId}`;

    return h(
      "a",
      { href, className: "slack-ping", "data-user-id": node.userId },
      `@${node.userId}`
    );
  }

  return h("slack-ping", {
    className: "slack-ping slack-ping-interactive",
    "data-user-id": node.userId,
  });
};

const handleSlackChannel: ChannelHandler = (state, node) => {
  const options = state.options as RehypeSlackOptions;

  if (!options.component) {
    const href = options.channelLink
      ? options.channelLink(node.channelId)
      : `#/${node.channelId}`;

    return h(
      "a",
      { href, className: "slack-channel", "data-channel-id": node.channelId },
      `#${node.name || node.channelId}`
    );
  }

  return h("slack-channel", {
    className: "slack-channel slack-channel-interactive",
    "data-channel-id": node.channelId,
    "data-channel-name": node.name,
  });
};

export const rehypeSlack = (options: RehypeSlackOptions = {}) => {
  return {
    handlers: {
      slackPing: handleSlackPing,
      slackChannel: handleSlackChannel,
    },
    ...options,
  };
};
