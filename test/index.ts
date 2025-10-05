import assert from "node:assert/strict";
import fs from "node:fs/promises";
import process from "node:process";
import test, { describe } from "node:test";
import { remark } from "remark";

describe("remarkGfm", async function (t) {
  await test("should expose the public api", async function () {
    assert.deepEqual(Object.keys(await import("remark-slack")).sort(), [
      "default",
    ]);
  });

  await test("should not throw if not passed options", async function () {
    assert.doesNotThrow(async function () {
      remark()
        .use((await import("remark-slack")).remarkSlack)
        .freeze();
    });
  });
});

describe("fixtures", async function (t) {
  const base = new URL("fixtures/", import.meta.url);
  const dirents = await fs.readdir(base, { withFileTypes: true });
  const folders = dirents.filter((d) => d.isDirectory()).map((d) => d.name);

  let index = -1;

  while (++index < folders.length) {
    const folder = folders[index];

    await test(folder, async function () {
      const folderUrl = new URL(folder + "/", base);
      const inputUrl = new URL("input.md", folderUrl);
      const outputUrl = new URL("output.md", folderUrl);
      const treeUrl = new URL("tree.json", folderUrl);
      const configUrl = new URL("config.json", folderUrl);

      const input = String(await fs.readFile(inputUrl));

      let config;
      let expected;
      let output;

      try {
        config = JSON.parse(String(await fs.readFile(configUrl)));
      } catch {}

      const remarkGfm = (await import("remark-slack")).remarkSlack;
      const processor = remark().use(remarkGfm, config);
      const actual = processor.parse(input);

      try {
        output = String(await fs.readFile(outputUrl));
      } catch {
        output = input;
      }

      try {
        if ("UPDATE" in process.env) {
          throw new Error("Updating…");
        }

        expected = JSON.parse(String(await fs.readFile(treeUrl)));
      } catch {
        expected = actual;

        await fs.writeFile(
          treeUrl,
          JSON.stringify(actual, undefined, 2) + "\n"
        );
      }

      await fs.writeFile(
        new URL("actual.md", folderUrl),
        String(await processor.process(input))
      );

      assert.equal(String(await processor.process(input)), String(output));

      assert.deepEqual(actual, expected);
    });
  }
});
