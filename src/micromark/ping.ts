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

const tokenizeChannel: Tokenizer = function (effects, ok, nok) {
  let hasId = false;

  const start: State = (code) => {
    if (code !== 60 /* < */) {
      return nok(code);
    }

    effects.enter("slackChannel");
    effects.enter("slackChannelMarker");
    effects.consume(code);
    return hashSign;
  };

  const hashSign: State = (code) => {
    if (code !== 35 /* # */) {
      return nok(code);
    }

    effects.consume(code);
    effects.exit("slackChannelMarker");
    effects.enter("slackChannelId");
    return id;
  };

  const id: State = (code) => {
    if (asciiAlphanumeric(code)) {
      effects.consume(code);
      hasId = true;
      return id;
    }

    if (code === 124 /* | */ && hasId) {
      effects.exit("slackChannelId");
      effects.enter("slackChannelSeparator");
      effects.consume(code);
      effects.exit("slackChannelSeparator");
      effects.enter("slackChannelName");
      return name;
    }

    if (code === 62 /* > */ && hasId) {
      effects.exit("slackChannelId");
      effects.enter("slackChannelMarker");
      effects.consume(code);
      effects.exit("slackChannelMarker");
      effects.exit("slackChannel");
      return ok;
    }

    return nok(code);
  };

  const name: State = (code) => {
    if (code === 62 /* > */) {
      effects.exit("slackChannelName");
      effects.enter("slackChannelMarker");
      effects.consume(code);
      effects.exit("slackChannelMarker");
      effects.exit("slackChannel");
      return ok;
    }

    if (code === null || code === 10 /* \n */ || code === 13 /* \r */) {
      return nok(code);
    }

    effects.consume(code);
    return name;
  };

  return start;
};

export const slackChannelConstruct: Construct = {
  name: "slackChannel",
  tokenize: tokenizeChannel,
};
