import { PublicKey } from "@solana/web3.js";

export const PRESALE_PROGRAM_PUBKEY = new PublicKey(
  "HNwCt6ZY38nFW8ydDZhSYVjkYU2fxNTwBtdy4p3kYCzL"
);

export const TOKEN_PUBKEY = new PublicKey(
  "55bhM86E8brNHWy7sNz4chqtfQtrVGDvaeWyVczJs8RC"
);

export const PRESALE_SEED = "CLUB_PRESALE_SEED";
export const USER_SEED = "CLUB_USER_SEED";
export const PRESALE_ID = 2;

export const PRESALE_AUTHORITY = new PublicKey(
  "Av26fcGRp9x3wJv63Se2xVoQn1bvNNyP8TXyctWket8f"
);

export const TOKEN_PRESALE_HARDCAP = 10000000; // token
export const PRICE_PER_TOKEN = 0.005; // $
export const PRICE_DECIMAL = 8

export const BUYER_SOFTCAP = 0.2; // sol
export const BUYER_HARDCAP = 50; // sol
export const BUYER_TOKEN_HARDCAP = 50000000; // token

export const TOKEN_DECIMAL = 6;

export const SOL_TOKEN_PUBKEY = new PublicKey ("So11111111111111111111111111111111111111112")
export const USDC_TOKEN_PUBKEY = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
export const USDT_TOKEN_PUBKEY = new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB')
export const JUP_TOKEN_PUBKEY = new PublicKey('JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN')

export const SOL_PRICEFEED_ID = new PublicKey('H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG')
export const JUP_PRICEFEED_ID = new PublicKey('g6eRCbboSwK4tSWngn773RCMexr1APQr4uA9bGZBYfo')