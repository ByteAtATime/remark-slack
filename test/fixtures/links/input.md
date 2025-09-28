*Basic Links*

Basic manual link: <https://example.com>
Basic manual link with text: <https://example.com|Click Here>
Mailto link: <mailto:bob@example.com>
Mailto link with text: <mailto:bob@example.com|Email Bob>
Mailto link with subject: <mailto:test@example.com?subject=Hello|Email with Subject>
URL with a pipe in the query string (percent-encoded): <https://example.com/search?q=a%7Cb|Search for A or B>
URL with no text after pipe: <https://example.com|>
URL with only spaces as text: <https://example.com|   >
No URL before pipe: <|Just some text>
Empty link: <>
Empty link with pipe: <|>
Link with leading/trailing spaces: <  https://example.com  |  My Link Text  >
Link text containing mrkdwn (bold): <https://example.com|This is *bold* text>
Link text containing mrkdwn (italic): <https://example.com|This is _italic_ text>
Link text containing mrkdwn (strike): <https://example.com|This is ~strikethrough~ text>
Link text containing mrkdwn (code): <https://example.com|See the `code()` function>
Link text containing a pipe character: <https://example.com|This text | contains a pipe>
Link text containing angle brackets: <https://example.com|Text with < and > symbols>
Link with a non-http protocol: <ftp://example.com/resource|FTP Resource>

*Malformed/Invalid Syntax*

Missing closing angle bracket: Here is a link <https://example.com
Missing opening angle bracket: And here is another https://example.com>
Mismatched brackets: <https://example.com|Link}>
Nested angle brackets: <<https://example.com|Inner Link>>
Multiple pipes in link: <https://example.com|Text1|Text2>
Spaces around the pipe: <https://example.com | Link with spaces around pipe>
No protocol in manual link: <example.com|A link>
Just text in angle brackets: <this is not a link>
Angle brackets in the middle of a word: thisis<not>alink

*Interactions with other Mrkdwn*

Link inside a bold block: *Here is a <https://example.com|link>*
Link inside an italic block: _Here is a <https://example.com|link>_
Link inside a strikethrough block: ~Here is a <https://example.com|link>~
Link inside an inline code block: `Here is a <https://example.com|link>`
