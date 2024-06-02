use {
    anchor_lang::prelude::*,
    anchor_spl::{
        associated_token::{AssociatedToken},
        token::{self, Mint, Token, TokenAccount, Transfer}
    },
};
use std::mem::size_of;
use crate::{constants::*, errors::*, events::*, state::*};

#[derive(Accounts)]
#[instruction(
    identifier: u8
)]
pub struct BuyToken<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: this should be checked by owner
    pub authority: AccountInfo<'info>,

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
        payer = user,
        space = 8 + size_of::<UserState>(),
        seeds = [USER_STATE_SEED, user.key().as_ref(), &identifier.to_le_bytes()],
        bump,
    )]
    pub user_state: Box<Account<'info, UserState>>,

    #[account(
        address = global_state.quote_token_mint,
    )]
    pub quote_token_mint: Box<Account<'info, Mint>>,

    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = quote_token_mint,
        associated_token::authority = presale_state,
    )]
    pub quote_token_account: Box<Account<'info, TokenAccount>>,
    
    #[account(
        mut,
        associated_token::mint = quote_token_mint,
        associated_token::authority = user,
    )]
    pub user_token_account: Box<Account<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handle(
    ctx: Context<BuyToken>, 
    identifier: u8,
    amount: u64,
) -> Result<()> {
    let accts = ctx.accounts;

    let cur_timestamp = Clock::get()?.unix_timestamp as u64;

    require!(cur_timestamp >= accts.presale_state.start_time, PresaleError::PresaleNotStarted);
    require!(cur_timestamp <= accts.presale_state.end_time, PresaleError::PresaleEnded);
    
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
    accts.user_state.user = accts.user.key();
    accts.user_state.identifier = identifier;
    accts.user_state.buy_quote_amount += amount;
    accts.user_state.buy_token_amount += token_amount;
    accts.user_state.buy_time = cur_timestamp;

    let cpi_accounts = Transfer {
        from: accts.user_token_account.to_account_info(),
        to: accts.quote_token_account.to_account_info(),
        authority: accts.user.to_account_info(),
    };
    let cpi_program = accts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

    token::transfer(cpi_ctx, amount)?;

    emit!(TokenSold {
        authority: accts.user.key(),
        identifier: identifier,
        amount: amount
    });
    Ok(())
}