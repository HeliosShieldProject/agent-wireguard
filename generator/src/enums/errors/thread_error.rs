#[derive(Debug)]
pub enum ThreadError {
    PoisonError,
}

impl std::fmt::Display for ThreadError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            ThreadError::PoisonError => write!(f, "PoisonError"),
        }
    }
}
