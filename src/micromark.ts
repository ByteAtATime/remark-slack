import type { Extension } from "micromark-util-types";
import { slackBoldConstruct } from "./micromark/bold";
import { multipleSpacesConstruct } from "./micromark/space";

export const slackTokens = {
  text: { 42: slackBoldConstruct, 32: multipleSpacesConstruct },
} satisfies Extension;
