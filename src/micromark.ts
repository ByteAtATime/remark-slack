import type { Extension } from "micromark-util-types";
import { slackBoldConstruct } from "./micromark/bold";
import { slackLinkConstruct } from "./micromark/link";

export const slackTokens = {
  text: { 42: slackBoldConstruct, 60: slackLinkConstruct },
  disable: { null: ["attention"] },
} satisfies Extension;
