# remark-slack

![NPM Version](https://img.shields.io/npm/v/remark-slack)

This is a plugin for [Remark](https://github.com/remarkjs/remark) to render Slack's [mrkdwn](https://docs.slack.dev/messaging/formatting-message-text/) format.

## Installation

You can install this package using your favorite package manager!

```
# using pnpm
pnpm add remark-slack

# using bun
bun add remark-slack
```

## Usage

The main functionality of this package is as a Remark plugin. You can use it like so:

```ts
import { remark } from "remark";
import { remarkSlack } from "remark-slack";

const mrkdwn = `
*bold text*
_italic text_
_some *weird* combination ~of formatting~_
User ping: <@U1234567890>

:thumbsup:
:custom_emoji:
`;

const output = await remark().use(remarkSlack).process(mrkdwn);

console.log(String(output));
/*

Output:

**bold text**
*italic text*
*some **weird** combination*
User ping: <@U1234567890>

:thumbsup:
:custom_emoji:

*/
```

Notice how the user ping and emojis don't get serialized - it is parsed as a custom node, which automatically de-serializes when turning it back into Markdown!

### Rehype

If you're using [`remark-rehype`](https://github.com/remarkjs/remark-rehype), you must use the `rehypeSlack` "plugin" to render to HTML. It outputs a configuration to rehype, which you can use as so:

```ts
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { remarkSlack, rehypeSlack } from "remark-slack";

const mrkdwn = `
*bold text*
_italic text_
_some *weird* combination ~of formatting~_
User ping: <@U1234567890>

:thumbsup:
:custom_emoji:
`;

const processor = remark()
  .use(remarkSlack)
  .use(remarkRehype, rehypeSlack())
  .use(rehypeStringify);

const html = await processor.process(mrkdwn);

console.log(String(html));
/*

Output:
<p><strong>bold text</strong>
<em>italic text</em>
<em>some <strong>weird</strong> combination ~of formatting~</em>
User ping: <a href="#U1234567890" class="slack-ping" data-user-id="U1234567890">@U1234567890</a></p>
<p>👍
<img src="https://cachet.dunkirk.sh/emojis/custom_emoji/r" alt=":custom_emoji:" class="slack-emoji" data-emoji-code="custom_emoji"></p>

*/
```

Optionally, you may pass a configuration object with the following keys (all optional):

- `component: boolean` - see [&sect;Components](#components)

The following parameters are functions that, given some type of ID, should return a link. They only apply if `component` is set to false:

- `userLink: (userId: string) => string` - this should usually be in the format of `https://[subdomain].slack.com/team/${userId}` unless you want to link to some other page; by default, it points to a local fragment `#U1234567890`
- `channelLink: (channelId: string) => string` - similar to the above, with links in the format of `https://[subdomain].slack.com/archives/${channelId}`; by default, it points to a local fragment `#C1234567890`
- `emojiUrl: (code: string) => string` - image to display for custom emojis. By default, it links to an instance of [Cachet](https://github.com/taciturnaxolotl/cachet) on the Hack Club workspace

### Components

By default, the rehype plugin outputs custom nodes as reasonable HTML elements. More specifically, user pings and channel links will become anchor tags.

However, if you would prefer to customize their behavior, you can set `component: true` to instead render them as custom HTML elements. This will process:

```
<@U1234567890>
<#C1234567890>
```

Into:

```html
<slack-ping
  class="slack-ping slack-ping-interactive"
  data-user-id="U1234567890"
></slack-ping>
<slack-channel
  class="slack-channel slack-channel-interactive"
  data-channel-id="C1234567890"
></slack-channel>
```

To change the behavior, you can define a custom HTML element:

```ts
class SlackPing extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });

    const link = document.createElement("a");

    const userId = this.getAttribute("data-user-id") ?? "";
    link.innerText = "loading cool data";
    link.href = `https://[subdomain].slack.com/team/${userId}`;

    shadow.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `[your cool styles here]`;
    shadow.appendChild(style);

    // ... cool data processing here ...
  }
}

customElements.define("slack-ping", SlackPing);
```
