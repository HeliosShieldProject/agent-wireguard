import { ENV } from "@/config";

export const createDroplet = async (region: string): Promise<number> => {
  let response = await fetch("https://api.digitalocean.com/v2/droplets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ENV.DIGITALOCEAN_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `agent-wireguard-${region}`,
      region,
      size: "s-1vcpu-1gb-amd",
      image: "docker-20-04",
      ssh_keys: ENV.SSH_KEY_IDS.split(","),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create droplet");
  }

  let data = await response.json();
  return data.droplet.id;
};

export const isActive = async (dropletId: number): Promise<boolean> => {
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
    throw new Error("Failed to fetch droplet");
  }

  let data = await response.json();
  return data.droplet.status === "active";
};

export const waitForActivation = async (dropletId: number): Promise<void> => {
  let active = false;
  while (!active) {
    active = await isActive(dropletId);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};
