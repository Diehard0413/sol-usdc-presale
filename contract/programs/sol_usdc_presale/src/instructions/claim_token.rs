use {
    anchor_lang::prelude::*,
    anchor_spl::{
        associated_token::{AssociatedToken},
        token::{self, Mint, Token, TokenAccount, Transfer}
    },
};
use crate::{constants::*, errors::*, events::*, state::*};

#[derive(Accounts)]
#[instruction(
    identifier: u8
)]
pub struct ClaimToken<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    pub global_state: Account<'info, GlobalState>,

    #[account(
        mut,
        seeds = [PRESALE_STATE_SEED, &identifier.to_le_bytes()],
        bump,
    )]
    pub presale_state: Box<Account<'info, PresaleState>>,

    #[account(
        mut,
        seeds = [USER_STATE_SEED, user.key().as_ref(), &identifier.to_le_bytes()],
        bump,
    )]
    pub user_state: Box<Account<'info, UserState>>,

    #[account(
        address = global_state.token_mint
    )]
    pub token_mint: Box<Account<'info, Mint>>,

    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = presale_state,
    )]
    pub presale_token_account: Box<Account<'info, TokenAccount>>,
    
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = token_mint,
        associated_token::authority = user,
    )]
    pub user_token_account: Box<Account<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handle(
    ctx: Context<ClaimToken>, 
    identifier: u8
) -> Result<()> {
    let accts = ctx.accounts;
    
    let cur_timestamp = Clock::get()?.unix_timestamp as u64;

    require!(cur_timestamp > accts.presale_state.end_time, PresaleError::PresaleNotEnded);

    // let total_vesting_period = 12 * 30 * 24 * 60 * 60; // 12 months in seconds
    let total_vesting_period = 18 * 5 * 60; // 5 minutes in seconds

    let first_month_vesting = accts.user_state.buy_token_amount * 7 / 100;
    let monthly_vesting = accts.user_state.buy_token_amount * 93 / 100 / 17;

    let mut vested_amount = 0;

    if cur_timestamp >= accts.presale_state.end_time + total_vesting_period {
        vested_amount = accts.user_state.buy_token_amount;
    } else {
        // let months_passed = (cur_timestamp - accts.presale_state.end_time) / (30 * 24 * 60 * 60);
        let months_passed = (cur_timestamp - accts.presale_state.end_time) / (5 * 60);
        if months_passed == 0 {
            vested_amount = first_month_vesting;
        } else {
            vested_amount = first_month_vesting + monthly_vesting * months_passed;
        }
    }

    let claimable_amount = vested_amount - accts.user_state.claim_amount;
    require!(claimable_amount > 0, PresaleError::AlreadyClaimed);

    accts.user_state.claim_amount += claimable_amount;
    accts.user_state.claim_time = cur_timestamp;
    
    let decimals: u64 = 9;
    let scaled_amount = claimable_amount.checked_mul(10u64.pow(decimals as u32)).ok_or(PresaleError::MathOverflow)?;

    let signer_seeds: &[&[&[u8]]] = &[&[&PRESALE_STATE_SEED, &identifier.to_le_bytes(), &[ctx.bumps.presale_state]]];

    let cpi_accounts = Transfer {
        from: accts.presale_token_account.to_account_info(),
        to: accts.user_token_account.to_account_info(),
        authority: accts.presale_state.to_account_info(),
    };
    let cpi_program = accts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

    token::transfer(cpi_ctx, scaled_amount)?;

    emit!(TokenSold {
        authority: accts.user.key(),
        identifier: identifier,
        amount: scaled_amount
    });
    Ok(())
}