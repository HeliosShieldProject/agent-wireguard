import { config } from "dotenv";
import z from "zod";
config();

const envSchema = z.object({
  DIGITALOCEAN_TOKEN: z.string(),
  SSH_KEY_IDS: z.string(),
  HELIOS_DOMAIN: z.string(),
});
export const ENV = envSchema.parse(process.env);

export const globalOptions = {
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
