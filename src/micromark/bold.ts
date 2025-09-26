import type { Construct, Extension, Tokenizer } from "micromark-util-types";

const tokenizeSlackBold: Tokenizer = function (effects, ok, nok) {
  let hasLeadingSpace = false;
  let isFirstChar = true;
  let previousCharCode: number | null = null;

  const inside = (code: number | null) => {
    if (code === -5 || code === -4 || code === -3 || code === null) {
      return nok(code);
    }

    if (code === 42) {
      if (hasLeadingSpace && previousCharCode === 32) {
        return nok(code);
      }

      effects.exit("slackBoldText");
      effects.enter("slackBoldMarker");
      effects.consume(code);
      effects.exit("slackBoldMarker");
      effects.exit("slackBold");
      return ok;
    }

    if (isFirstChar && (code === 32 || code === 9)) {
      hasLeadingSpace = true;
    }

    effects.consume(code);
    isFirstChar = false;
    previousCharCode = code;
    return inside;
  };

  const begin = (code: number | null) => inside(code);

  return function start(code) {
    effects.enter("slackBold");
    effects.enter("slackBoldMarker");
    effects.consume(code);
    effects.exit("slackBoldMarker");
    effects.enter("slackBoldText");
    return begin;
  };
};

export const slackBoldConstruct = {
  name: "slackBold",
  tokenize: tokenizeSlackBold,
} satisfies Construct;
