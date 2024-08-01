use crate::enums::errors::Error;
use std::{
    io::Write,
    net::Ipv4Addr,
    process::{Command, Stdio},
};

pub fn add_config(ip: &Ipv4Addr) -> Result<String, Error> {
    let private_key_output = Command::new("wg").arg("genkey").output()?;
    let private_key = String::from_utf8(private_key_output.stdout)?;

    let public_key_output = Command::new("wg")
        .arg("pubkey")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .spawn()
        .and_then(|mut child| {
            child
                .stdin
                .as_mut()
                .unwrap()
                .write_all(private_key.as_bytes())?;
            child.wait_with_output()
        })?;
    let public_key = String::from_utf8(public_key_output.stdout)?;

    Command::new("wg")
        .arg("set")
        .arg("wg0")
        .arg("peer")
        .arg(public_key.trim())
        .arg("allowed-ips")
        .arg(format!("{}/32", ip))
        .spawn()?;

    Command::new("ip")
        .arg("-4")
        .arg("route")
        .arg("add")
        .arg(format!("{}/32", ip))
        .arg("dev")
        .arg("wg0")
        .spawn()?;

    Ok(private_key.trim().to_string())
}
