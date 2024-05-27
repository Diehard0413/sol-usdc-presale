use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct GlobalState {
    // Admin authority
    pub authority: Pubkey,
    // Mint address of the presale token
    pub token_mint: Pubkey,
    // Mint address of the quote token
    pub quote_token_mint: Pubkey,
    // Presale stage
    pub presale_stage: u8,
    // Prevention of reinitialization attack
    pub is_initialized: bool,
}

#[account]
#[derive(Default)]
pub struct VaultState {
    // Prevention of reinitialization attack
    pub is_initialized: bool,
    // Token treasury
    pub token_vault: Pubkey,
}