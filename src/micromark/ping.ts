import { asciiAlphanumeric } from "micromark-util-character";
import type { Code, Construct, State, Tokenizer } from "micromark-util-types";

const tokenize: Tokenizer = function (effects, ok, nok) {
  let hasId = false;

  const start: State = (code) => {
    if (code !== 60 /* < */) {
      return nok(code);
    }

    effects.enter("slackPing");
    effects.enter("slackPingMarker");
    effects.consume(code);
    return atSign;
  };

  const atSign: State = (code) => {
    if (code !== 64 /* @ */) {
      return nok(code);
    }

    effects.consume(code);
    effects.exit("slackPingMarker");
    effects.enter("slackPingId");
    return id;
  };

  const id: State = (code) => {
    if (asciiAlphanumeric(code)) {
      effects.consume(code);
      hasId = true;
      return id;
    }

    if (code === 62 /* > */ && hasId) {
      effects.exit("slackPingId");
      effects.enter("slackPingMarker");
      effects.consume(code);
      effects.exit("slackPingMarker");
      effects.exit("slackPing");
      return ok;
    }

    return nok(code);
  };

  return start;
};

export const slackPingConstruct: Construct = {
  name: "slackPing",
  tokenize,
};
