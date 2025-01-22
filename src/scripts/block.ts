import { MongoClient } from "mongodb";

import { asyncExec } from "../utils/asyncExec";
import { logHandler } from "../utils/logHandler";

(async () => {
  const email = process.argv[2];
  await asyncExec(
    `aws --profile freeCodeCamp sesv2 put-suppressed-destination --reason COMPLAINT --email-address ${email?.toString()}`
  );
  logHandler.info("Added to AWS suppression list.");
  if (!process.env.MONGO_URI) {
    logHandler.error("No mongo url in env!");
    return;
  }
  const mongo = new MongoClient(process.env.MONGO_URI);
  const db = mongo.db("freecodecamp");
  const collection = db.collection("user");
  await collection.findOneAndUpdate(
    {
      email,
    },
    {
      $set: {
        sendQuincyEmail: false,
      },
    }
  );
  logHandler.info("Unsubscribed from newsletter.");
  await mongo.close();
})();
