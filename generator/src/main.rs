mod scripts;
mod config;
mod enums;

use std::sync::{Arc, Mutex};

struct Config {
    pub private_key: String,
    pub user_ip: String,
}

#[derive(Default)]
struct State {
    pub configs: Arc<Mutex<Vec<Config>>>,
    pub counter: u64,
}

const CONFIGS: u64 = 24000;
const THREADS: u64 = 16;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let configs: Arc<Mutex<State>> = Arc::new(Mutex::new(State::default()));

    let mut handles = vec![];
    for _ in 0..THREADS {
        let state = Arc::clone(&configs);

        let handle = std::thread::spawn(move || loop {
            let id;
            {
                let counter = state.lock().unwrap().counter;
                if counter >= CONFIGS {
                    break;
                }
                id = counter;
                state.lock().unwrap().counter += 1;
            }
            let config = Config {
                private_key: format!("private_key_{}", id),
                user_ip: format!("user_ip_{}", id),
            };
            state.lock().unwrap().configs.lock().unwrap().push(config);
        });

        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    let configs = configs.lock().unwrap();
    for config in configs.configs.lock().unwrap().iter() {
        println!(
            "private_key: {}, user_ip: {}",
            config.private_key, config.user_ip
        );
    }

    return Ok(());
}
