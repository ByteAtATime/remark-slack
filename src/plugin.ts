import type { Root } from "mdast";
import type { Processor } from "unified";
import { slackTokens } from "./micromark";
import { remarkFromMarkdown } from "./from-markdown";

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
}
