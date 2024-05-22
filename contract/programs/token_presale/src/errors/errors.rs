use anchor_lang::prelude::*;

// Not yet implemented

#[error_code]
pub enum PresaleError {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
    #[msg("Over hardcap amount.")]
    Overhardcap,
    #[msg("Not allowed")]
    NotAllowed,
    #[msg("Not allowed tokens.")]
    NotAllowedToken,
    #[msg("Math operation overflow")]
    MathOverflow,
    #[msg("Already marked")]
    AlreadyMarked,
    #[msg("Presale not started yet")]
    PresaleNotStarted,
    #[msg("Presale already ended")]
    PresaleEnded,
    #[msg("Token amount mismatch")]
    TokenAmountMismatch,
    #[msg("Insufficient Tokens")]
    InsufficientFund,
    #[msg("Presale not ended yet")]
    PresaleNotEnded
}