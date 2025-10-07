import { h } from "hastscript";
import type { Element } from "hast";
import type { SlackPing, SlackChannel, SlackEmoji } from "./global";
import emoji from "./emoji.json";

type PingHandler = (state: any, node: SlackPing) => Element;
type ChannelHandler = (state: any, node: SlackChannel) => Element;
type EmojiHandler = (state: any, node: SlackEmoji) => Element;

type RehypeSlackOptions = {
  component?: boolean;
  userLink?: (userId: string) => string;
  channelLink?: (channelId: string) => string;
  emojiUrl?: (code: string) => string;
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
      : `#${node.channelId}`;

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

const handleSlackEmoji: EmojiHandler = (state, node) => {
  const options = state.options as RehypeSlackOptions;

  const builtinEmoji = emoji[node.code as keyof typeof emoji];

  if (builtinEmoji) {
    return h(null, builtinEmoji);
  }

  const url = options.emojiUrl
    ? options.emojiUrl(node.code)
    : `https://cachet.dunkirk.sh/emojis/${node.code}/r`;

  return h("img", {
    src: url,
    alt: `:${node.code}:`,
    className: "slack-emoji",
    "data-emoji-code": node.code,
  });
};

export const rehypeSlack = (options: RehypeSlackOptions = {}) => {
  return {
    handlers: {
      slackPing: handleSlackPing,
      slackChannel: handleSlackChannel,
      slackEmoji: handleSlackEmoji,
    },
    ...options,
  };
};
