*Basic & Whitespace*

Basic bold text: *bold*
Bold with multiple words: *bold text here*
Bold with leading space inside: * bold*
Bold with trailing space inside: *bold *
Bold with spaces on both ends inside: * bold *
Bold with multiple spaces between words: *bold  text   here*
Bold with newlines inside: *line one
line two*
Bold with only whitespace: * *
Bold with multiple whitespace characters: *   *
Entire message is bold: *Hello world*

*Punctuation & Non-Alphanumeric Characters*

Bold ending with punctuation: *bold!*
Bold starting with punctuation: *!bold*
Bold surrounded by punctuation: (*bold*)
Punctuation surrounded by bold: *(!)*
Bold text is only punctuation: *!!!*
Bold text with Unicode characters: *\u4f60\u597d*
Bold text containing other potential markdown chars: *~_`>*
Bold text with angle brackets: *<not a link>*

*Unmatched & Incomplete*

Unclosed bold at end of string: Here is some *bold
Unclosed bold in middle of string: Here is some *bold text here
Unmatched leading asterisk: A * character
Unmatched trailing asterisk: A character *
Multiple unclosed bolds: *one and *two

*Delimiter Rules (Ambiguity)*

Multiple bolds on one line: *This* is *a* test.
Adjacent bold sections: *bold**adjacent*
Empty bold string: **
Four asterisks: ****
Word with an internal asterisk: un*frigging*believable
Asterisk at the end of a word: word*
Asterisk at the start of a word: *word
Asterisk attached to words: word*bold*word
Asterisk surrounded by spaces: this is * not * bold
Space after opening asterisk: this is * not bold*
Space before closing asterisk: this is *not bold *
Not bold due to surrounding numbers: 5 * 3
Bold containing a single asterisk: *an asterisk: **
Multiple asterisks inside a bold block: *a*b*c*d*
Bold surrounded by extra asterisks: ***text***
Bold surrounded by many extra asterisks: *****text*****
Complex sequence of asterisks: ** one * two ** three * four *
