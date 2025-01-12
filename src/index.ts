import { country, ENV, globalOptions } from "@/config";
import {
  addDomain,
  createDroplet,
  fetchDropets,
  getDropletIp,
  waitForActivation,
} from "@/requests";
import { run } from "@/utils";
import {
  cancel,
  group,
  intro,
  outro,
  select,
  spinner,
  text,
} from "@clack/prompts";
import fs from "fs";
import color from "picocolors";

interface State {
  options: {
    value: string;
    label: string;
  }[];
}

async function main() {
  let state: State = { options: [] };

  intro(color.inverse(" CREATE AGENT SERVER "));
  const config = await group(
    {
      setup: async () => {
        let loading = spinner();
        loading.start("Fetching droplets");
        let activeDroplets = await fetchDropets();
        state.options = globalOptions.droplets.filter(
          (droplet) => !activeDroplets.includes(droplet.value)
        );
        loading.stop("Droplets loaded");
      },
      region: async () => {
        return select({
          message: "Choose a country",
          options: state.options,
          initialValue: state.options[0].value,
        });
      },
      subnet: () => text(globalOptions.subnet),
      port: () => text(globalOptions.port),
      peers: () =>
        text({
          ...globalOptions.peers,
          validate: (value) => {
            if (parseInt(value) > 253) {
              return "Peers cannot exceed 253";
            } else if (parseInt(value) < 1) {
              return "Peers cannot be less than 1";
            }
          },
        }),
    },
    {
      onCancel: ({ results }) => {
        cancel("Operation cancelled.");
        process.exit(0);
      },
    }
  );

  let serverCreation = await spinner();
  serverCreation.start("Creating server");
  const dropletId = await createDroplet(config.region);
  serverCreation.stop("Server created");

  let serverActivation = await spinner();
  serverActivation.start("Activating server");
  await waitForActivation(dropletId);
  serverActivation.stop("Server activated");

  let ipRetrieval = await spinner();
  ipRetrieval.start("Retrieving server IP");
  let ip = await getDropletIp(dropletId);
  ipRetrieval.stop(`Server IP: ${ip}`);

  let domainAddition = await spinner();
  domainAddition.start("Adding domain");
  await addDomain(config.region, ip);
  domainAddition.stop("Domain added");

  let envCreation = await spinner();
  envCreation.start("Creating environment");
  fs.writeFileSync(
    "env",
    `INTERNAL_SUBNET=${config.subnet}
    PEERS=${config.peers}
    WIREGUARD_PORT=${config.port}
    THREADS=16
    COUNTRY=${country[config.region as keyof typeof country]}
    DOMAIN=agent-wireguard-${config.region}.${ENV.HELIOS_DOMAIN}
    DATABASE_CONNECTION_STRING=${ENV.DATABASE_CONNECTION_STRING}`
  );
  envCreation.stop("Environment created");

  let chillBeforeFullSetup = await spinner();
  chillBeforeFullSetup.start(
    "Relax and chill before server will be fully setup"
  );
  await new Promise((resolve) => setTimeout(resolve, 90000));
  chillBeforeFullSetup.stop("Server ready");

  let startServer = await spinner();
  startServer.start("Starting server");
  await run(`scp -o StrictHostKeyChecking=no env root@${ip}:~/.env
scp -o StrictHostKeyChecking=no -r scripts/ root@${ip}:~/scripts/
ssh -o StrictHostKeyChecking=no root@${ip} ". ~/scripts/server_setup.sh"
rm env`);
  startServer.stop("Server started");

  outro("Server setup complete");
}

main().catch(console.error);
