import { splice } from "micromark-util-chunked";
import type {
  Construct,
  Resolver,
  State,
  Tokenizer,
  Token,
} from "micromark-util-types";

interface SlackEmphasisMarkerToken extends Token {
  _open: boolean;
  _close: boolean;
  marker: number;
}

const validPrecedingChars = new Set([
  32, 33, 34, 35, 36, 37, 38, 40, 42, 43, 44, 45, 46, 47, 58, 59, 60, 61, 62,
  63, 91, 94, 123, -3, -4, -5,
]);

const validSucceedingChars = new Set([
  32, 33, 34, 35, 36, 37, 39, 41, 42, 43, 44, 45, 46, 47, 58, 59, 61, 63, 91,
  93, 94, 123, 125, 126, -3, -4, -5,
]);

const resolveEmphasis: Resolver = (events, context) => {
  for (let i = 0; i < events.length; i++) {
    const eventObject = events[i];
    if (!eventObject) continue;

    const [event, token] = eventObject;

    if (
      event === "enter" &&
      token.type === "slackEmphasisMarker" &&
      (token as SlackEmphasisMarkerToken)._close
    ) {
      let open = i;

      while (open--) {
        const openEventObject = events[open];
        if (!openEventObject) continue;

        const [openEvent, openToken] = openEventObject;

        if (
          openEvent === "enter" &&
          openToken.type === "slackEmphasisMarker" &&
          (openToken as SlackEmphasisMarkerToken)._open &&
          (openToken as SlackEmphasisMarkerToken).marker ===
            (token as SlackEmphasisMarkerToken).marker
        ) {
          let tokenType: string;

          switch ((openToken as SlackEmphasisMarkerToken).marker) {
            case 42:
              tokenType = "slackBold";
              break;
            case 95:
              tokenType = "slackItalic";
              break;
            case 126:
              tokenType = "slackStrikethrough";
              break;
            default:
              continue;
          }

          const emphasisToken = {
            type: tokenType,
            start: openToken.start,
            end: token.end,
          };

          const content = context.sliceSerialize({
            start: openToken.end,
            end: token.start,
          });

          if (content.length === 0) {
            // don't allow empty emphasis
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
          if (
            content.includes(
              String.fromCharCode(
                (openToken as SlackEmphasisMarkerToken).marker
              )
            )
          ) {
            // don't allow markers in content (no nested or adjacent emphasis)
            break;
          }

          const nextEvents = [
            // enter slackEmphasis
            ["enter", emphasisToken, context],
            // only add the content nodes
            ...events.slice(open + 2, i),
            ["exit", emphasisToken, context],
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
    if (event && event[1].type === "slackEmphasisMarker") {
      // womp womp it's not valid
      event[1].type = "data";
    }
  }

  return events;
};

const tokenizeEmphasis: Tokenizer = function (effects, ok, nok) {
  const previous = this.previous;
  let marker: number;

  const inside: State = (code) => {
    if (code === marker) {
      return nok(code);
    }

    const token = effects.exit(
      "slackEmphasisMarker"
    ) as SlackEmphasisMarkerToken;
    const canBeOpening = !previous || validPrecedingChars.has(previous);
    const canBeClosing = !code || validSucceedingChars.has(code);

    token._open = canBeOpening;
    token._close = canBeClosing;
    token.marker = marker;

    return ok;
  };

  return (code) => {
    if (code !== 42 && code !== 95 && code !== 126) {
      return nok(code);
    }

    marker = code;

    if (previous === marker) return nok(code);

    effects.enter("slackEmphasisMarker");
    effects.consume(code);
    return inside;
  };
};

export const slackEmphasisConstruct = {
  name: "slackEmphasis",
  tokenize: tokenizeEmphasis,
  resolveAll: resolveEmphasis,
} satisfies Construct;
