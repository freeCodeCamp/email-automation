import { unlink } from "fs/promises";
import { join } from "path";

import { getCount } from "../utils/getCount";
import { logHandler } from "../utils/logHandler";
import { range } from "../utils/range";

(async () => {
  logHandler.log("info", "Cleaning files.");
  const count = getCount();
  await unlink(join(process.cwd(), "data", "emailList.csv"));
  for (const num of range(count)) {
    await unlink(join(process.cwd(), "data", `email${num.toString()}.csv`));
  }
  logHandler.log("info", "Files are cleaned. See you next week~!");
})();
