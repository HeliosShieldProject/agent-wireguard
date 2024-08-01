import { ENV } from "@/config";

export const fetchDropets = async (): Promise<Array<string>> => {
  let response = await fetch("https://api.digitalocean.com/v2/droplets", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${ENV.DIGITALOCEAN_TOKEN}`,
    },
  });
  if (!response.ok) {
    console.log(await response.text());
    throw new Error("Failed to fetch droplets");
  }
  let data = await response.json();
  return data.droplets
    .filter((droplet: any) => droplet.name.startsWith("agent-wireguard-"))
    .map((droplet: any) => droplet.name.split("-")[2]);
};
