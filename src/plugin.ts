import type { Root } from "mdast";
import type { Processor } from "unified";
import { slackTokens } from "./micromark";
import { remarkFromMarkdown } from "./from-markdown";
import { visit } from "unist-util-visit";
import type { SlackPing, SlackChannel } from "./global";

export default function remarkSlack() {
  // @ts-expect-error: TS is wrong about `this`.
  const self = this as Processor<Root>;
  const data = self.data();

  const micromarkExtensions =
    data.micromarkExtensions || (data.micromarkExtensions = []);
  const fromMarkdownExtensions =
    data.fromMarkdownExtensions || (data.fromMarkdownExtensions = []);
  const toMarkdownExtensions =
    data.toMarkdownExtensions || (data.toMarkdownExtensions = []);

  micromarkExtensions.push(slackTokens);
  fromMarkdownExtensions.push(remarkFromMarkdown());

  toMarkdownExtensions.push({
    handlers: {
      slackPing(node: SlackPing) {
        return `<@${node.userId}>`;
      },
      slackChannel(node: SlackChannel) {
        if (node.name) {
          return `<#${node.channelId}|${node.name}>`;
        }
        return `<#${node.channelId}>`;
      },
    },
  });

  return async (tree: Root) => {
    visit(tree, "text", (node) => {
      if (node.value.includes("  ")) {
        node.value = node.value.replace(/ {2,}/g, (match) => {
          return "\u00A0".repeat(match.length - 1) + " ";
        });
      }
    });
  };
}
