# Pre-requisite: .env file should be present in the root directory
export DEBIAN_FRONTEND=noninteractive
apt update -y && apt install -y wireguard postgresql
source .env
ufw allow $WIREGUARD_PORT

# Setup Wireguard
address=$(echo $INTERNAL_SUBNET | awk -F. '{print $1"."$2"."$3".1"}')
wg genkey | tee /etc/wireguard/privatekey | wg pubkey | tee /etc/wireguard/publickey
chmod 600 /etc/wireguard/privatekey
echo "[Interface]
PrivateKey = $(cat /etc/wireguard/privatekey)
Address = $address/24
ListenPort = $WIREGUARD_PORT
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
" > /etc/wireguard/wg0.conf
echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
sysctl -p
systemctl enable wg-quick@wg0.service
systemctl start wg-quick@wg0.service
systemctl status wg-quick@wg0.service

# Download Binary
OWNER="HeliosShieldProject"
REPO="agent-wireguard"
SAVE_PATH="asset.tar.gz"
rm -f "$SAVE_PATH" agent-wireguard
ASSET_URL=$(curl -s -H "Accept: application/vnd.github.v3+json" https://api.github.com/repos/$OWNER/$REPO/releases/latest | grep '"browser_download_url"' | grep 'tar.gz' | head -n 1 | sed -E 's/.*"([^"]+)".*/\1/')
if [ -z "$ASSET_URL" ]; then
  echo "No assets found in the latest release."
  exit 1
fi
curl -L -o "$SAVE_PATH" "$ASSET_URL"
tar -xzf "$SAVE_PATH"
rm -f "$SAVE_PATH"

# Run Binary
chmod +x generator
./generator

# Add configs to database
psql $DATABASE_CONNECTION_STRING -f data.sql