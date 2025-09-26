import type { Extension } from "micromark-util-types";
import { slackBoldConstruct } from "./micromark/bold";

export const slackTokens = {
  text: { 42: slackBoldConstruct },
} satisfies Extension;
