**Basic Links**

Basic manual link: <https://example.com>
Basic manual link with text: [Click Here](https://example.com)
Mailto link: <mailto:bob@example.com>
Mailto link with text: [Email Bob](mailto:bob@example.com)
Mailto link with subject: [Email with Subject](mailto:test@example.com?subject=Hello)
URL with a pipe in the query string (percent-encoded): [Search for A or B](https://example.com/search?q=a%7Cb)
URL with no text after pipe: <https://example.com>
URL with only spaces as text:
No URL before pipe: <|Just some text>
Empty link: <>
Empty link with pipe: <|>
Link with leading/trailing spaces: <  https://example.com  |  My Link Text  >
Link text containing mrkdwn (bold): [This is **bold** text](https://example.com)
Link text containing mrkdwn (italic): [This is _italic_ text](https://example.com)
Link text containing mrkdwn (strike): [This is ~strikethrough~ text](https://example.com)
Link text containing mrkdwn (code): [See the `code()` function](https://example.com)
Link text containing a pipe character: [This text | contains a pipe](https://example.com)
Link text containing angle brackets: <[https://example.com](https://example.com)|Text with < and > symbols>
Link with a non-http protocol: [FTP Resource](ftp://example.com/resource)

**Malformed/Invalid Syntax**

Missing closing angle bracket: Here is a link <https://example.com
Missing opening angle bracket: And here is another https://example.com>
Mismatched brackets: [Link}](https://example.com)
Nested angle brackets: <[Inner Link](https://example.com)\>
Multiple pipes in link: [Text1|Text2](https://example.com)
Spaces around the pipe: [Link with spaces around pipe](https://example.com)
No protocol in manual link: <example.com>
Just text in angle brackets: <this is not a link>
Angle brackets in the middle of a word: thisis<not>alink

**Interactions with other Mrkdwn**

Link inside a bold block: **Here is a** **[link](https://example.com)**
Link inside an italic block: _Here is a_ _[link](https://example.com)_
Link inside a strikethrough block: ~Here is a~ ~[link](https://example.com)~
Link inside an inline code block: `Here is a` `[link](https://example.com)`
