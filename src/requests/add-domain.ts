import { ENV } from "@/config";

export const addDomain = async (
  region: string,
  dropletIp: string
): Promise<void> => {
  let response = await fetch(
    `https://api.digitalocean.com/v2/domains/${ENV.HELIOS_DOMAIN}/records`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ENV.DIGITALOCEAN_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "A",
        name: `agent-wireguard-${region}`,
        data: dropletIp,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add domain");
  }

  let data = await response.json();
  return data;
};
