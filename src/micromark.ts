import type {
  Construct,
  Extension,
  State,
  Tokenizer,
} from "micromark-util-types";
import { asciiAlphanumeric } from "micromark-util-character";
import { slackBoldConstruct } from "./micromark/bold";
import { slackLinkConstruct } from "./micromark/link";
import { slackPingConstruct, slackChannelConstruct } from "./micromark/ping";

const tokenizeEmoji: Tokenizer = function (effects, ok, nok) {
  let size = 0;

  const start: State = (code) => {
    if (code !== 58 /* : */) {
      return nok(code);
    }

    effects.enter("slackEmoji");
    effects.enter("slackEmojiMarker");
    effects.consume(code);
    effects.exit("slackEmojiMarker");
    return inside;
  };

  const inside: State = (code) => {
    if (
      code !== null &&
      (asciiAlphanumeric(code) || code === 95 /* _ */ || code === 45) /* - */
    ) {
      effects.enter("slackEmojiCode");
      return consumeCode(code);
    }
    return nok(code);
  };

  const consumeCode: State = (code) => {
    if (
      code !== null &&
      (asciiAlphanumeric(code) || code === 95 /* _ */ || code === 45) /* - */
    ) {
      effects.consume(code);
      size++;
      return consumeCode;
    }

    if (code === 58 /* : */ && size > 0) {
      effects.exit("slackEmojiCode");
      effects.enter("slackEmojiMarker");
      effects.consume(code);
      effects.exit("slackEmojiMarker");
      effects.exit("slackEmoji");
      return ok;
    }

    return nok(code);
  };

  return start;
};

const slackEmojiConstruct: Construct = {
  name: "slackEmoji",
  tokenize: tokenizeEmoji,
};

const linkTextConstructs = slackLinkConstruct.text as Record<number, Construct>;

export const slackTokens = {
  text: {
    42: slackBoldConstruct,
    58: slackEmojiConstruct,
    ...linkTextConstructs,
    60: [slackPingConstruct, slackChannelConstruct, linkTextConstructs[60]!],
  },
  disable: { null: ["attention"] },
} satisfies Extension;
