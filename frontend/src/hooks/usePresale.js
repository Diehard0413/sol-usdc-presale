import {
    useAnchorWallet,
    useConnection,
    useWallet,
  } from "@solana/wallet-adapter-react";
  import { useEffect, useMemo, useState } from "react";
  import * as anchor from "@project-serum/anchor";
  import { IDL } from "../idl/token_presale";
  import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
  import {
    BUYER_HARDCAP,
    BUYER_TOKEN_HARDCAP,
    PRESALE_AUTHORITY,
    PRESALE_ID,
    PRESALE_PROGRAM_PUBKEY,
    PRESALE_SEED,
    PRICE_PER_TOKEN,
    PRICE_DECIMAL,
    TOKEN_DECIMAL,
    TOKEN_PRESALE_HARDCAP,
    TOKEN_PUBKEY,
    USER_SEED,
    SOL_TOKEN_PUBKEY,
    USDC_TOKEN_PUBKEY,
    USDT_TOKEN_PUBKEY,
    JUP_TOKEN_PUBKEY,
    SOL_PRICEFEED_ID,
    JUP_PRICEFEED_ID
  } from "../constants";
  import { toast } from "react-toastify";
  import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
  import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
  import { ASSOCIATED_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";

  import { parsePriceData } from "@pythnetwork/client"
  
  export default function usePresale() {
    const { publicKey } = useWallet();
    const anchorWallet = useAnchorWallet();
    const { connection } = useConnection();
    const [transactionPending, setTransactionPending] = useState(false);
    const [loading, setLoading] = useState(false);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [buyAmount, setBuyAmount] = useState(0);
    const [claimedAmount, setClaimedAmount] = useState(0);
    const [totalBuyAmount, setTotalBuyAmount] = useState(0);

    const program = useMemo(() => {
      if (anchorWallet) {
        const provider = new anchor.AnchorProvider(
          connection,
          anchorWallet,
          anchor.AnchorProvider.defaultOptions()
        );
        return new anchor.Program(IDL, PRESALE_PROGRAM_PUBKEY, provider);
      }
    }, [connection, anchorWallet]);
  
    useEffect(() => {
  
      const getPresaleState = async () => {
        if (program && !transactionPending) {
          try {
            setLoading(true);
            const [presale_state, presale_bump] = findProgramAddressSync(
              [
                utf8.encode(PRESALE_SEED),
                PRESALE_AUTHORITY.toBuffer(),
                new Uint8Array([PRESALE_ID]),
              ],
              program.programId
            );
            const info = await program.account.presaleInfo.fetch(presale_state);
            setStartTime(info.startTime);
            setEndTime(info.endTime);
            setTotalBuyAmount(info.soldTokenAmount);
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
          }
        }
      };
  
      const getUserState = async () => {
        if (program && publicKey && !transactionPending) {
          try {
            setLoading(true);
            const [userInfo, userBump] = findProgramAddressSync(
              [
                utf8.encode(USER_SEED),
                PRESALE_AUTHORITY.toBuffer(),
                publicKey.toBuffer(),
                new Uint8Array([PRESALE_ID]),
              ],
              program.programId
            );
            const info = await program.account.userInfo.fetch(userInfo);
            setBuyAmount(info.buyTokenAmount);
            setClaimedAmount(info.claimAmount);
            console.log("User Info : ", info);
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
          }
        }
      };
  
      getPresaleState();
      getUserState();
    }, [publicKey, program, transactionPending, connection, anchorWallet]);

    const getPrice = async (tokenSymbol) => {
      if (program && publicKey) {
        try {
          if (tokenSymbol === "USDT" || tokenSymbol === "USDC") return 1;
          const price_feed_id = tokenSymbol === "SOL" ? SOL_PRICEFEED_ID : tokenSymbol === "JUP" ? JUP_PRICEFEED_ID : null
          if (!price_feed_id) return 0
          let {data} = await connection.getAccountInfo(price_feed_id) || {};
          if (!data) return 0
          const priceData = parsePriceData (data)
          if (priceData && priceData.aggregate && priceData.aggregate.price) {return priceData.aggregate.price}
          return 0
        }
        catch {
            return 0;
        }
      } else {return 0}
    }
  
    const createPresale = async () => {
      if (program && publicKey) {
        try {
          setTransactionPending(true);
          const [presale_state, presale_bump] = findProgramAddressSync(
            [
              utf8.encode(PRESALE_SEED),
              PRESALE_AUTHORITY.toBuffer(),
              new Uint8Array([PRESALE_ID]),
            ],
            program.programId
          );
  
          const bigIntHardcap =
            BigInt(TOKEN_PRESALE_HARDCAP) * BigInt(10 ** TOKEN_DECIMAL);
          const bigIntBuyerHardcap =
            BigInt(BUYER_TOKEN_HARDCAP) * BigInt(10 ** TOKEN_DECIMAL);
          const tokenPrice = PRICE_PER_TOKEN * 10 ** 8;
  
          const tx = await program.methods
            .createPresale(
              TOKEN_PUBKEY,
              SOL_TOKEN_PUBKEY,
              USDT_TOKEN_PUBKEY,
              USDC_TOKEN_PUBKEY,
              JUP_TOKEN_PUBKEY,
              new anchor.BN(10 ** TOKEN_DECIMAL), // softcap
              new anchor.BN(bigIntHardcap.toString()), // hardcap
              new anchor.BN(bigIntBuyerHardcap.toString()), // maxTokenAmountPerAddress
              new anchor.BN(tokenPrice), // price per token
              new anchor.BN(new Date("2024-02-24T12:00:00Z").getTime() / 1000), // start time
              new anchor.BN(new Date("2024-03-20T12:00:00Z").getTime() / 1000), // end time
              PRESALE_ID // presale id
            )
            .accounts({
              presaleInfo: presale_state,
              authority: publicKey,
              systemProgram: SystemProgram.programId,
            })
            .rpc();
          toast.success("Successfully created presale.");
          return false;
        } catch (error) {
          console.log(error);
          toast.error(error.toString());
          return false;
        } finally {
          setTransactionPending(false);
        }
      }
    };
  
    const withdrawSol = async () => {
      if (program && publicKey) {
        try {
          setTransactionPending(true);
          const [presale_state, presale_bump] = findProgramAddressSync(
            [
              utf8.encode(PRESALE_SEED),
              PRESALE_AUTHORITY.toBuffer(),
              new Uint8Array([PRESALE_ID]),
            ],
            program.programId
          );
          console.log("HHHHH - presale_state", presale_state.toString());
          const tx = await program.methods
            .withdrawSol(
              PRESALE_ID // presale id
            )
            .accounts({
              presaleInfo: presale_state,
              presaleAuthority: PRESALE_AUTHORITY,
              buyerAuthority: publicKey,
              buyer: publicKey,
              rent: anchor.web3.SYSVAR_RENT_PUBKEY,
              systemProgram: anchor.web3.SystemProgram.programId,
              tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
              associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
            })
            .rpc();
          toast.success("Successfully withdrawed sol.");
          return false;
        } catch (error) {
          console.log(error);
          toast.error(error.toString());
          return false;
        } finally {
          setTransactionPending(false);
        }
      }
    };
  
    const updatePresale = async () => {
      if (program && publicKey) {
        try {
          setTransactionPending(true);
          const [presale_state, presale_bump] = findProgramAddressSync(
            [
              utf8.encode(PRESALE_SEED),
              PRESALE_AUTHORITY.toBuffer(),
              new Uint8Array([PRESALE_ID]),
            ],
            program.programId
          );
  
          const bigIntHardcap =
            BigInt(TOKEN_PRESALE_HARDCAP) * BigInt(10 ** TOKEN_DECIMAL);
          const bigIntBuyerHardcap =
            BigInt(BUYER_TOKEN_HARDCAP) * BigInt(10 ** TOKEN_DECIMAL);
          const tokenPrice = PRICE_PER_TOKEN * 10 ** PRICE_DECIMAL;
  
          const tx = await program.methods
            .updatePresale(
              new anchor.BN(bigIntBuyerHardcap), // maxTokenAmountPerAddress
              new anchor.BN(tokenPrice), // pricePerToken
              new anchor.BN(10 ** TOKEN_DECIMAL), //softcapAmount
              new anchor.BN(bigIntHardcap), // hardcapAmount
              new anchor.BN(new Date("2024-02-18T17:12:00Z").getTime() / 1000), // start time
              new anchor.BN(new Date("2024-02-19T19:00:00Z").getTime() / 1000), // end time
              PRESALE_ID // presale id
            )
            .accounts({
              presaleInfo: presale_state,
              authority: publicKey,
              systemProgram: SystemProgram.programId,
            })
            .rpc();
          toast.success("Successfully updated presale.");
          return false;
        } catch (error) {
          console.log(error);
          toast.error(error.toString());
          return false;
        } finally {
          setTransactionPending(false);
        }
      }
    };

    const updateAuth = async () => {
      if (program && publicKey) {
        try {
          setTransactionPending(true);
          const [presale_state, presale_bump] = findProgramAddressSync(
            [
              utf8.encode(PRESALE_SEED),
              PRESALE_AUTHORITY.toBuffer(),
              new Uint8Array([PRESALE_ID]),
            ],
            program.programId
          );
  
          const tx = await program.methods
            .updateAuth(
              PRESALE_ID // presale id
            )
            .accounts({
              presaleInfo: presale_state,
              newAuth: new PublicKey(
                "61N9pcSLe97igPTUvwyDXhcEJpRwjPH89ARfiWPN2gdu"
              ),
              authority: publicKey,
              presaleAuthority: PRESALE_AUTHORITY,
              systemProgram: SystemProgram.programId,
            })
            .rpc();
          toast.success("Successfully initialized user.");
          return false;
        } catch (error) {
          console.log(error);
          toast.error(error.toString());
          return false;
        } finally {
          setTransactionPending(false);
        }
      }
    };

    const depositToken = async (depositingToken, pythAccount, amount) => {
      if (program && publicKey) {
        try {
          setTransactionPending(true);
          const [presale_state, presale_bump] = findProgramAddressSync(
            [
              utf8.encode(PRESALE_SEED),
              PRESALE_AUTHORITY.toBuffer(),
              new Uint8Array([PRESALE_ID]),
            ],
            program.programId
          );
          const [userInfo, userBump] = findProgramAddressSync(
            [
              utf8.encode(USER_SEED),
              PRESALE_AUTHORITY.toBuffer(),
              publicKey.toBuffer(),
              new Uint8Array([PRESALE_ID]),
            ],
            program.programId
          );
  
          const fromAssociatedTokenAccount =
            await anchor.utils.token.associatedAddress({
              mint: depositingToken,
              owner: publicKey,
            });
  
          const toAssociatedTokenAccount =
            await anchor.utils.token.associatedAddress({
              mint: depositingToken,
              owner: presale_state,
            });
  
          // Use BigInt for large number calculations
          const depositAmount =
            BigInt(amount * (10 ** TOKEN_DECIMAL));
          
          const tx = await program.methods
            .depositToken(
              new anchor.BN(depositAmount), // deposit amount
              PRESALE_ID // presale id
            )
            .accounts({
              mintAccount: depositingToken,
              presaleAuthority: PRESALE_AUTHORITY,
              fromAssociatedTokenAccount,
              // fromAuthority: publicKey,
              toAssociatedTokenAccount,
              presaleInfo: presale_state,
              payer: publicKey,
              rent: anchor.web3.SYSVAR_RENT_PUBKEY,
              systemProgram: anchor.web3.SystemProgram.programId,
              tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
              associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
              userInfo,
              pythAccount,
            })
            .rpc();
          toast.success("Successfully deposited token.");
          return false;
        } catch (error) {
          console.log(error);
          toast.error(error.toString());
          return false;
        } finally {
          setTransactionPending(false);
        }
      }
    };
  
    const buyToken = async (amount) => {
      if (program && publicKey) {
        try {
          setTransactionPending(true);
          const [presaleInfo, presaleBump] = findProgramAddressSync(
            [
              utf8.encode(PRESALE_SEED),
              PRESALE_AUTHORITY.toBuffer(),
              new Uint8Array([PRESALE_ID]),
            ],
            program.programId
          );
          const [userInfo, userBump] = findProgramAddressSync(
            [
              utf8.encode(USER_SEED),
              PRESALE_AUTHORITY.toBuffer(),
              publicKey.toBuffer(),
              new Uint8Array([PRESALE_ID]),
            ],
            program.programId
          );
  
          // Use BigInt for large number calculations
  
          const bigIntSolAmount =
            BigInt(amount * (10 ** 9));
  
          const tx = await program.methods
            .buyToken(
              new anchor.BN(bigIntSolAmount), // sol amount = token amount * pricePerToken
              PRESALE_ID
            )
            .accounts({
              presaleInfo,
              presaleAuthority: PRESALE_AUTHORITY,
              userInfo,
              buyer: publicKey,
              rent: anchor.web3.SYSVAR_RENT_PUBKEY,
              systemProgram: anchor.web3.SystemProgram.programId,
              tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
              associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
              pythSolAccount: SOL_PRICEFEED_ID
            })
            .rpc();
          toast.success("Token purchase was successful.");
          return false;
        } catch (error) {
          console.log(error);
          toast.error(error.toString());
          return false;
        } finally {
          setTransactionPending(false);
        }
      }
    };
  
    const claimToken = async () => {
      if (program && publicKey) {
        try {
          setTransactionPending(true);
          const [presaleInfo, presaleBump] = findProgramAddressSync(
            [
              utf8.encode(PRESALE_SEED),
              PRESALE_AUTHORITY.toBuffer(),
              new Uint8Array([PRESALE_ID]),
            ],
            program.programId
          );
          const [userInfo, userBump] = findProgramAddressSync(
            [
              utf8.encode(USER_SEED),
              PRESALE_AUTHORITY.toBuffer(),
              publicKey.toBuffer(),
              new Uint8Array([PRESALE_ID]),
            ],
            program.programId
          );
  
          const buyer_presale_token_associated_token_account =
            await anchor.utils.token.associatedAddress({
              mint: TOKEN_PUBKEY,
              owner: publicKey,
            });
  
          const presale_presale_token_associated_token_account =
            await anchor.utils.token.associatedAddress({
              mint: TOKEN_PUBKEY,
              owner: presaleInfo,
            });
  
          const tx = await program.methods
            .claimToken(PRESALE_ID)
            .accounts({
              presaleTokenMintAccount: TOKEN_PUBKEY,
              buyerPresaleTokenAssociatedTokenAccount:
                buyer_presale_token_associated_token_account,
              presalePresaleTokenAssociatedTokenAccount:
                presale_presale_token_associated_token_account,
              userInfo,
              presaleInfo,
              presaleAuthority: PRESALE_AUTHORITY,
              buyerAuthority: publicKey,
              buyer: publicKey,
              rent: anchor.web3.SYSVAR_RENT_PUBKEY,
              systemProgram: anchor.web3.SystemProgram.programId,
              tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
              associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
            })
            .rpc();
          toast.success("Token claim was successful.");
          return false;
        } catch (error) {
          console.log(error);
          toast.error(error.toString());
          return false;
        } finally {
          setTransactionPending(false);
        }
      }
    };
  
    const withdrawToken = async (withdrawnToken) => {
      if (program && publicKey) {
        try {
          setTransactionPending(true);
          const [presaleInfo, presaleBump] = findProgramAddressSync(
            [
              utf8.encode(PRESALE_SEED),
              PRESALE_AUTHORITY.toBuffer(),
              new Uint8Array([PRESALE_ID]),
            ],
            program.programId
          );
          const [userInfo, userBump] = findProgramAddressSync(
            [
              utf8.encode(USER_SEED),
              PRESALE_AUTHORITY.toBuffer(),
              publicKey.toBuffer(),
              new Uint8Array([PRESALE_ID]),
            ],
            program.programId
          );
  
          const buyer_presale_token_associated_token_account =
            await anchor.utils.token.associatedAddress({
              mint: withdrawnToken,
              owner: publicKey,
            });
  
          const presale_presale_token_associated_token_account =
            await anchor.utils.token.associatedAddress({
              mint: withdrawnToken,
              owner: presaleInfo,
            });
  
          const tx = await program.methods
            .withdrawToken(
              PRESALE_ID
            )
            .accounts({
              presaleTokenMintAccount: withdrawnToken,
              buyerPresaleTokenAssociatedTokenAccount:
                buyer_presale_token_associated_token_account,
              presalePresaleTokenAssociatedTokenAccount:
                presale_presale_token_associated_token_account,
              presaleInfo,
              presaleAuthority: PRESALE_AUTHORITY,
              buyerAuthority: publicKey,
              buyer: publicKey,
              rent: anchor.web3.SYSVAR_RENT_PUBKEY,
              systemProgram: anchor.web3.SystemProgram.programId,
              tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
              associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
            })
            .rpc();
          toast.success("Token withdraw was successful.");
          return false;
        } catch (error) {
          console.log(error);
          toast.error(error.toString());
          return false;
        } finally {
          setTransactionPending(false);
        }
      }
    };
  
    return {
      createPresale,
      depositToken,
      buyToken,
      updatePresale,
      claimToken,
      getPrice,
      withdrawSol,
      withdrawToken,
      updateAuth,
      startTime,
      endTime,
      buyAmount,
      claimedAmount,
      totalBuyAmount,
      transactionPending,
    };
  }
  