import type { Extension } from "micromark-util-types";
import { slackBoldConstruct } from "./micromark/bold";

export const slackTokens = {
  text: { 42: slackBoldConstruct },
  disable: { null: ["emphasis", "strong"] },
} satisfies Extension;
