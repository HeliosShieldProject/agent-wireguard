import { ENV } from "@/config";

export const getDropletIp = async (dropletId: number): Promise<string> => {
  let response = await fetch(
    `https://api.digitalocean.com/v2/droplets/${dropletId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${ENV.DIGITALOCEAN_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    console.log(await response.text());
    throw new Error("Failed to fetch droplet");
  }

  let data = await response.json();
  return data.droplet.networks.v4[0].ip_address;
};
