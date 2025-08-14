import { asyncExec } from "../utils/asyncExec";
import { getCount } from "../utils/getCount";
import { logHandler } from "../utils/logHandler";
import { range } from "../utils/range";

(async () => {
  const count = getCount();
  const countRange = range(count);
  for (const num of countRange) {
    logHandler.log("info", `Destroying droplet email-${num}...`);
    await asyncExec(
      `doctl compute droplet delete email-${num} --force --context fcc`
    );
  }
  logHandler.log(
    "info",
    "Droplets destroyed. If you did not do so already, clean your files with:\npnpm scripts:clean"
  );
})();
