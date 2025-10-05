import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { remarkSlack, rehypeSlack } from "../src";

const document = `
<@U04FRCW7E4A>

<#C090JKDJYN8|>

\`code\`

:pf:

~strikethrough~
_italic_
`;

const processor = remark()
  .use(remarkSlack)
  .use(remarkRehype, rehypeSlack({ component: true }))
  .use(rehypeStringify);

const html = await processor.process(document);

console.log(String(html));
