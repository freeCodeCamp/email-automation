import { readFile, writeFile } from "fs/promises";
import { join } from "path";

import { logHandler } from "../utils/logHandler";

(async () => {
  logHandler.log("info", "Loading email log...");
  const logPath = join(process.cwd(), "data", "log.txt");
  const log = await readFile(logPath, "utf-8");
  const lines = log.split("\n");
  const sentEmails = lines
    .filter((line) => line.startsWith("PASSED"))
    .map((line) => line.split(" - ")[1]);
  const set = new Set(sentEmails);
  logHandler.log(
    "info",
    `Found ${set.size} emails sent. Reading email list from data/${process.argv[2]}...`
  );
  const emailsPath = join(process.cwd(), "data", process.argv[2]!);
  const emails = await readFile(emailsPath, "utf-8");
  const emailsArray = emails.split("\n").slice(1);

  const emailsToSend = emailsArray.filter(
    (email) => !set.has(email.split(",")[0])
  );
  logHandler.log("info", `Found ${emailsToSend.length} emails to send.`);

  const emailsToSendPath = join(process.cwd(), "data", "updatedEmails.csv");
  await writeFile(
    emailsToSendPath,
    "email,unsubscribe\n" + emailsToSend.join("\n")
  );
  logHandler.log(
    "info",
    `Updated emails saved to ${emailsToSendPath}. Copy to the appropriate VM and restart the email blast.`
  );
})();
