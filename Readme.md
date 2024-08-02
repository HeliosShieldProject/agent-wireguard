# Helios | Agent server Auto-Setup CLI Tool

## Project Description

The WireGuard Auto-Setup CLI Tool is a command-line interface designed to automate the setup, configuration, and deployment of WireGuard VPN servers. The tool streamlines the process, allowing users to easily create and manage secure VPN connections without manual configuration.

### Features

- **Interactive Setup:** The CLI uses TypeScript to provide an interactive terminal interface, allowing users to choose desired features and configurations for their WireGuard server.
- **Automated Deployment:** The tool automates the creation and configuration of a new WireGuard server on a cloud provider, including domain setup and environment configuration.
- **Backend in Rust:** The backend is implemented in Rust, ensuring efficient and reliable handling of server setup and peer configuration.
- **Environment Management:** Automatically generates environment configuration files and manages the WireGuard server environment settings.
- **Server Activation:** Handles server activation and domain addition, ensuring the server is ready for secure connections.
- **Error Handling and Logging:** Comprehensive error handling and logging to ensure smooth operations and easy debugging.

### How It Works

1. **Initialize Setup:**

   - The tool prompts the user to select features and configurations using an interactive terminal interface.
   - Users select a country, subnet, port, and number of peers.

2. **Server Creation and Activation:**

   - A new server droplet is created and activated on the cloud provider.
   - The server's IP is retrieved, and a domain is added.

3. **Environment Configuration:**

   - Generates an `.env` file with the selected configuration details.
   - The environment file is securely transferred to the new server.

4. **Server Setup:**

   - Runs setup scripts on the server to configure WireGuard.
   - Waits for the server to be fully configured and ready for use.

5. **Peer Configuration:**

   - The Rust backend handles peer configuration in parallel, ensuring efficient processing.
   - Peers are configured with unique IPs and keys, and the configuration is added to the WireGuard server.

6. **Finalization:**
   - Generates SQL data for database insertion, logging all configurations and server details.
   - Completes the setup process, leaving the server ready for secure connections.

### Technologies Used

- **Frontend:** TypeScript for the interactive CLI interface.
- **Backend:** Rust for efficient and reliable server and peer configuration.
- **Prompts:** `@clack/prompts` for user interaction in the terminal.
- **Cloud Provider Integration:** Automates server creation and management on a cloud provider.
- **File System:** Uses `fs` for file operations and environment configuration.
- **Concurrency:** Utilizes Rust's threading for parallel peer configuration.

## Installation

To install the WireGuard Auto-Setup CLI Tool, follow these steps:

1. Clone the repository to your local machine.

```bash
git clone https://github.com/HeliosShieldProject/agent-wireguard.git
```

2. Navigate to the project directory.

```bash
cd agent-wireguard
```

3. Install the project dependencies.

```bash
pnpm install
```

4. Build generator cargo.

```bash
cd generator
cargo build
```

## Configuration

Before running the CLI tool, you need to configure the following settings:

- HELIOS_DOMAIN - The domain name for the WireGuard server.
- DIGITALOCEAN_TOKEN - The DigitalOcean API token for server creation.
- DATABASE_CONNECTION_STRING - The connection string for the database.

```bash
cp .env.example .env
```

## Usage

To run the WireGuard Auto-Setup CLI Tool, use the following command:

```bash
pnpm tsup
```

The tool will guide you through the setup process, allowing you to configure your WireGuard server and peers.

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE](LICENSE.md) file for details.