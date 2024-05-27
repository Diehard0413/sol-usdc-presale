use {
    anchor_lang::prelude::*;
    anchor_spl::{
        associated_token::{AssociatedToken},
        token::{Mint, Token, TokenAccount}
    },
};
use crate::{constants::*, state::*};

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
    pub presale_info: Box<Account<'info, PresaleInfo>>,

    #[account(
        init_if_needed,
        payer = user,
        space = 8 + size_of::<UserInfo>(),
        seeds = [USER_STATE_SEED, user.key().as_ref(), &identifier.to_le_bytes()],
        bump,
    )]
    pub user_info: Box<Account<'info, UserInfo>>,

    #[account(
        address = global_state.token_mint
    )]
    pub token_mint: Box<Account<'info, Mint>>,

    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = presale_info,
    )]
    pub presale_token_account: Box<Account<'info, TokenAccount>>,
    
    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = user,
    )]
    pub user_token_account: Box<Account<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn buy_token(
    ctx: Context<BuyToken>, 
    amount: u64,
    identifier: u8,
) -> Result<()> {
    let accts = ctx.accounts;

    let cur_timestamp = Clock::get()?.unix_timestamp as u64;

    require!(cur_timestamp >= accts.presale_info.start_time, PresaleError::PresaleNotStarted);
    require!(cur_timestamp <= accts.presale_info.end_time, PresaleError::PresaleEnded);
    
    let token_amount = amount
        .checked_pow(accts.presale_info.decimal as u32)
        .unwrap()
        .checked_mul(10000 as u64)
        .unwrap()
        .checked_div(accts.presale_info.price_per_token)
        .unwrap();
    require!(
        token_amount <= accts.presale_info.deposit_token_amount - accts.presale_info.sold_token_amount, 
        PresaleError::InsufficentTokenAmount
    );
    require!(
        accts.presale_info.max_token_amount_per_address >= accts.user_info.buy_token_amount + token_amount,
        PresaleError::MaxUserLimit
    );

    accts.presale_info.real_amount += amount;
    accts.presale_info.sold_token_amount += token_amount;
    accts.user_info.user = accts.user.key();
    accts.user_info.identifier = identifier;
    accts.user_info.buy_quote_amount += amount;
    accts.user_info.buy_token_amount += token_amount;
    accts.user_info.buy_time = cur_timestamp;

    let cpi_accounts = Transfer {
        from: accts.user_token_account.to_account_info(),
        to: accts.presale_token_account.to_account_info(),
        authority: accts.user.to_account_info(),
    };
    let cpi_program = accts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

    token::transfer(cpi_ctx, amount)?;

    Ok(())
}