import { stat } from "fs/promises";
import { join } from "path";

import { asyncExec } from "../utils/asyncExec";
import { logHandler } from "../utils/logHandler";

const getData = (data: string) => {
  const parsed = JSON.parse(data);
  const id: string = parsed[0].id;
  const ip: string = parsed[0].networks.v4.find(
    (network: Record<string, unknown>) => network.type === "public"
  ).ip_address;
  return { id, ip };
};

(async () => {
  const status = await stat(join(process.cwd(), "data", "emailList.csv")).catch(
    () => null
  );
  if (status) {
    logHandler.log(
      "error",
      "It looks like there is already an email list present. Did you forget to run `pnpm run clean`?"
    );
    return;
  }
  const lines = [
    "=== Droplets Ready ===",
    "",
    "Please update your SSH config (located at ~/.ssh/config) with the following:",
    "",
  ];
  logHandler.log("info", `Generating database query droplet...`);
  const { stdout } = await asyncExec(
    `doctl compute droplet create --enable-monitoring --enable-private-networking --region nyc3 --size s-4vcpu-8gb --image ${process.env.SNAPSHOT_ID} --ssh-keys ${process.env.SSH_KEY_ID} --wait db-query -o json --context fcc`
  );
  const { id, ip } = getData(stdout);
  logHandler.log("info", "Assigning droplet to project.");
  await asyncExec(
    `doctl projects resources assign ${process.env.PROJECT_ID} --resource=do:droplet:${id} --context fcc`
  );
  lines.push(`Host db-query`);
  lines.push(`  HostName ${ip}`);
  lines.push(`  User freecodecamp`);
  lines.push("");
  lines.push(
    "If you already have a db-query host, DO NOT add a second one. Update the IP of the existing one with the new address."
  );
  lines.push(
    "Once you have updated your SSH config, return here and run:\npnpm db:files"
  );
  logHandler.log("info", lines.join("\n"));
})();
