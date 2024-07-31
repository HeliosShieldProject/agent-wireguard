pub mod thread_error;
pub use thread_error::ThreadError;

use crate::structs::{Config, State};
use std::{
    any::Any,
    sync::{MutexGuard, PoisonError},
};

#[derive(Debug)]
pub enum Error {
    ThreadError(ThreadError),
}

impl From<ThreadError> for Error {
    fn from(error: ThreadError) -> Self {
        Error::ThreadError(error)
    }
}

impl From<PoisonError<MutexGuard<'_, State>>> for Error {
    fn from(_: PoisonError<MutexGuard<'_, State>>) -> Self {
        Error::ThreadError(ThreadError::PoisonError)
    }
}

impl From<PoisonError<MutexGuard<'_, Vec<Config>>>> for Error {
    fn from(_: PoisonError<MutexGuard<'_, Vec<Config>>>) -> Self {
        Error::ThreadError(ThreadError::PoisonError)
    }
}

impl From<Box<dyn Any + Send>> for Error {
    fn from(_: Box<dyn Any + Send>) -> Self {
        Error::ThreadError(ThreadError::PoisonError)
    }
}

impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            Error::ThreadError(error) => write!(f, "{:?}", error),
        }
    }
}