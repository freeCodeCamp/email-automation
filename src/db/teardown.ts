import { asyncExec } from "../utils/asyncExec";
import { logHandler } from "../utils/logHandler";

(async () => {
  logHandler.log("info", "Fetching email list from server...");
  await asyncExec(
    "scp -l 1000 db-query:/home/freecodecamp/scripts/emails/email.csv data/emailList.csv"
  );
  logHandler.log("info", `Destroying droplet db-query...`);
  await asyncExec(
    `doctl compute droplet delete db-query --force --context fcc`
  );
  logHandler.log(
    "info",
    "Droplet destroyed. When ready to send blast, run:\npnpm emails:setup"
  );
})();
