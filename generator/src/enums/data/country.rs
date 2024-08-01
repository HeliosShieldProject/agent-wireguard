use crate::enums::errors::ThreadError;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Country {
    UK,
    USA,
    Germany,
}

impl std::str::FromStr for Country {
    type Err = crate::enums::errors::Error;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "UK" => Ok(Self::UK),
            "USA" => Ok(Self::USA),
            "Germany" => Ok(Self::Germany),
            _ => Err(crate::enums::errors::Error::ThreadError(
                ThreadError::PoisonError,
            )),
        }
    }
}

impl std::fmt::Display for Country {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            Self::UK => write!(f, "UK"),
            Self::USA => write!(f, "USA"),
            Self::Germany => write!(f, "Germany"),
        }
    }
}
