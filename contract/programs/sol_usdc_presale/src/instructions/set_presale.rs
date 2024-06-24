use anchor_lang::prelude::*;
use std::mem::size_of;
use crate::{constants::*, errors::*, events::*, state::*};

#[derive(Accounts)]
#[instruction(
    identifier: u8,
    user: Pubkey,
)]
pub struct SetPresale<'info> {
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

    #[account(
        init_if_needed,
        payer = authority,
        space = 8 + size_of::<UserState>(),
        seeds = [USER_STATE_SEED, user.as_ref(), &identifier.to_le_bytes()],
        bump,
    )]
    pub user_state: Box<Account<'info, UserState>>,
    
    pub system_program: Program<'info, System>,
}

pub fn handle(
    ctx: Context<SetPresale>, 
    identifier: u8,
    user: Pubkey,
    amount: u64,
) -> Result<()> {
    let accts = ctx.accounts;

    let cur_timestamp = Clock::get()?.unix_timestamp as u64;
    
    let token_amount = amount
        .checked_mul(10000 as u64)
        .unwrap()
        .checked_div(accts.presale_state.price_per_token)
        .unwrap();
    require!(
        token_amount <= accts.presale_state.deposit_token_amount - accts.presale_state.sold_token_amount, 
        PresaleError::InsufficentTokenAmount
    );
    require!(
        accts.presale_state.max_token_amount_per_address >= accts.user_state.buy_token_amount + token_amount,
        PresaleError::MaxUserLimit
    );

    accts.presale_state.real_amount += amount;
    accts.presale_state.sold_token_amount += token_amount;
    accts.user_state.user = user;
    accts.user_state.identifier = identifier;
    accts.user_state.buy_quote_amount += amount;
    accts.user_state.buy_token_amount += token_amount;
    accts.user_state.buy_time = cur_timestamp;

    emit!(TokenSold {
        authority: user,
        identifier: identifier,
        amount: amount
    });
    Ok(())
}