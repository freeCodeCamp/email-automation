import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { assert } from "chai";

suite("Email body", () => {
  test("should have correct first line", async () => {
    const text = await readFile(
      join(process.cwd(), "data", "emailBody.txt"),
      "utf8"
    );
    const lines = text.split(/\n+/g);
    const first = lines[0];
    assert.strictEqual(
      first,
      "Here are this week's five freeCodeCamp resources that are worth your time:"
    );
  });

  test("should have five ordered list items", async () => {
    const text = await readFile(
      join(process.cwd(), "data", "emailBody.txt"),
      "utf8"
    );
    const lines = text.split(/\n+/g);
    const [, first, second, third, fourth, fifth] = lines;
    assert.match(first, /^1\.\s/);
    assert.match(second, /^2\.\s/);
    assert.match(third, /^3\.\s/);
    assert.match(fourth, /^4\.\s/);
    assert.match(fifth, /^5\.\s/);
  });

  test("should have quote of the week", async () => {
    const text = await readFile(
      join(process.cwd(), "data", "emailBody.txt"),
      "utf8"
    );
    const lines = text.split(/\n+/g);
    const quote = lines.find((l) => l.startsWith("Quote of the Week:"));
    assert.exists(quote);
  });

  test("should have correct signature", async () => {
    const text = await readFile(
      join(process.cwd(), "data", "emailBody.txt"),
      "utf8"
    );
    assert.match(
      text,
      /Until next week, happy coding\.\n\n--\sQuincy Larson\n\nTeacher and founder of freeCodeCamp.org/
    );
  });

  test("should have correct last line", async () => {
    const text = await readFile(
      join(process.cwd(), "data", "emailBody.txt"),
      "utf8"
    );
    const lines = text.split(/\n+/g);
    const [last] = lines.reverse();
    assert.strictEqual(
      last,
      "If these aren't worth your time, you can turn them off: https://www.freecodecamp.org/ue/{{unsubscribeId}}"
    );
  });
});
