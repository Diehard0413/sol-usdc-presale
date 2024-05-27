use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct PresaleState {
    // Identifier for finding the PDA
    pub identifier: u8,
    // Softcap
    pub softcap_amount: u64,
    // Hardcap
    pub hardcap_amount: u64,
    // Total amount of presale tokens available in the presale
    pub deposit_token_amount: u64,
    // Total amount of quote token
    pub real_amount: u64, 
    // Total amount of presale tokens sold during the presale
    pub sold_token_amount: u64,
    // Maximum amount of presale tokens an address can purchase
    pub max_token_amount_per_address: u64,
    // Presale token decimal
    pub decimal: u8,
    // Quote token per presale token
    pub price_per_token: u64,
    // Start time of presale
    pub start_time: u64,
    // End time of presale
    pub end_time: u64,
}