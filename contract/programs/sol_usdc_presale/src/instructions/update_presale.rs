use anchor_lang::prelude::*;
use crate::{constants::*, events::*, state::*};

#[derive(Accounts)]
#[instruction(
    identifier: u8,
)]
pub struct UpdatePresale<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [GLOBAL_STATE_SEED, authority.key().as_ref()],
        bump,
        has_one = authority,
        constraint = global_state.is_initialized == true,
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        mut,
        seeds = [PRESALE_STATE_SEED, &identifier.to_le_bytes()],
        bump,
    )]
    pub presale_state: Box<Account<'info, PresaleState>>,

    pub system_program: Program<'info, System>,
}

pub fn handle(
    ctx: Context<UpdatePresale>,
    _identifier: u8,
    softcap_amount: u64,
    hardcap_amount: u64,
    max_token_amount_per_address: u64,
    price_per_token: u64,
    start_time: u64,
    end_time: u64,
) -> Result<()> {
    let accts = ctx.accounts;

    let cur_timestamp = Clock::get()?.unix_timestamp as u64;

    accts.presale_state.softcap_amount = softcap_amount;
    accts.presale_state.hardcap_amount = hardcap_amount;
    accts.presale_state.max_token_amount_per_address = max_token_amount_per_address;
    accts.presale_state.price_per_token = price_per_token;
    accts.presale_state.start_time = start_time;
    accts.presale_state.end_time = end_time;

    emit!(PresaleUpdated {
        identifier: accts.presale_state.identifier,
        timestamp: cur_timestamp
    });
    Ok(())
}