import type {
  Construct,
  Resolver,
  State,
  Tokenizer,
  Code,
  Event,
  Token,
  Extension,
} from "micromark-util-types";
import { splice } from "micromark-util-chunked";

const tokenizeSlackLinkOpen: Tokenizer = function (effects, ok, nok) {
  return start;

  function start(code: Code) {
    if (code !== 60 /* < */) return nok(code);
    effects.enter("slackLinkMarkerOpen");
    effects.consume(code);
    effects.exit("slackLinkMarkerOpen");
    return ok;
  }
};

const tokenizeSlackLinkClose: Tokenizer = function (effects, ok, nok) {
  return start;

  function start(code: Code) {
    if (code !== 62 /* > */) return nok(code);
    effects.enter("slackLinkMarkerClose");
    effects.consume(code);
    effects.exit("slackLinkMarkerClose");
    return ok;
  }
};

const resolveToSlackLink: Resolver = function (events, context) {
  const closeIndex = events.length - 1;
  const closeToken = events[closeIndex]![1];
  let openIndex = -1;

  for (let i = closeIndex - 1; i >= 0; i--) {
    const token = events[i]![1];
    if (
      events[i]![0] === "enter" &&
      token.type === "slackLinkMarkerOpen" &&
      !token._balanced
    ) {
      openIndex = i;
      break;
    }
  }

  if (openIndex === -1) {
    return events;
  }

  const openToken = events[openIndex]![1];

  const content = context.sliceSerialize({
    start: openToken.end,
    end: closeToken.start,
  });

  if (content.includes("\n") || content.includes("\r")) {
    return events;
  }

  const firstPipe = content.indexOf("|");
  const lastPipe = content.lastIndexOf("|");

  if (firstPipe !== lastPipe) {
    return events;
  }

  openToken._balanced = true;
  (events[closeIndex]![1] as any)._balanced = true;

  let pipeEventIndex = -1;

  for (let i = openIndex + 1; i < closeIndex; i++) {
    const [event, token] = events[i]!;
    if (event === "enter" && token.type === "slackLinkSeparator") {
      pipeEventIndex = i;
      break;
    }
  }

  const contentStartIndex = openIndex + 2;

  const urlEvents = events.slice(
    contentStartIndex,
    pipeEventIndex > -1 ? pipeEventIndex : closeIndex - 1
  );

  const textStartIndex = pipeEventIndex + 2;

  const textEvents =
    pipeEventIndex > -1 ? events.slice(textStartIndex, closeIndex - 1) : [];

  const newEvents: Event[] = [];

  newEvents.push([
    "enter",
    { type: "slackLink", start: openToken.start, end: closeToken.end },
    context,
  ]);

  if (urlEvents.length > 0) {
    newEvents.push([
      "enter",
      {
        type: "slackLinkUrl",
        start: urlEvents[0]![1].start,
        end: urlEvents[urlEvents.length - 1]![1].end,
      },
      context,
    ]);
    newEvents.push(...urlEvents);
    newEvents.push([
      "exit",
      {
        type: "slackLinkUrl",
        start: urlEvents[0]![1].start,
        end: urlEvents[urlEvents.length - 1]![1].end,
      },
      context,
    ]);
  }

  if (textEvents.length > 0) {
    newEvents.push([
      "enter",
      {
        type: "slackLinkText",
        start: textEvents[0]![1].start,
        end: textEvents[textEvents.length - 1]![1].end,
      },
      context,
    ]);
    newEvents.push(...textEvents);
    newEvents.push([
      "exit",
      {
        type: "slackLinkText",
        start: textEvents[0]![1].start,
        end: textEvents[textEvents.length - 1]![1].end,
      },
      context,
    ]);
  }

  newEvents.push([
    "exit",
    { type: "slackLink", start: openToken.start, end: closeToken.end },
    context,
  ]);

  splice(events, openIndex, closeIndex - openIndex + 1, newEvents);

  return events;
};

const resolveAllSlackLink: Resolver = function (events) {
  let i = -1;
  while (++i < events.length) {
    const token = events[i]![1];
    if (
      token.type === "slackLinkMarkerOpen" ||
      token.type === "slackLinkMarkerClose" ||
      token.type === "slackLinkSeparator"
    ) {
      token.type = "data";
    }
  }
  return events;
};

const slackLinkOpen: Construct = {
  tokenize: tokenizeSlackLinkOpen,
};

const slackLinkSeparator: Construct = {
  tokenize: function (effects, ok, nok) {
    return start;

    function start(code: Code) {
      if (code !== 124 /* | */) return nok(code);
      effects.enter("slackLinkSeparator");
      effects.consume(code);
      effects.exit("slackLinkSeparator");
      return ok;
    }
  },
};

const slackLinkClose: Construct = {
  tokenize: tokenizeSlackLinkClose,
  resolveTo: resolveToSlackLink,
  resolveAll: resolveAllSlackLink,
};

export const slackLinkConstruct: Extension = {
  text: {
    60: slackLinkOpen, // <
    124: slackLinkSeparator, // |
    62: slackLinkClose, // >
  },
};
