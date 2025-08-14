import { readFile, stat, writeFile } from "fs/promises";
import { join } from "path";

import { asyncExec } from "../utils/asyncExec";
import { getCount } from "../utils/getCount";
import { logHandler } from "../utils/logHandler";
import { range } from "../utils/range";

const parseEmail = (line: string) => line.split(",")[0];

(async () => {
  const status = await stat(join(process.cwd(), "data", "email1.csv")).catch(
    () => null
  );
  if (status) {
    logHandler.log(
      "error",
      "Found existing email lists. Please run:\npnpm run clean"
    );
    return;
  }
  const count = getCount();
  const countRange = range(count);

  logHandler.log("info", "Checking email body.");
  const body = await readFile(
    join(process.cwd(), "data", "emailBody.txt"),
    "utf-8"
  );
  const quote = body
    .split("\n")
    .find(
      (line) =>
        line.startsWith("Quote of the Week: ") ||
        line.startsWith("Joke of the Week:")
    );
  logHandler.log("info", quote);

  logHandler.log("info", "Copying email body to servers.");
  for (const num of countRange) {
    logHandler.log("info", `Copying email body to email${num}...`);
    await asyncExec(
      `scp -l 1000 data/emailBody.txt email${num}:/home/freecodecamp/email-blast/prod/emailBody.txt`
    );
  }
  logHandler.log("info", "Reading emails...");
  const emails = await readFile(
    join(process.cwd(), "data", "emailList.csv"),
    "utf-8"
  );
  // remove the header
  const emailList = emails.trim().split("\n").slice(1);
  const batchSize = Math.floor(emailList.length / count);
  logHandler.log(
    "info",
    `Found ${emailList.length} emails. Splitting into ${count} files of ${batchSize} emails...`
  );
  for (const num of countRange) {
    const emails =
      num === countRange.slice(-1)[0]
        ? emailList
        : emailList.splice(0, batchSize);
    logHandler.log(
      "info",
      `Writing email${num}.csv from ${parseEmail(emails[0])} to ${parseEmail(
        emails[emails.length - 1]
      )} (${emails.length} records)`
    );
    await writeFile(
      join(process.cwd(), "data", `email${num}.csv`),
      "email,unsubscribe\n" + emails.join("\n")
    );
    logHandler.log("info", `Copying email${num}.csv to email${num}...`);
    await asyncExec(
      `scp -l 1000 data/email${num}.csv email${num}:/home/freecodecamp/email-blast/prod/validEmails.csv`
    );
  }
  logHandler.log("info", "Servers are ready to send email.");
  logHandler.log(
    "info",
    "Validate that the email lists look correct manually."
  );
  logHandler.log(
    "info",
    "You will need to connect to the droplet with: ssh email[num]\nReplacing [num] with the number of each server. For you, that would be:"
  );
  logHandler.log("info", countRange.map((count) => `email${count}`).join("\n"));
  logHandler.log(
    "info",
    `Once you have connected to an email droplet, start the process with these commands.\nRUN THESE INDIVIDUALLY AND IN ORDER:\n\nexport OP_SERVICE_ACCOUNT_TOKEN=<token here>\ncd email-blast && screen\npnpm start`
  );
  logHandler.log(
    "info",
    "You can then close your SSH connection. If you want to check on the progress of the blast, you would:\n\nssh email[num]\nscreen -r -d\n\nReplacing [num] with the server number (starts at 1). You should see the progress meters."
  );
  logHandler.log(
    "info",
    "When the blast is complete, return here and run\npnpm emails:teardown."
  );
  logHandler.log(
    "info",
    "For security, we recommend running pnpm scripts:clean IMMEDIATELY after starting the blast on every droplet. You will be reminded to do so when you tearn down the email servers."
  );
})();
