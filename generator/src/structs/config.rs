use std::net::Ipv4Addr;

#[derive(Debug)]
pub struct Config {
    pub private_key: String,
    pub user_ip: Ipv4Addr,
}
