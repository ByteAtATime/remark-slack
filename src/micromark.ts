import type { Construct, Extension } from "micromark-util-types";
import { slackBoldConstruct } from "./micromark/bold";
import { slackLinkConstruct } from "./micromark/link";
import { slackPingConstruct } from "./micromark/ping";

const linkTextConstructs = slackLinkConstruct.text as Record<number, Construct>;

export const slackTokens = {
  text: {
    42: slackBoldConstruct,
    ...linkTextConstructs,
    60: [slackPingConstruct, linkTextConstructs[60]!],
  },
  disable: { null: ["attention"] },
} satisfies Extension;
