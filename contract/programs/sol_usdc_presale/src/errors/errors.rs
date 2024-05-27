use anchor_lang::prelude::*;

#[error_code]
pub enum PresaleError {
    #[msg("Math operation overflow")]
    MathOverflow,
    #[msg("Presale not started yet")]
    PresaleNotStarted,
    #[msg("Presale already ended")]
    PresaleEnded,
    #[msg("Presale not ended yet")]
    PresaleNotEnded,
    #[msg("Insufficent token amount")]
    InsufficentTokenAmount,
    #[msg("Overflow max user limit")]
    MaxUserLimit,
    #[msg("Already claimed")]
    AlreadyClaimed,
}