import { asyncExec } from "../utils/asyncExec";
import { logHandler } from "../utils/logHandler";

(async () => {
  logHandler.log("info", "Copying mongo.env to db-query");
  await asyncExec(
    `scp -l 1000 data/mongo.env db-query:/home/freecodecamp/scripts/emails/prod.env`
  );

  logHandler.log("info", "Droplet ready to start database query.");
  logHandler.log("info", "Run the database query on db-query.");
  logHandler.log(
    "info",
    "Your commands will be:\nexport OP_SERVICE_ACCOUNT_TOKEN=<token here>\ncd scripts/emails && screen\nop run --env-file='./prod.env' -- node get-emails.js email.csv"
  );
  logHandler.log(
    "info",
    "Once the query is complete, return here and run:\npnpm run db:teardown"
  );
})();
