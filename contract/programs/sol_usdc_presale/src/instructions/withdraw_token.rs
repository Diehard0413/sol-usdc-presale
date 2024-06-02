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
pub struct WithdrawToken<'info> {
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
        mut,
        seeds = [VAULT_STATE_SEED],
        bump,
        constraint = vault_state.is_initialized == true,
    )]
    pub vault_state: Account<'info, VaultState>,

    #[account(
        address = global_state.quote_token_mint
    )]
    pub token_mint: Box<Account<'info, Mint>>,

    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = presale_state,
    )]
    pub quote_token_account: Box<Account<'info, TokenAccount>>,

    #[account(
        init_if_needed,
        payer = authority,
        associated_token::mint = token_mint,
        associated_token::authority = authority,
    )]
    pub authority_token_account: Box<Account<'info, TokenAccount>>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handle(
    ctx: Context<WithdrawToken>, 
    identifier: u8,
    amount: u64
) -> Result<()> {
    let accts = ctx.accounts;

    require!(accts.presale_state.real_amount >= amount, PresaleError::InsufficentTokenAmount);
    
    accts.presale_state.real_amount -= amount;

    let decimals: u64 = 6;
    let scaled_amount = amount.checked_mul(10u64.pow(decimals as u32)).ok_or(PresaleError::MathOverflow)?;

    let signer_seeds: &[&[&[u8]]] = &[&[&PRESALE_STATE_SEED, &identifier.to_le_bytes(), &[ctx.bumps.presale_state]]];

    let cpi_accounts = Transfer {
        from: accts.quote_token_account.to_account_info(),
        to: accts.authority_token_account.to_account_info(),
        authority: accts.presale_state.to_account_info(),
    };
    let cpi_program = accts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

    token::transfer(cpi_ctx, scaled_amount)?;

    emit!(TokenWithdrawn {
        authority: accts.authority.key(),
        identifier: identifier,
        amount: amount
    });
    Ok(())
}