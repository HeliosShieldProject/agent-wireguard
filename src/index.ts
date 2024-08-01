import { globalOptions } from "@/config";
import {
  addDomain,
  createDroplet,
  fetchDropets,
  getDropletIp,
  waitForActivation,
} from "@/requests";
import {
  cancel,
  group,
  intro,
  outro,
  select,
  spinner,
  text,
} from "@clack/prompts";
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
      peers: () => text(globalOptions.peers),
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

  let chillBeforeFullSetup = await spinner();
  chillBeforeFullSetup.start("Relax and chill before server will be fully setup");
  await new Promise((resolve) => setTimeout(resolve, 5000));
  chillBeforeFullSetup.stop("Server reeady");

  

  outro("Server setup complete");
}

main().catch(console.error);
