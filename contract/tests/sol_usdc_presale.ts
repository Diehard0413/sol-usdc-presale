import * as anchor from "@coral-xyz/anchor";
import { Program, web3, BN } from "@coral-xyz/anchor";
import { SolUsdcPresale } from "../target/types/sol_usdc_presale";
import { PublicKey } from "@solana/web3.js";
import {
  getAccount,
  getOrCreateAssociatedTokenAccount,
  getAssociatedTokenAddressSync,
  transfer,
  mintTo,
  createMint
} from "@solana/spl-token";
import { ASSOCIATED_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token';

describe("sol_usdc_presale", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolUsdcPresale as Program<SolUsdcPresale>;
  const PROGRAM_ID = program.programId;

  const GLOBAL_STATE_SEED = "GLOBAL-STATE-SEED";
  const PRESALE_STATE_SEED = "PRESALE-STATE-SEED";
  const USER_STATE_SEED = "USER-STATE-SEED";
  const VAULT_SEED = "VAULT-SEED";
  const VAULT_STATE_SEED = "VAULT-STATE-SEED";

  const myWallet = provider.wallet;
  const payer = provider.wallet as anchor.Wallet;
  const myPubkey = myWallet.publicKey;

  const myKeypair = anchor.web3.Keypair.generate();
  const keypair1 = anchor.web3.Keypair.generate();
  const keypair2 = anchor.web3.Keypair.generate();

  const pubkey0 = myKeypair.publicKey;
  const pubkey1 = keypair1.publicKey;
  const pubkey2 = keypair2.publicKey;

  const HUNDRED = new BN(100000000000);
  const THOUSAND = new BN(1000000000000);

  const START_TIME = "2024-05-1T05:00:00-04:00";
  const DEAD_TIME = "2024-05-21T05:00:00-04:00";
  const END_TIME = "2024-06-01T05:00:00-04:00";

  const getStatePDA = async (owner: PublicKey) => {
    return (
      await PublicKey.findProgramAddressSync(
        [Buffer.from(GLOBAL_STATE_SEED), owner.toBuffer()],
        PROGRAM_ID
      )
    )[0];
  };

  const getPresalePDA = async (identifier: number) => {
    return (
      await PublicKey.findProgramAddressSync(
        [Buffer.from(PRESALE_STATE_SEED), Uint8Array.from([identifier])],
        PROGRAM_ID
      )
    )[0];
  };

  const getUserPDA = async (user: PublicKey, identifier: number) => {
    return (
      await PublicKey.findProgramAddressSync(
        [Buffer.from(USER_STATE_SEED), user.toBuffer(), Uint8Array.from([identifier])],
        PROGRAM_ID
      )
    )[0];
  };

  const getVaultPDA = (mintKeypair: PublicKey, owner: PublicKey): PublicKey => {
    return getAssociatedTokenAddressSync(
      mintKeypair,
      owner,
      true
    );
  };

  const getVaultSPDA = async () => {
    return (
      await PublicKey.findProgramAddressSync(
        [Buffer.from(VAULT_STATE_SEED)],
        PROGRAM_ID
      )
    )[0];
  };

  const airdropSol = async (
    provider: anchor.AnchorProvider,
    target: PublicKey,
    lamps: number
  ): Promise<string> => {
    try {
      const sig: string = await provider.connection.requestAirdrop(target, lamps);
      await provider.connection.confirmTransaction(sig);
      return sig;
    } catch (e) {
      console.error("Airdrop failed:", e);
      throw e;
    }
  };

  console.log(`My pubkey: ${myPubkey}`);
  console.log(`pubkey0: ${pubkey0}`);
  console.log(`pubkey1: ${pubkey1}`);
  console.log(`pubkey2: ${pubkey2}`);

  let presaleMint = null;
  let usdcMint = null;
  let globalPDA = null;
  let myGlobalPDA = null;
  let presalePDA = null;
  let vaultSPDA = null;
  let userPDA0 = null;
  let userPDA1 = null;
  let presaleATA= null;
  let usdcATA = null;
  let ownerPresaleATA = null;
  let ownerUsdcATA = null;
  let devPresaleATA = null;
  let devUsdcATA = null;
  let userPresaleATA0 = null;
  let userPresaleATA1 = null;
  let userUsdcATA0 = null;
  let userUsdcATA1 = null;

  it("Program is initialized!", async () => {
    await airdropSol(provider, payer.payer.publicKey, 100000000000);
    await airdropSol(provider, myPubkey, 100000000000);
    await airdropSol(provider, pubkey0, 100000000000);
    await airdropSol(provider, pubkey1, 10000000000);
    await airdropSol(provider, pubkey2, 10000000000);

    presaleMint = await createMint(provider.connection, payer.payer, myPubkey, myPubkey, 9);
    console.log(`presaleMint address: ${presaleMint}`);

    usdcMint = await createMint(provider.connection, payer.payer, myPubkey, myPubkey, 6);
    console.log(`usdcMint address: ${usdcMint}`);

    const usdcTokenAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer.payer,
      usdcMint,
      myPubkey
    );

    const presaleTokenAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer.payer,
      presaleMint,
      myPubkey
    );

    let signature = await mintTo(
      provider.connection,
      payer.payer,
      usdcMint,
      usdcTokenAccount.address,
      myPubkey,
      1000000000000000
    );
    console.log('usdc mint tx:', signature);

    signature = await mintTo(
      provider.connection,
      payer.payer,
      presaleMint,
      presaleTokenAccount.address,
      myPubkey,
      1000000000000000
    );
    console.log('presale mint tx:', signature);

    const toDevAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer.payer,
      usdcMint,
      pubkey0,
      true
    );

    const toTokenAccount1 = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer.payer,
      usdcMint,
      pubkey1,
      true
    );

    const toTokenAccount2 = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer.payer,
      usdcMint,
      pubkey2,
      true
    );

    signature = await transfer(
      provider.connection,
      payer.payer,
      usdcTokenAccount.address,
      toTokenAccount1.address,
      myPubkey,
      1000000000000
    );

    console.log('usdc transfer tx:', signature);

    signature = await transfer(
      provider.connection,
      payer.payer,
      usdcTokenAccount.address,
      toTokenAccount2.address,
      myPubkey,
      1000000000000
    );
  
    console.log('usdc transfer tx:', signature);

    let info = await getAccount(provider.connection, usdcTokenAccount.address);
    console.log(`usdc tokenAccount amount: ${info.amount}`);
    info = await getAccount(provider.connection, presaleTokenAccount.address);
    console.log(`presale tokenAccount amount: ${info.amount}`);
    info = await getAccount(provider.connection, toTokenAccount1.address);
    console.log(`usdc tokenAccount1 amount: ${info.amount}`);
    info = await getAccount(provider.connection, toTokenAccount2.address);
    console.log(`usdc tokenAccount2 amount: ${info.amount}`);

    globalPDA = await getStatePDA(myPubkey);
    console.log(`globalPDA: ${globalPDA}`);
    vaultSPDA = await getVaultSPDA();
    console.log(`vaultSPDA: ${vaultSPDA}`);
    
    const tx = await program.methods
      .initialize()
      .accounts({
        authority: myPubkey,
        globalState: globalPDA,
        vaultState: vaultSPDA,
        tokenMint: presaleMint,
        quoteTokenMint: usdcMint,
        systemProgram: web3.SystemProgram.programId
      })
      .rpc();
    console.log("Program is initialied by owner", tx);
  });

  it("Presale is created!", async () => {
    presalePDA = await getPresalePDA(0);
    console.log(`poolPDA address: ${presalePDA}`);

    let tx = await program.methods
      .createPresale(new BN(1), new BN(25), HUNDRED, new BN(1), new BN(new Date(START_TIME).getTime() / 1000), new BN(new Date(END_TIME).getTime() / 1000))
      .accounts({
        authority: myPubkey,
        globalState: globalPDA,
        presaleState: presalePDA,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Presale is created by owner", tx);
  });

  it("Presale token is deposited!", async () => {
    ownerPresaleATA = await getVaultPDA(presaleMint, myPubkey);
    console.log(`ownerPresaleATA address: ${ownerPresaleATA}`);
    presaleATA = await getVaultPDA(presaleMint, presalePDA);
    console.log(`presaleATA address: ${presaleATA}`);

    let info = await getAccount(provider.connection, ownerPresaleATA);
    console.log(`ownerPresaleATA amount: ${info.amount}`);
    
    const tx = await program.methods
      .depositToken(0, THOUSAND)
      .accounts({
        authority: myPubkey,
        globalState: globalPDA,
        presaleState: presalePDA,
        tokenMint: presaleMint,
        presaleTokenAccount: presaleATA,
        authorityTokenAccount: ownerPresaleATA,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId
      })
      .rpc();

    console.log("Presale token is deposited by owner", tx);

    info = await getAccount(provider.connection, presaleATA);
    console.log(`presaleATA amount: ${info.amount}`);
    info = await getAccount(provider.connection, ownerPresaleATA);
    console.log(`ownerPresaleATA amount: ${info.amount}`);
  });

  it("User 0 bought presale token!", async () => {
    userPDA0 = await getUserPDA(pubkey1, 0);
    console.log(`userPDA0 address: ${userPDA0}`);

    usdcATA = await getVaultPDA(usdcMint, presalePDA);
    console.log(`usdcATA address: ${usdcATA}`);
    userUsdcATA0 = await getVaultPDA(usdcMint, pubkey1);
    console.log(`userUsdcATA0 address: ${userUsdcATA0}`);

    let info = await getAccount(provider.connection, userUsdcATA0);
    console.log(`userUsdcATA0 amount: ${info.amount}`);
    
    const tx = await program.methods
      .buyToken(0, new BN(HUNDRED))
      .accounts({
        user: pubkey1,
        authority: myPubkey,
        globalState: globalPDA,
        presaleState: presalePDA,
        userState: userPDA0,
        quoteTokenMint: usdcMint,
        quoteTokenAccount: usdcATA,
        userTokenAccount: userUsdcATA0,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([keypair1])
      .rpc();

    console.log("User 0 sent usdc to vaultATA", tx);

    info = await getAccount(provider.connection, userUsdcATA0);
    console.log(`userUsdcATA0 amount: ${info.amount}`);
    info = await getAccount(provider.connection, usdcATA);
    console.log(`usdcATA amount: ${info.amount}`);
  });

  it("User 1 bought presale token!", async () => {
    userPDA1 = await getUserPDA(pubkey2, 0);
    console.log(`userPDA1 address: ${userPDA1}`);

    userUsdcATA1 = await getVaultPDA(usdcMint, pubkey2);
    console.log(`userUsdcATA1 address: ${userUsdcATA1}`);

    let info = await getAccount(provider.connection, userUsdcATA1);
    console.log(`userUsdcATA1 amount: ${info.amount}`);
    info = await getAccount(provider.connection, usdcATA);
    console.log(`usdcATA amount: ${info.amount}`);
    
    const tx = await program.methods
      .buyToken(0, new BN(HUNDRED))
      .accounts({
        user: pubkey2,
        authority: myPubkey,
        globalState: globalPDA,
        presaleState: presalePDA,
        userState: userPDA1,
        quoteTokenMint: usdcMint,
        quoteTokenAccount: usdcATA,
        userTokenAccount: userUsdcATA1,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([keypair2])
      .rpc();

    console.log("User 1 sent usdc to vaultATA", tx);

    info = await getAccount(provider.connection, userUsdcATA1);
    console.log(`userUsdcATA1 amount: ${info.amount}`);
    info = await getAccount(provider.connection, usdcATA);
    console.log(`usdcATA amount: ${info.amount}`);
  });

  it("Presale is updated!", async () => {
    let tx = await program.methods
      .updatePresale(0, new BN(1), new BN(25), HUNDRED, new BN(1), new BN(new Date(START_TIME).getTime() / 1000), new BN(new Date(DEAD_TIME).getTime() / 1000))
      .accounts({
        authority: myPubkey,
        globalState: globalPDA,
        presaleState: presalePDA,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Presale is updated by owner", tx);
  });

  it("User 0 claimed presale token!", async () => {
    // const poolInfo = await program.account.farmPoolAccount.all();
    // console.log("poolInfo =", poolInfo);
    // const userInfo = await program.account.farmPoolUserAccount.all();
    // console.log("userInfo =", userInfo);
    // const stateInfo = await program.account.stateAccount.all();
    // console.log("stateInfo =", stateInfo);

    userPresaleATA0 = await getVaultPDA(presaleMint, pubkey1);
    console.log(`userPresaleATA0 address: ${userPresaleATA0}`);

    let info = await getAccount(provider.connection, presaleATA);
    console.log(`presaleATA amount: ${info.amount}`);

    const tx = await program.methods
      .claimToken(0)
      .accounts({
        user: pubkey1,
        globalState: globalPDA,
        presaleState: presalePDA,
        userState: userPDA0,
        tokenMint: presaleMint,
        presaleTokenAccount: presaleATA,
        userTokenAccount: userPresaleATA0,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([keypair1])
      .rpc();

    console.log("User 0 received presale token", tx);

    info = await getAccount(provider.connection, userPresaleATA0);
    console.log(`userPresaleATA0 amount: ${info.amount}`);
    info = await getAccount(provider.connection, presaleATA);
    console.log(`presaleATA amount: ${info.amount}`);
  });

  it("User 1 claimed presale token!", async () => {
    userPresaleATA1 = await getVaultPDA(presaleMint, pubkey2);
    console.log(`userPresaleATA1 address: ${userPresaleATA1}`);

    let info = await getAccount(provider.connection, presaleATA);
    console.log(`presaleATA amount: ${info.amount}`);

    const tx = await program.methods
      .claimToken(0)
      .accounts({
        user: pubkey2,
        globalState: globalPDA,
        presaleState: presalePDA,
        userState: userPDA1,
        tokenMint: presaleMint,
        presaleTokenAccount: presaleATA,
        userTokenAccount: userPresaleATA1,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([keypair2])
      .rpc();

    console.log("User 1 received presale token", tx);

    info = await getAccount(provider.connection, userPresaleATA1);
    console.log(`userPresaleATA1 amount: ${info.amount}`);
    info = await getAccount(provider.connection, presaleATA);
    console.log(`presaleATA amount: ${info.amount}`);
  });

  it("Program is reinitialized by dev!", async () => {
    myGlobalPDA = await getStatePDA(pubkey0);
    console.log(`My global PDA: ${myGlobalPDA}`);
    devUsdcATA = await getVaultPDA(usdcMint, pubkey0);
    console.log(`devUsdcATA: ${devUsdcATA}`);

    let tx = await program.methods
      .initialize()
      .accounts({
        authority: pubkey0,
        globalState: myGlobalPDA,
        vaultState: vaultSPDA,
        tokenMint: presaleMint,
        quoteTokenMint: usdcMint,
        systemProgram: web3.SystemProgram.programId
      })
      .signers([myKeypair])
      .rpc();
    console.log("Program is reinitialized by dev", tx);

    let info = await getAccount(provider.connection, usdcATA);
    console.log(`usdcATA amount: ${info.amount}`);
    info = await getAccount(provider.connection, presaleATA);
    console.log(`presaleATA amount: ${info.amount}`);
    info = await getAccount(provider.connection, devUsdcATA);
    console.log(`devUsdcATA amount: ${info.amount}`);

    tx = await program.methods
      .withdrawToken(0, new BN(HUNDRED))
      .accounts({
        authority: pubkey0,
        globalState: myGlobalPDA,
        presaleState: presalePDA,
        vaultState: vaultSPDA,
        tokenMint: usdcMint,
        quoteTokenAccount: usdcATA,
        authorityTokenAccount: devUsdcATA,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([myKeypair])
      .rpc();

    console.log("dev withdrew usdc", tx);

    info = await getAccount(provider.connection, usdcATA);
    console.log(`usdcATA amount: ${info.amount}`);
    info = await getAccount(provider.connection, devUsdcATA);
    console.log(`devUsdcATA amount: ${info.amount}`);

    info = await getAccount(provider.connection, presaleATA);
    console.log(`presaleATA amount: ${info.amount}`);

    devPresaleATA = await getVaultPDA(presaleMint, pubkey0);
    console.log(`devPresaleATA address: ${devPresaleATA}`);

    tx = await program.methods
      .rescueToken(0, new BN(HUNDRED))
      .accounts({
        authority: pubkey0,
        globalState: myGlobalPDA,
        presaleState: presalePDA,
        vaultState: vaultSPDA,
        tokenMint: presaleMint,
        presaleTokenAccount: presaleATA,
        authorityTokenAccount: devPresaleATA,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([myKeypair])
      .rpc();

    console.log("dev rescued presale token", tx);

    info = await getAccount(provider.connection, presaleATA);
    console.log(`presaleATA amount: ${info.amount}`);
    info = await getAccount(provider.connection, devPresaleATA);
    console.log(`devPresaleATA amount: ${info.amount}`);

    tx = await program.methods
      .updateConfig(true)
      .accounts({
        authority: pubkey0,
        globalState: myGlobalPDA,
        vaultState: vaultSPDA,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([myKeypair])
      .rpc();

    console.log("dev updated config", tx);
  });

  it("Owner withdrew the tokens!", async () => {
    ownerUsdcATA = await getVaultPDA(usdcMint, myPubkey);
    console.log(`ownerUsdcATA address: ${ownerUsdcATA}`);

    let info = await getAccount(provider.connection, usdcATA);
    console.log(`usdcATA amount: ${info.amount}`);
    info = await getAccount(provider.connection, ownerUsdcATA);
    console.log(`userVaultPDA0 amount: ${info.amount}`);

    const tx = await program.methods
      .withdrawToken(0, new BN(HUNDRED))
      .accounts({
        authority: myPubkey,
        globalState: globalPDA,
        presaleState: presalePDA,
        vaultState: vaultSPDA,
        tokenMint: usdcMint,
        quoteTokenAccount: usdcATA,
        authorityTokenAccount: ownerUsdcATA,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Owner withdrew usdc", tx);

    info = await getAccount(provider.connection, usdcATA);
    console.log(`usdcATA amount: ${info.amount}`);
    info = await getAccount(provider.connection, ownerUsdcATA);
    console.log(`userVaultPDA0 amount: ${info.amount}`);
  });

  it("Owner rescued the tokens!", async () => {
    let info = await getAccount(provider.connection, presaleATA);
    console.log(`presaleATA amount: ${info.amount}`);
    info = await getAccount(provider.connection, ownerPresaleATA);
    console.log(`ownerPresaleATA amount: ${info.amount}`);

    const tx = await program.methods
      .rescueToken(0, new BN(HUNDRED))
      .accounts({
        authority: myPubkey,
        globalState: globalPDA,
        presaleState: presalePDA,
        vaultState: vaultSPDA,
        tokenMint: presaleMint,
        presaleTokenAccount: presaleATA,
        authorityTokenAccount: ownerPresaleATA,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Owner rescued presale token", tx);

    info = await getAccount(provider.connection, presaleATA);
    console.log(`presaleATA amount: ${info.amount}`);
    info = await getAccount(provider.connection, ownerPresaleATA);
    console.log(`ownerPresaleATA amount: ${info.amount}`);
  });
});