use anchor_lang::prelude::*;

#[event]
pub struct Initialized {
    pub authority: Pubkey,
    pub token_mint: Pubkey,
    pub quote_token_mint: Pubkey
}

#[event]
pub struct AuthorityUpdated {
    pub authority: Pubkey,
    pub new_authority: Pubkey
}

#[event]
pub struct ConfigUpdated {
    pub authority: Pubkey,
    pub config: bool
}

#[event]
pub struct PresaleCreated {
    pub identifier: u8,
    pub timestamp: u64
}

#[event]
pub struct PresaleUpdated {
    pub identifier: u8,
    pub timestamp: u64
}

#[event]
pub struct TokenDeposited {
    pub authority: Pubkey,
    pub identifier: u8,
    pub amount: u64
}

#[event]
pub struct TokenSold {
    pub authority: Pubkey,
    pub identifier: u8,
    pub amount: u64
}

#[event]
pub struct TokenClaimed {
    pub authority: Pubkey,
    pub identifier: u8,
    pub amount: u64
}

#[event]
pub struct TokenWithdrawn {
    pub authority: Pubkey,
    pub identifier: u8,
    pub amount: u64
}