use {
    anchor_lang::prelude::*,
    anchor_spl::{
        token,
        associated_token,
    },
};

use crate::state::PresaleInfo;
use crate::state::UserInfo;
use crate::constants::{PRESALE_SEED, USER_SEED};
use crate::errors::PresaleError;

pub fn deposit_token(
    ctx: Context<DepositToken>,
    amount: u64,
    identifier: u8,
) -> Result<()> {

    msg!("Depositing presale tokens to presale {}...", identifier);
    msg!("Mint: {}", &ctx.accounts.mint_account.to_account_info().key());   
    msg!("From Token Address: {}", &ctx.accounts.from_associated_token_account.key());     
    msg!("To Token Address: {}", &ctx.accounts.to_associated_token_account.key()); 
    
    let presale_info = &mut ctx.accounts.presale_info;
    let deposit_token_address = ctx.accounts.mint_account.key();
    let user_info = &mut ctx.accounts.user_info;
    let cur_timestamp = u64::try_from(Clock::get()?.unix_timestamp).unwrap();;

    if deposit_token_address == presale_info.token_mint_address {
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.from_associated_token_account.to_account_info(),
                    to: ctx.accounts.to_associated_token_account.to_account_info(),
                    authority: ctx.accounts.payer.to_account_info(),
                },
            ),
            amount,
        )?;
        presale_info.deposit_token_amount = presale_info.deposit_token_amount + amount;
        msg!("Tokens deposited successfully.");

        return Ok(());
    }

    if presale_info.start_time > cur_timestamp {
        msg!("Presale not started yet.");
        return Err(PresaleError::PresaleNotStarted.into());
    }

    if presale_info.end_time < cur_timestamp {
        msg!("Presale already ended.");
        return Err(PresaleError::PresaleEnded.into())
    }

    if deposit_token_address != presale_info.usdt_token_mint_address &&
        deposit_token_address != presale_info.usdc_token_mint_address &&
        deposit_token_address != presale_info.jup_token_mint_address {
            msg!("Not allowed token.");
            return Err(PresaleError::NotAllowedToken.into())
    }

    let mut token_amount = 0;
    if deposit_token_address == presale_info.usdt_token_mint_address ||
            deposit_token_address == presale_info.usdc_token_mint_address {
        token_amount = amount * 200;
    } else {
        let pyth_price_info = &ctx.accounts.pyth_account;
        let pyth_price_data = &pyth_price_info.try_borrow_data()?;
        let pyth_price = pyth_client::cast::<pyth_client::Price>(pyth_price_data);
        let jup_price = pyth_price.agg.price as u64;
        msg!("jupyter token price {}...", jup_price);

        token_amount = amount * (jup_price / (presale_info.price_per_token));
        msg!("buying token amount {}...", token_amount);
        msg!("jupyter token amount {}...", amount);
    }

    if token_amount > presale_info.deposit_token_amount - presale_info.sold_token_amount {
        msg!("Insufficient tokens in presale");
        return Err(PresaleError::InsufficientFund.into())
    }

    if presale_info.max_token_amount_per_address < (user_info.buy_token_amount + token_amount) {
        msg!("Insufficient tokens in presale");
        return Err(PresaleError::InsufficientFund.into())
    }

    // send quote token(SOL) to contract and update the user info
    user_info.buy_time = cur_timestamp;
    user_info.buy_token_amount = user_info.buy_token_amount + token_amount;

    presale_info.sold_token_amount = presale_info.sold_token_amount + token_amount;

    if presale_info.sold_token_amount > presale_info.hardcap_amount {
        msg!("Over hardcap amount!");
        return Err(PresaleError::Overhardcap.into())
    }
    
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.from_associated_token_account.to_account_info(),
                to: ctx.accounts.to_associated_token_account.to_account_info(),
                authority: ctx.accounts.payer.to_account_info(),
            },
        ),
        amount,
    )?;

    if deposit_token_address == presale_info.usdt_token_mint_address {
        presale_info.deposit_usdt_token_amount = presale_info.deposit_usdt_token_amount + amount;
    }
    if deposit_token_address == presale_info.usdc_token_mint_address {
        presale_info.deposit_usdc_token_amount = presale_info.deposit_usdc_token_amount + amount;
    }
    if deposit_token_address == presale_info.jup_token_mint_address {
        presale_info.deposit_jup_token_amount = presale_info.deposit_jup_token_amount + amount;
    }

    msg!("Tokens deposited successfully.");

    Ok(())
}

#[derive(Accounts)]
#[instruction(
    amount: u64,
    identifier: u8,
)]
pub struct DepositToken<'info> {
    #[account(mut)]
    pub mint_account: Account<'info, token::Mint>,
    pub presale_authority: SystemAccount<'info>,
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = mint_account,
        associated_token::authority = payer,
    )]
    pub from_associated_token_account: Account<'info, token::TokenAccount>,
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = mint_account,
        associated_token::authority = presale_info,
    )]
    pub to_associated_token_account: Account<'info, token::TokenAccount>,
    #[account(
        mut,
        seeds = [PRESALE_SEED, presale_authority.key().as_ref(), [identifier].as_ref()],
        bump = presale_info.bump
    )]
    pub presale_info: Box<Account<'info, PresaleInfo>>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
    #[account(
        init_if_needed,
        payer = payer,
        space = 8 + std::mem::size_of::<UserInfo>(),
        seeds = [USER_SEED, presale_authority.key().as_ref(), payer.key().as_ref(), [identifier].as_ref()],
        bump
    )]
    pub user_info: Box<Account<'info, UserInfo>>,
    /// CHECK: This is not dangerous because this is provided from pyth network team.
    pub pyth_account: AccountInfo<'info>
}