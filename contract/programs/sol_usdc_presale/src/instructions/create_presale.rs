use anchor_lang::prelude::*;
use std::mem::size_of;
use crate::{constants::*, state::*};

#[derive(Accounts)]
pub struct CreatePresale<'info> {
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
        init,
        payer = authority,
        space = 8 + size_of::<PresaleInfo>(),
        seeds = [PRESALE_SEED, &global_state.presale_stage.to_le_bytes()],
        bump
    )]
    pub presale_info: Box<Account<'info, PresaleInfo>>,

    pub system_program: Program<'info, System>,
}

pub fn handle(
    ctx: Context<CreatePresale>,
    softcap_amount:u64,
    hardcap_amount:u64,
    max_token_amount_per_address: u64,
    price_per_token: u64,
    start_time: u64,
    end_time: u64,
) -> Result<()> {
    let accts = ctx.accounts;

    accts.presale_info.identifier = accts.global_state.presale_stage;
    accts.presale_info.softcap_amount = softcap_amount;
    accts.presale_info.hardcap_amount = hardcap_amount;
    accts.presale_info.deposit_token_amount = 0;
    accts.presale_info.sold_token_amount = 0;
    accts.presale_info.max_token_amount_per_address = max_token_amount_per_address;
    accts.presale_info.price_per_token = price_per_token;
    accts.presale_info.start_time = start_time;
    accts.presale_info.end_time = end_time;
    accts.global_state.presale_stage += 1;

    Ok(())
}