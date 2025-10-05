import { remark } from "remark";
import remarkSlack from "../src";
import remarkRehype from "remark-rehype";
import { rehypeSlack } from "../src/rehype";
import rehypeStringify from "rehype-stringify";

const document = `
<@U04FRCW7E4A>
`;

const processor = remark()
  .use(remarkSlack)
  .use(remarkRehype, rehypeSlack({ component: true }))
  .use(rehypeStringify);

const html = await processor.process(document);

console.log(String(html));
