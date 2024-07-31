// Run `npm start` to start the demo
import {
  intro,
  outro,
  confirm,
  select,
  spinner,
  cancel,
  text,
  group,
} from "@clack/prompts";
import color from "picocolors";
import { globalOptions } from "@/config";
import { createDroplet, fetchDropets, waitForActivation } from "@/requests";

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
  serverCreation.stop("Server activated");

  outro("Server setup complete");
}

main().catch(console.error);
