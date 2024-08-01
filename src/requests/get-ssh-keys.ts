import { ENV } from "@/config";

export const getSshKeys = async (): Promise<Array<number>> => {
  let response = await fetch("https://api.digitalocean.com/v2/account/keys", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${ENV.DIGITALOCEAN_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch ssh keys");
  }

  let data = await response.json();
  return data.ssh_keys.map((key: any) => key.id);
};
