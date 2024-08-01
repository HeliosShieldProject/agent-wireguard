use crate::enums::data::Country;
use dotenvy::dotenv;
use once_cell::sync::Lazy;
use std::{env, net::Ipv4Addr};

#[derive(Debug, Clone)]
pub struct Config {
    pub peers: u64,
    pub threads: u8,
    pub subnet: Ipv4Addr,
    pub country: Country,
    pub domain: String,
}

pub static ENV: Lazy<Config> = Lazy::new(|| {
    dotenv().ok();
    Config {
        peers: env::var("PEERS")
            .expect("PEERS must be set")
            .parse()
            .expect("PEERS must be a number"),
        threads: env::var("THREADS")
            .expect("THREADS must be set")
            .parse()
            .expect("THREADS must be a number"),
        subnet: env::var("INTERNAL_SUBNET")
            .expect("SUBNET must be set")
            .parse()
            .expect("SUBNET must be a valid IP address"),
        country: env::var("COUNTRY")
            .expect("COUNTRY must be set")
            .parse()
            .expect("COUNTRY must be a valid country"),
        domain: env::var("DOMAIN").expect("DOMAIN must be set"),
    }
});
