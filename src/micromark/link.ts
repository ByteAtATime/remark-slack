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
  const [, closeToken] = events[closeIndex]!;
  let openIndex = -1;

  for (let i = closeIndex - 1; i >= 0; i--) {
    const [event, token] = events[i]!;
    if (
      event === "enter" &&
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

  const [, openToken] = events[openIndex]!;

  const content = context.sliceSerialize({
    start: openToken.end,
    end: closeToken.start,
  });

  if (content.includes("\n") || content.includes("\r")) {
    return events;
  }

  if (content.indexOf("|") !== content.lastIndexOf("|")) {
    return events;
  }

  const pipeIndex = content.indexOf("|");
  const urlPart = pipeIndex === -1 ? content : content.slice(0, pipeIndex);
  const textPart = pipeIndex === -1 ? "" : content.slice(pipeIndex + 1);

  if (!urlPart.trim() || urlPart.includes(" ")) {
    return events;
  }

  openToken._balanced = true;
  closeToken._balanced = true;

  const newEvents: Event[] = [];

  newEvents.push([
    "enter",
    { type: "slackLink", start: openToken.start, end: closeToken.end },
    context,
  ]);

  newEvents.push(["enter", { ...openToken, type: "slackLinkMarker" }, context]);
  newEvents.push(["exit", { ...openToken, type: "slackLinkMarker" }, context]);

  const urlStartPoint = { ...openToken.end };
  const urlEndPoint = { ...urlStartPoint };
  urlEndPoint.offset += urlPart.length;
  urlEndPoint.column += urlPart.length;

  newEvents.push(
    [
      "enter",
      { type: "slackLinkUrl", start: urlStartPoint, end: urlEndPoint },
      context,
    ],
    [
      "exit",
      { type: "slackLinkUrl", start: urlStartPoint, end: urlEndPoint },
      context,
    ]
  );

  let textStartPoint = urlEndPoint;

  if (pipeIndex !== -1) {
    const separatorStartPoint = { ...urlEndPoint };
    const separatorEndPoint = { ...urlEndPoint };
    separatorEndPoint.offset += 1;
    separatorEndPoint.column += 1;
    const separatorToken: Token = {
      type: "slackLinkSeparator",
      start: separatorStartPoint,
      end: separatorEndPoint,
    };
    newEvents.push(
      ["enter", separatorToken, context],
      ["exit", separatorToken, context]
    );
    textStartPoint = separatorEndPoint;
  }

  const textEndPoint = { ...textStartPoint };
  textEndPoint.offset += textPart.length;
  textEndPoint.column += textPart.length;

  newEvents.push(
    [
      "enter",
      { type: "slackLinkText", start: textStartPoint, end: textEndPoint },
      context,
    ],
    [
      "exit",
      { type: "slackLinkText", start: textStartPoint, end: textEndPoint },
      context,
    ]
  );

  newEvents.push([
    "enter",
    { ...closeToken, type: "slackLinkMarker" },
    context,
  ]);
  newEvents.push(["exit", { ...closeToken, type: "slackLinkMarker" }, context]);

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
      token.type === "slackLinkMarkerClose"
    ) {
      token.type = "data";
    }
  }
  return events;
};

const slackLinkOpen: Construct = {
  tokenize: tokenizeSlackLinkOpen,
};

const slackLinkClose: Construct = {
  tokenize: tokenizeSlackLinkClose,
  resolveTo: resolveToSlackLink,
  resolveAll: resolveAllSlackLink,
};

export const slackLinkConstruct: Extension = {
  text: {
    60: slackLinkOpen,
    62: slackLinkClose,
  },
};
