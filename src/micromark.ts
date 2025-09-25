import type { Construct, Extension, Tokenizer } from "micromark-util-types";

const slackTokenize: Tokenizer = (effects, ok, nok) => {
  const inside = (code: number | null) => {
    if (code === -5 || code === -4 || code === -3 || code === null) {
      return nok(code);
    }

    if (code === 42) {
      effects.exit("slackBoldText");
      effects.enter("slackBoldMarker");
      effects.consume(code);
      effects.exit("slackBoldMarker");
      effects.exit("slackBold");
      return ok;
    }

    effects.consume(code);
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

const slackConstruct = {
  name: "slackBold",
  tokenize: slackTokenize,
} satisfies Construct;

export const slackTokens = {
  text: { 42: slackConstruct },
  //   disable: { null: ["emphasis", "bold"] },
} satisfies Extension;
