use anchor_lang::prelude::*;
use crate::{constants::*, events::*, state::*};

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
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
        seeds = [VAULT_STATE_SEED],
        bump,
    )]
    pub vault_state: Account<'info, VaultState>,

    pub system_program: Program<'info, System>,
}

pub fn handle(
    ctx: Context<UpdateConfig>,
    is_initialized: bool,
) -> Result<()> {
    let accts = ctx.accounts;
    
    accts.vault_state.is_initialized = is_initialized;

    emit!(ConfigUpdated {
        authority: accts.authority.key(),
        config: is_initialized,
    });
    Ok(())
}