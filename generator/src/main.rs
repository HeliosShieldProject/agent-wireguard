mod config;
mod enums;
mod scripts;
mod structs;

use enums::errors::Error;
use std::sync::{Arc, Mutex};
use structs::{Config, State};

const CONFIGS: u64 = 24000;
const THREADS: u64 = 16;

fn main() -> Result<(), Error> {
    let configs: Arc<Mutex<State>> = State::new();

    let mut handles = vec![];
    for _ in 0..THREADS {
        let state = Arc::clone(&configs);

        let handle = std::thread::spawn(move || -> Result<(), Error> {
            loop {
                let id;
                {
                    let counter = state.lock()?.counter;
                    if counter >= CONFIGS {
                        break;
                    }
                    id = counter;
                    state.lock()?.counter += 1;
                }
                let config = Config {
                    private_key: format!("private_key_{}", id),
                    user_ip: format!("user_ip_{}", id),
                };
                state.lock()?.configs.lock()?.push(config);
            }
            Ok(())
        });

        handles.push(handle);
    }

    for handle in handles {
        handle.join()?.ok();
    }

    let configs = configs.lock()?;
    for config in configs.configs.lock()?.iter() {
        println!(
            "private_key: {}, user_ip: {}",
            config.private_key, config.user_ip
        );
    }

    Ok(())
}
