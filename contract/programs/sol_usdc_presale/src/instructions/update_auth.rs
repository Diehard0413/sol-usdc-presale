use anchor_lang::prelude::*;
use crate::{constants::*, events::*, state::*};

#[derive(Accounts)]
pub struct UpdateAuth<'info> {
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

    /// CHECK: this should be checked by owner
    pub new_authority: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handle(
    ctx: Context<UpdateAuth>,
) -> Result<()> {
    let accts = ctx.accounts;
    accts.global_state.authority = accts.new_authority.key();

    emit!(AuthorityUpdated {
        authority: accts.authority.key(),
        new_authority: accts.new_authority.key(),
    });
    Ok(())
}