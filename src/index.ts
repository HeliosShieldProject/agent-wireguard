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
import { exec } from "child_process";
import color from "picocolors";


interface State {
  options: {
    value: string;
    label: string;
  }[];
}

const globalOptions = {
  droplets: [
    { value: "lon1", label: "United Kingdom" },
    { value: "nyc3", label: "United States" },
    { value: "fra1", label: "Germany" },
    // { value: "ams3", label: "Netherlands" },
    // { value: "sgp1", label: "Singapore" },
    // { value: "blr1", label: "India" },
    // { value: "tor1", label: "Canada" },
    // { value: "syd1", label: "Australia" },
  ],
  subnet: {
    message: "Provide subnet",
    placeholder: "10.0.0.0",
    defaultValue: "10.0.0.0",
  },
  port: {
    message: "Provide port",
    placeholder: "51820",
    defaultValue: "51820",
  },
  peers: {
    message: "Provide number of peers",
    placeholder: "1023",
    defaultValue: "1023",
  },
};

const run = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else if (stderr) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};

const fetchDropets = async () => {
  let droplets = await run("doctl compute droplet list");
  let names = droplets
    .split("\n")
    .map((line) => {
      return line.split(/\s+/)[1];
    })
    .slice(1, -1)
    .filter((name) => name.startsWith("agent-wireguard"))
    .map((name) => name.replace("agent-wireguard-", ""));
  let options = globalOptions.droplets.filter(
    (option) => !names.includes(option.value)
  );
  return options;
};

async function main() {
  let state: State = { options: [] };

  intro(color.inverse(" CREATE AGENT SERVER "));
  const config = await group(
    {
      setup: async () => {
        let loading = spinner();
        loading.start("Fetching droplets");
        state.options = await fetchDropets();
        loading.stop("Droplets loaded");
      },
      country: async () => {
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

  outro("Server setup complete");
}

main().catch(console.error);
