use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod events;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("FdyQCcfJRbCZEnT19MZM5VMPpmnEaGJFb75YLcCWmR6s");
#[program]
pub mod sol_usdc_presale {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>
    ) -> Result<()> {
        initialize::handle(ctx)
    }
    
    pub fn update_auth(
        ctx: Context<UpdateAuth>
    ) -> Result<()> {
        return update_auth::handle(ctx)
    }

    pub fn update_config(
        ctx: Context<UpdateConfig>,
        is_initialized: bool
    ) -> Result<()> {
        update_config::handle(ctx, is_initialized)
    }

    pub fn create_presale(
        ctx: Context<CreatePresale>,
        softcap_amount: u64,
        hardcap_amount: u64,
        max_token_amount_per_address: u64,
        price_per_token: u64,
        start_time: u64,
        end_time: u64
    ) -> Result<()> {
        return create_presale::handle(
            ctx,
            softcap_amount,
            hardcap_amount,
            max_token_amount_per_address,
            price_per_token,
            start_time,
            end_time
        )
    }

    pub fn update_presale(
        ctx: Context<UpdatePresale>,
        identifier: u8,
        softcap_amount: u64,
        hardcap_amount: u64,
        max_token_amount_per_address: u64,
        price_per_token: u64,
        start_time: u64,
        end_time: u64
    ) -> Result<()> {
        return update_presale::handle(
            ctx,
            identifier,
            softcap_amount,
            hardcap_amount,
            max_token_amount_per_address,
            price_per_token,
            start_time,
            end_time
        )
    }

    pub fn deposit_token(
        ctx: Context<DepositToken>,
        identifier: u8,
        amount: u64
    ) -> Result<()> {
        return deposit_token::handle(
            ctx,
            identifier,
            amount
        );
    }

    pub fn buy_token(
        ctx: Context<BuyToken>,
        identifier: u8,
        amount: u64
    ) -> Result<()> {
        return buy_token::handle(
            ctx,
            identifier,
            amount
        );
    }

    pub fn claim_token(
        ctx: Context<ClaimToken>,
        identifier: u8
    ) -> Result<()> {
        return claim_token::handle(
            ctx,
            identifier
        );
    }

    pub fn withdraw_token(
        ctx: Context<WithdrawToken>,
        identifier: u8,
        amount: u64
    ) -> Result<()> {
        return withdraw_token::handle(
            ctx,
            identifier,
            amount
        );
    }

    pub fn rescue_token(
        ctx: Context<RescueToken>,
        identifier: u8,
        amount: u64
    ) -> Result<()> {
        return rescue_token::handle(
            ctx,
            identifier,
            amount
        );
    }
}






