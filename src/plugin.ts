import type { Root } from "mdast";
import type { Processor } from "unified";
import { slackTokens } from "./micromark";
import { remarkFromMarkdown } from "./from-markdown";
import { visit } from "unist-util-visit";
import type { SlackPing } from "./global";

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
    },
  });

  return async (tree: Root) => {
    const pings: SlackPing[] = [];
    visit(tree, "slackPing", (node: SlackPing) => {
      pings.push(node);
    });

    if (pings.length > 0) {
      await Promise.all(
        pings.map(async (node) => {
          try {
            const response = await fetch(
              `https://cachet.dunkirk.sh/users/${node.userId}`
            );
            if (response.ok) {
              const data = await response.json();
              node.data = data;
            }
          } catch (error) {
            console.error(
              `Error when fetching data for ${node.userId}:`,
              error
            );
          }
        })
      );
    }

    visit(tree, "text", (node) => {
      if (node.value.includes("  ")) {
        node.value = node.value.replace(/ {2,}/g, (match) => {
          return "\u00A0".repeat(match.length - 1) + " ";
        });
      }
    });
  };
}
