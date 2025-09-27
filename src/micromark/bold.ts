import { splice } from "micromark-util-chunked";
import type {
  Construct,
  Extension,
  Resolver,
  Tokenizer,
} from "micromark-util-types";

const validPrecedingChars = new Set([
  32, 33, 34, 35, 36, 37, 38, 40, 42, 43, 44, 45, 46, 47, 58, 59, 60, 61, 62,
  63, 91, 94, 123, -3, -4, -5,
]);

const validSucceedingChars = new Set([
  32, 33, 34, 35, 36, 37, 39, 41, 42, 43, 44, 45, 46, 47, 58, 59, 61, 63, 91,
  93, 94, 123, 125, 126, -3, -4, -5,
]);

const resolveSlackBold: Resolver = (events, context) => {
  for (let i = 0; i < events.length; i++) {
    const eventObject = events[i];
    if (!eventObject) continue;

    const [event, token, ctx] = eventObject;

    if (event === "enter" && token.type === "slackBoldMarker" && token._close) {
      let open = i;

      while (open--) {
        const openEventObject = events[open];
        if (!openEventObject) continue;

        const [openEvent, openToken, openCtx] = openEventObject;

        if (
          openEvent === "enter" &&
          openToken.type === "slackBoldMarker" &&
          openToken._open
        ) {
          const boldToken = {
            type: "slackBold",
            start: openToken.start,
            end: token.end,
          };

          const content = context.sliceSerialize({
            start: openToken.end,
            end: token.start,
          });

          if (content.length === 0) {
            // don't allow empty bold
            break;
          }

          if (content.startsWith(" ") && content.endsWith(" ")) {
            // don't allow both leading and trailing space
            break;
          }

          if (content.includes("\n")) {
            // don't allow newlines
            break;
          }

          const nextEvents = [
            // enter slackBold
            ["enter", boldToken, context],
            // only add the content nodes
            ...events.slice(open + 2, i),
            ["exit", boldToken, context],
          ];

          const deleteCount = i - open + 2;
          splice(events, open, deleteCount, nextEvents);

          i = open + nextEvents.length - 1;

          break;
        }
      }
    }
  }

  for (const event of events) {
    if (event && event[1].type === "slackBoldMarker") {
      // womp womp it's not valid
      event[1].type = "data";
    }
  }

  return events;
};

const tokenizeSlackBold: Tokenizer = function (effects, ok, nok) {
  const previous = this.previous; // save the previous char when entering - this will be the char before the first `*`

  const inside = (code: number | null) => {
    const token = effects.exit("slackBoldMarker");
    const canBeOpening = !previous || validPrecedingChars.has(previous);
    const canBeClosing = !code || validSucceedingChars.has(code);

    token._open = canBeOpening;
    token._close = canBeClosing;

    return ok;
  };

  return (code) => {
    effects.enter("slackBoldMarker");
    effects.consume(code);
    return inside;
  };
};

export const slackBoldConstruct = {
  name: "slackBold",
  tokenize: tokenizeSlackBold,
  resolveAll: resolveSlackBold,
} satisfies Construct;
