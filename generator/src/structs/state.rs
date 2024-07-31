use crate::structs::config::Config;
use std::sync::{Arc, Mutex};

pub struct State {
    pub configs: Arc<Mutex<Vec<Config>>>,
    pub counter: u64,
}

impl State {
    pub fn new() -> Arc<Mutex<Self>> {
        Arc::new(Mutex::new(Self {
            configs: Arc::new(Mutex::new(vec![])),
            counter: 0,
        }))
    }
}
