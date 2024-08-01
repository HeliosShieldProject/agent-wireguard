mod config;
mod enums;
mod scripts;
mod structs;

use config::ENV;
use enums::errors::Error;
use scripts::add_config;
use std::{
    fs::File,
    io::Write,
    net::Ipv4Addr,
    sync::{Arc, Mutex},
};
use structs::{Peer, State};

fn main() -> Result<(), Error> {
    let peers: Arc<Mutex<State>> = State::new();

    let mut handles = vec![];
    for _ in 0..ENV.threads {
        let state = Arc::clone(&peers);

        let handle = std::thread::spawn(move || -> Result<(), Error> {
            loop {
                let id;
                {
                    let counter = state.lock()?.counter;
                    if counter >= ENV.peers {
                        break;
                    }
                    id = counter;
                    state.lock()?.counter += 1;
                }
                let ip = Ipv4Addr::from(id as u32 + 1 + u32::from(ENV.subnet));
                let new_peer = add_config(&ip)?;
                let config = Peer::new(new_peer, ip);
                state.lock()?.peers.lock()?.push(config);
            }
            Ok(())
        });

        handles.push(handle);
    }

    for handle in handles {
        handle.join()?.ok();
    }

    peers
        .lock()?
        .peers
        .lock()?
        .sort_by(|a, b| a.user_ip.octets().iter().cmp(b.user_ip.octets().iter()));

    let mut wg0_conf = File::options()
        .append(true)
        .open("/etc/wireguard/wg0.conf")?;

    peers.lock()?.peers.lock()?.iter().for_each(|config| {
        writeln!(
            wg0_conf,
            "[Peer]\nPublicKey = {}\nAllowedIPs = {}/32\n",
            config.public_key, config.user_ip
        )
        .ok();
    });

    let server_public_key = std::fs::read_to_string("/etc/wireguard/publickey")?;

    let mut file = File::create("data.sql")?;
    let mut data = format!(
        r#"
    DO $$
    DECLARE
        server_id UUID;
    BEGIN
        INSERT INTO "server" ("public_key", "wireguard_uri", "country")
        VALUES ('{}', '{}', '{}')
        RETURNING "id" INTO server_id;

        INSERT INTO "config" ("private_key", "user_ip", "server_id")
        VALUES"#,
        server_public_key, ENV.domain, ENV.country
    );

    data.push_str(
        peers
            .lock()?
            .peers
            .lock()?
            .iter()
            .map(|config| {
                format!(
                    r#"('{}', '{}', server_id)"#,
                    config.private_key, config.user_ip
                )
            })
            .collect::<Vec<String>>()
            .join(",\n")
            .as_str(),
    );

    data.push_str(";\nEND$$;");

    file.write_all(data.as_bytes())?;
    Ok(())
}
