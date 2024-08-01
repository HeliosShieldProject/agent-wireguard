use super::Peer;
use std::sync::{Arc, Mutex};

pub struct State {
    pub peers: Arc<Mutex<Vec<Peer>>>,
    pub counter: u64,
}

impl State {
    pub fn new() -> Arc<Mutex<Self>> {
        Arc::new(Mutex::new(Self {
            peers: Arc::new(Mutex::new(vec![])),
            counter: 0,
        }))
    }
}
