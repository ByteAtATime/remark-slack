import type { Construct, Tokenizer, State, Code } from "micromark-util-types";

const tokenizeSlackLink: Tokenizer = function (effects, ok, nok) {
  return start;

  function start(code: Code) {
    if (code !== 60 /* < */) {
      return nok(code);
    }
    effects.enter("slackLink");
    effects.enter("slackLinkMarker");
    effects.consume(code);
    effects.exit("slackLinkMarker");
    effects.enter("slackLinkUrl");
    return url;
  }

  function url(code: Code) {
    if (code === 62 /* > */ || code === 32 /* space */) {
      return nok(code);
    }
    return urlContinue(code);
  }

  function urlContinue(code: Code) {
    // disallow spaces in URL
    if (code === 32 /* space */) {
      return nok(code);
    }
    if (code === 124 /* | */) {
      effects.exit("slackLinkUrl");
      effects.enter("slackLinkSeparator");
      effects.consume(code);
      effects.exit("slackLinkSeparator");
      effects.enter("slackLinkText");
      return text;
    }
    if (code === 62 /* > */) {
      effects.exit("slackLinkUrl");
      effects.enter("slackLinkText");
      effects.exit("slackLinkText");
      effects.enter("slackLinkMarker");
      effects.consume(code);
      effects.exit("slackLinkMarker");
      effects.exit("slackLink");
      return ok;
    }
    // EOF, <, CR, LF
    if (code === null || code === 60 /* < */ || code === 10 || code === 13) {
      return nok(code);
    }
    effects.consume(code);
    return urlContinue;
  }

  function text(code: Code): State | void {
    if (code === 62 /* > */) {
      effects.exit("slackLinkText");
      effects.enter("slackLinkMarker");
      effects.consume(code);
      effects.exit("slackLinkMarker");
      effects.exit("slackLink");
      return ok;
    }
    return textContinue(code);
  }

  function textContinue(code: Code) {
    if (code === 62 /* > */) {
      effects.exit("slackLinkText");
      effects.enter("slackLinkMarker");
      effects.consume(code);
      effects.exit("slackLinkMarker");
      effects.exit("slackLink");
      return ok;
    }
    // EOF, <, |, CR, LF
    if (
      code === null ||
      code === 60 /* < */ ||
      code === 124 /* | */ ||
      code === 10 ||
      code === 13
    ) {
      return nok(code);
    }
    effects.consume(code);
    return textContinue;
  }
};

export const slackLinkConstruct: Construct = {
  name: "slackLink",
  tokenize: tokenizeSlackLink,
};
