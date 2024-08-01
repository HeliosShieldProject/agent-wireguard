use std::net::Ipv4Addr;

#[derive(Debug)]
pub struct Peer {
    pub private_key: String,
    pub public_key: String,
    pub user_ip: Ipv4Addr,
}

impl Peer {
    pub fn new(user: NewPeer, user_ip: Ipv4Addr) -> Self {
        Self {
            private_key: user.private_key,
            public_key: user.public_key,
            user_ip,
        }
    }
}

#[derive(Debug)]
pub struct NewPeer {
    pub private_key: String,
    pub public_key: String,
}
