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
    "You will need to connect to the droplet with: ssh db-query"
  );
  logHandler.log(
    "info",
    "Once connected, your commands will be:\nexport OP_SERVICE_ACCOUNT_TOKEN=<token here>\ncd scripts/emails && screen\nop run --env-file='./prod.env' --no-masking -- node get-emails.js email.csv"
  );
  logHandler.log(
    "info",
    "Be sure to run those commands INDIVIDUALLY, and in order."
  );
  logHandler.log(
    "info",
    "Once the query is complete, return here and run:\npnpm run db:teardown"
  );
})();
