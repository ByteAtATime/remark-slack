import type { Construct, Tokenizer, State } from "micromark-util-types";

const tokenizeMultipleSpaces: Tokenizer = function (effects, ok, nok) {
  let length = 0;

  const start: State = (code) => {
    if (code !== 32) {
      return nok(code);
    }

    effects.enter("multipleSpaces");
    length = 0;

    return inside(code);
  };

  const inside: State = (code) => {
    if (code === 32) {
      effects.consume(code);
      length++;
      return inside;
    }

    if (length < 2) {
      return nok(code);
    }

    effects.exit("multipleSpaces");
    return ok(code);
  };

  return start;
};

export const multipleSpacesConstruct: Construct = {
  name: "multipleSpaces",
  tokenize: tokenizeMultipleSpaces,
};
