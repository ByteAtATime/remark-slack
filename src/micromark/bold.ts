import type { Construct, Extension, Tokenizer } from "micromark-util-types";

const validPrecedingChars = new Set([
  32, 33, 34, 35, 36, 37, 38, 40, 42, 43, 44, 45, 46, 47, 58, 59, 60, 61, 62,
  63, 91, 92, 94, 123, -3, -4, -5,
]);

const validSucceedingChars = new Set([
  32, 33, 34, 35, 36, 37, 39, 41, 42, 43, 44, 45, 46, 47, 58, 59, 61, 63, 91,
  94, 123, 125, 126, -3, -4, -5,
]);

const tokenizeSlackBold: Tokenizer = function (effects, ok, nok) {
  let hasLeadingSpace = false;
  let isFirstChar = true;
  let previousCharCode: number | null = null;
  let isDone = false;

  const inside = (code: number | null) => {
    if (isDone) {
      if (code && !validSucceedingChars.has(code)) {
        return nok(code);
      }
      return ok(code);
    }

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
      isDone = true;
      return inside;
    }

    if (isFirstChar && (code === 32 || code === -4)) {
      hasLeadingSpace = true;
    }

    effects.consume(code);
    isFirstChar = false;
    previousCharCode = code;
    return inside;
  };

  const begin = (code: number | null) => inside(code);

  return (code) => {
    if (this.previous && !validPrecedingChars.has(this.previous)) {
      return nok(code);
    }

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
