**Basic & Whitespace**

Basic bold text: **bold**
Bold with multiple words: **bold text here**
Bold with leading space inside: **bold**
Bold with trailing space inside: **bold**
Bold with spaces on both ends inside: \* bold \*
Bold with multiple spaces between words: **bold  text   here**
Bold with newlines inside: \*line one
line two\*
Bold with only whitespace: \* \*
Bold with multiple whitespace characters: \*   \*
Entire message is bold: **Hello world**

**Punctuation & Non-Alphanumeric Characters**

Bold ending with punctuation: **bold!**
Bold starting with punctuation: **!bold**
Bold surrounded by punctuation: (**bold**)
Punctuation surrounded by bold: **(!)**
Bold text is only punctuation: **!!!**
Bold text with Unicode characters: **\u4f60\u597d**
Bold text containing other potential markdown chars: **~\_\`>**
Bold text with angle brackets: **<not a link>**

**Unmatched & Incomplete**

Unclosed bold at end of string: Here is some \*bold
Unclosed bold in middle of string: Here is some \*bold text here
Unmatched leading asterisk: A \* character
Unmatched trailing asterisk: A character \*
Multiple unclosed bolds: \*one and \*two

**Delimiter Rules (Ambiguity)**

Multiple bolds on one line: **This** is **a** test.
Adjacent bold sections: \*bold\*\*adjacent\*
Empty bold string: \*\*
Four asterisks: \*\*\*\*
Word with an internal asterisk: un\*frigging\*believable
Asterisk at the end of a word: word\*
Asterisk at the start of a word: \*word
Asterisk attached to words: word\*bold\*word
Asterisk surrounded by spaces: this is \* not \* bold
Space after opening asterisk: this is **not bold**
Space before closing asterisk: this is **not bold**
Not bold due to surrounding numbers: 5 \* 3
Bold containing a single asterisk: \*an asterisk: \*\*
Multiple asterisks inside a bold block: \*a\*b\*c\*d\*
Bold surrounded by extra asterisks: \*\*\*text\*\*\*
Bold surrounded by many extra asterisks: \*\*\*\*\*text\*\*\*\*\*
Complex sequence of asterisks: \*\* one \* two \*\* three \* four \*

**Spaces (programmatically generated for testing)**

a\*b\*d
a \*b\*d
a\* b\*d
a \* b\*d
a\*b \*d
a \*b \*d
a\* b \*d
a \* b \*d
a\*b\* d
a **b** d
a\* b\* d
a **b** d
a\*b \* d
a **b** d
a\* b \* d
a \* b \* d

**Preceding Chars (generated)**

32:  **bold**
33: !**bold**
34: "**bold**
35: #**bold**
36: $**bold**
37: %**bold**
38: &**bold**
39: '\*not bold\*
40: (**bold**
41: )\*not bold\*
42: \*\*not bold\*
43: +**bold**
44: ,**bold**
45: -**bold**
46: .**bold**
47: /**bold**
48: 0\*bold\*
49: 1\*not bold\*
50: 2\*not bold\*
51: 3\*not bold\*
52: 4\*not bold\*
53: 5\*not bold\*
54: 6\*not bold\*
55: 7\*not bold\*
56: 8\*not bold\*
57: 9\*not bold\*
58: :**bold**
59: ;**bold**
60: <**bold**
61: =**bold**
62: >**bold**
63: ?**bold**
64: @\*not bold\*
65: A\*not bold\*
66: B\*not bold\*
67: C\*not bold\*
68: D\*not bold\*
69: E\*not bold\*
70: F\*not bold\*
71: G\*not bold\*
72: H\*not bold\*
73: I\*not bold\*
74: J\*not bold\*
75: K\*not bold\*
76: L\*not bold\*
77: M\*not bold\*
78: N\*not bold\*
79: O\*not bold\*
80: P\*not bold\*
81: Q\*not bold\*
82: R\*not bold\*
83: S\*not bold\*
84: T\*not bold\*
85: U\*not bold\*
86: V\*not bold\*
87: W\*not bold\*
88: X\*not bold\*
89: Y\*not bold\*
90: Z\*not bold\*
91: \[**bold**
92: \\**bold**
93: ]\*not bold\*
94: ^**bold**
95: \_\*not bold\*
96: \`\*not bold\*
97: a\*not bold\*
98: b\*not bold\*
99: c\*not bold\*
100: d\*not bold\*
101: e\*not bold\*
102: f\*not bold\*
103: g\*not bold\*
104: h\*not bold\*
105: i\*not bold\*
106: j\*not bold\*
107: k\*not bold\*
108: l\*not bold\*
109: m\*not bold\*
110: n\*not bold\*
111: o\*not bold\*
112: p\*not bold\*
113: q\*not bold\*
114: r\*not bold\*
115: s\*not bold\*
116: t\*not bold\*
117: u\*not bold\*
118: v\*not bold\*
119: w\*not bold\*
120: x\*not bold\*
121: y\*not bold\*
122: z\*not bold\*
123: {**bold**
124: |\*not bold\*
125: }\*not bold\*
126: ~\*not bold\*

**Succeeding Chars (generated)**

32: **bold**
33: **bold**!
34: **bold**"
35: **bold**#
36: **bold**$
37: **bold**%
38: \*not bold\*&
39: **bold**'
40: \*not bold\*(
41: **bold**)
42: \*bold\*\*
43: **bold**+
44: **bold**,
45: **bold**\-
46: **bold**.
47: **bold**/
48: \*not bold\*0
49: \*not bold\*1
50: \*not bold\*2
51: \*not bold\*3
52: \*not bold\*4
53: \*not bold\*5
54: \*not bold\*6
55: \*not bold\*7
56: \*not bold\*8
57: \*not bold\*9
58: **bold**:
59: **bold**;
60: \*not bold\*<
61: **bold**\=
62: \*not bold\*>
63: **bold**?
64: \*not bold\*@
65: \*not bold\*A
66: \*not bold\*B
67: \*not bold\*C
68: \*not bold\*D
69: \*not bold\*E
70: \*not bold\*F
71: \*not bold\*G
72: \*not bold\*H
73: \*not bold\*I
74: \*not bold\*J
75: \*not bold\*K
76: \*not bold\*L
77: \*not bold\*M
78: \*not bold\*N
79: \*not bold\*O
80: \*not bold\*P
81: \*not bold\*Q
82: \*not bold\*R
83: \*not bold\*S
84: \*not bold\*T
85: \*not bold\*U
86: \*not bold\*V
87: \*not bold\*W
88: \*not bold\*X
89: \*not bold\*Y
90: \*not bold\*Z
91: **bold**\[
92: \*not bold\*\\
93: **bold**]
94: **bold**^
95: \*not bold\*\_
96: \*not bold\*\`
97: \*not bold\*a
98: \*not bold\*b
99: \*not bold\*c
100: \*not bold\*d
101: \*not bold\*e
102: \*not bold\*f
103: \*not bold\*g
104: \*not bold\*h
105: \*not bold\*i
106: \*not bold\*j
107: \*not bold\*k
108: \*not bold\*l
109: \*not bold\*m
110: \*not bold\*n
111: \*not bold\*o
112: \*not bold\*p
113: \*not bold\*q
114: \*not bold\*r
115: \*not bold\*s
116: \*not bold\*t
117: \*not bold\*u
118: \*not bold\*v
119: \*not bold\*w
120: \*not bold\*x
121: \*not bold\*y
122: \*not bold\*z
123: **bold**{
124: \*not bold\*|
125: **bold**}
126: **bold**~
