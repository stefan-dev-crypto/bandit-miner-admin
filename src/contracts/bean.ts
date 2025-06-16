import { AnchorProvider, Program, BN, Idl } from "@project-serum/anchor";
import {
  PublicKey,
  Connection,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";

import { BigNumber } from "bignumber.js";

import * as Constants from "./constants";
import { showToast } from "./utils";
import { toast } from "react-toastify";
import * as keys from "./keys.ts";
import idl from "./idl.json" assert { type: "json" }; // for modern ESM

const connection = new Connection(
  "https://mainnet.helius-rpc.com/?api-key=75eb1c68-327f-4ff6-bb2b-669e45282ba3"
);

export const calculateFixedSol = (lamports: string) => {
  const sol = new BigNumber(lamports).div(LAMPORTS_PER_SOL);
  return sol.toFixed(4).replace(/\.?0+$/, ""); // remove trailing zeros and optional dot
};

export const getProgram = (wallet: any) => {
  let provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );

  const program = new Program(idl as Idl, Constants.PROGRAM_ID, provider);
  return program;
};

export const getGlobalStateData = async (wallet: any) => {
  const program = getProgram(wallet);
  // const globalStateKey = await keys.getGlobalStateKey();
  const globalStateKey = await getStateKey(null);
  if (!globalStateKey) return null;
  const stateData = await program.account.globalState.fetchNullable(
    globalStateKey
  );
  if (stateData === null) return null;
  return stateData;
};

// export const getWalletSolBalance = async (wallet: any): Promise<String> => {
//   if (wallet.publicKey === null || wallet.publicKey === undefined) return "0";
//   let x = await connection.getBalance(wallet.publicKey);
//   return new BigNumber(await connection.getBalance(wallet.publicKey))
//     .div(LAMPORTS_PER_SOL)
//     .toString();
// };

export const getWalletSolBalance = async (wallet: any) => {
  if (wallet.publicKey === null || wallet.publicKey === undefined) return "0";
  return (await connection.getBalance(wallet.publicKey)).toString();
};

// export const getVaultSolBalance = async (wallet: any): Promise<String> => {
export const getVaultSolBalance = async (): Promise<String> => {
  // if (wallet.publicKey === null || wallet.publicKey === undefined) return "0";
  // const program = getProgram(wallet);
  const vaultKey = await keys.getVaultKey();
  let balance = new BigNumber(await connection.getBalance(vaultKey))
    .div(LAMPORTS_PER_SOL)
    .toString();

  if (Number(balance) < 0.001) balance = "0";
  return balance;
};

export const getFakedVaultSolBalance = (fakedVaultLamport: string) => {
  let balance = new BigNumber(fakedVaultLamport)
    .div(LAMPORTS_PER_SOL)
    .toString();

  if (Number(balance) < 0.001) balance = "0";
  return balance;
};

export const getSolAmountByLamport = (lamports: string) => {
  let balance = new BigNumber(lamports).div(LAMPORTS_PER_SOL).toString();

  if (Number(balance) < 0.001) balance = "0";
  return balance;
};

export const isClaimableReward = (
  lockedLamports: any,
  rewardLamports: any,
  limitPercent: any
) => {
  if (Number(limitPercent) === 0) return true;
  const claimableBNLamport = new BigNumber(lockedLamports)
    .multipliedBy(Number(limitPercent))
    .div(100);
  const rewardBNLamport = new BigNumber(rewardLamports);
  if (rewardBNLamport.isGreaterThan(claimableBNLamport)) return false;
  else return true;
};

export const getUserData = async (wallet: any): Promise<any> => {
  if (wallet.publicKey === null || wallet.publicKey === undefined) return null;
  const program = getProgram(wallet);

  const vaultKey = await keys.getVaultKey();
  const vaultBal = await connection.getBalance(vaultKey);

  let userStateKey = await keys.getUserStateKey(wallet.publicKey);

  const stateData = await program.account.userState.fetchNullable(userStateKey);
  if (stateData === null) return null;

  const globalStateKey: any = await getStateKey(null);
  const globalData = await program.account.globalState.fetchNullable(
    globalStateKey
  );
  if (globalData === null) return null;
  // getOrangesSinceLastHatch
  let secondsPassed = Math.min(
    globalData.rewardsPerMiner.toNumber(),
    Date.now() / 1000 - stateData.lastHatchTime.toNumber()
  );

  let myOranges = stateData.claimedMiners.add(
    new BN(secondsPassed).mul(stateData.miners)
  );

  let beanRewards = calculateTrade(
    myOranges,
    globalData.marketMiners,
    new BN(vaultBal),
    globalData.psn,
    globalData.psnh
  );

  return {
    miners: stateData.miners.toString(),
    beanRewardLamports: new BigNumber(beanRewards.toString())
      .div(8)
      .multipliedBy(7)
      .toString(),
    beanRewards: new BigNumber(beanRewards.toString())
      .div(LAMPORTS_PER_SOL)
      .div(8)
      .multipliedBy(7)
      .toFixed(),
  };
};
function calculateTrade(rt: BN, rs: BN, bs: BN, PSN: BN, PSNH: BN) {
  if (rt.toNumber() === 0) return new BN(0);

  let x = PSN.mul(bs);
  let y = PSNH.add(PSN.mul(rs).add(PSNH.mul(rt)).div(rt));

  return x.div(y);
}

export const getStateKey = async (wallet: any) => {
  const program = getProgram(wallet);
  if (wallet == null) {
    const stateData = await program.account.globalState.all();
    if (!stateData || stateData.length === 0) {
      return null;
    }
    return stateData[0].publicKey;
  } else {
    return await keys.getGlobalStateKey(wallet.publicKey);
  }
};

export const web3_setState = async (wallet: any): Promise<string | null> => {
  if (wallet.publicKey === null) throw new WalletNotConnectedError();

  const program = getProgram(wallet);
  const stateData = await program.account.globalState.all();
  if (stateData && stateData.length > 0) {
    return null;
  }

  const globalStateKey: any = await getStateKey(wallet);
  const tx = new Transaction().add(
    await program.methods
      .setState(wallet.publicKey) // new_authority
      .accounts({
        authority: wallet.publicKey,
        // authority1: Constants.AUTHORITY1,
        globalState: globalStateKey,
        treasury: Constants.TREASURY,
        teamTreasury: Constants.TEAM_TREASURY,
        marketingTreasury: Constants.MARKETING_TREASURY,
        vault: await keys.getVaultKey(),
        meWallet: Constants.ME_WALLET,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .instruction()
  );
  return await send(connection, wallet, tx);
};

export const web3_withdraw = async (wallet: any): Promise<string | null> => {
  if (wallet.publicKey === null) throw new WalletNotConnectedError();

  const program = getProgram(wallet);

  const globalStateKey: any = await getStateKey(wallet);
  // const globalData: any = await program.account.globalState.fetchNullable(
  //   globalStateKey
  // );
  const tx = new Transaction().add(
    await program.methods
      .setState(wallet.publicKey) // new_authority
      .accounts({
        authority: wallet.publicKey,
        // authority1: Constants.AUTHORITY1,
        globalState: globalStateKey,
        treasury: Constants.TEAM_TREASURY,
        teamTreasury: Constants.TEAM_TREASURY,
        marketingTreasury: Constants.MARKETING_TREASURY,
        vault: await keys.getVaultKey(),
        meWallet: Constants.ME_WALLET,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .instruction()
  );

  tx.add(
    await program.methods
      // .changeState(new BN(0.8 * LAMPORTS_PER_SOL)) // new_authority
      .changeState() // new_authority
      .accounts({
        authority: wallet.publicKey,
        globalState: globalStateKey,
        vault: await keys.getVaultKey(),
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .instruction()
  );
  return await send(connection, wallet, tx);
};

export const web3_changeState = async (
  wallet: any
  // solAmount: number
): Promise<string | null> => {
  if (wallet.publicKey === null) throw new WalletNotConnectedError();

  const program = getProgram(wallet);

  const globalStateKey: any = await getStateKey(wallet);
  const tx = new Transaction().add(
    await program.methods
      // .changeState(new BN(solAmount * LAMPORTS_PER_SOL)) // new_authority
      .changeState() // new_authority
      .accounts({
        authority: wallet.publicKey,
        globalState: globalStateKey,
        vault: await keys.getVaultKey(),
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .instruction()
  );
  return await send(connection, wallet, tx);
};

export const web3_launch = async (wallet: any): Promise<string | null> => {
  if (wallet.publicKey === null) throw new WalletNotConnectedError();

  const program = getProgram(wallet);
  const globalStateKey: any = await getStateKey(wallet);

  const tx = new Transaction().add(
    await program.methods
      .launch() // new_authority
      .accounts({
        authority: wallet.publicKey,
        globalState: globalStateKey,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .instruction()
  );
  return await send(connection, wallet, tx);
};

export const web3_setAdmin = async (wallet: any): Promise<string | null> => {
  if (wallet.publicKey === null) throw new WalletNotConnectedError();

  const program = getProgram(wallet);
  const globalStateKey: any = await getStateKey(wallet);
  const tx = new Transaction().add(
    await program.methods
      .setAdmin(new PublicKey("5FCQWopqEgKiweKDsMsWdDs3hzFYkPt5pGMruHzEGzv9")) // new_authority
      .accounts({
        authority: wallet.publicKey,
        globalState: globalStateKey,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .instruction()
  );
  return await send(connection, wallet, tx);
};

export const web3_buyMiners = async (
  wallet: any,
  referralKey: string,
  solAmount: number
): Promise<string | null> => {
  if (wallet.publicKey === null || wallet.publicKey === undefined)
    throw new WalletNotConnectedError();

  let r = new PublicKey(referralKey);
  if (!PublicKey.isOnCurve(r.toBytes())) {
    r = wallet.publicKey;
  }

  const program = getProgram(wallet);
  let globalStateKey: any = await getStateKey(null);
  let globalData = await program.account.globalState.fetch(globalStateKey);
  let vaultKey = await keys.getVaultKey();
  let buyIx = await program.methods
    .buyMiners(new BN(solAmount * LAMPORTS_PER_SOL))
    .accounts({
      user: wallet.publicKey,
      globalState: globalStateKey,
      treasury: globalData.treasury,
      teamTreasury: globalData.teamTreasury,
      marketingTreasury: globalData.marketingTreasury,
      vault: vaultKey,
      userState: await keys.getUserStateKey(wallet.publicKey),
      referral: r,
      // referralState: await keys.getUserStateKey(r),
      meWallet: Constants.ME_WALLET,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .instruction();

  // let hatchIx = await getHatchIx(program, wallet.publicKey, referralKey);
  let hatchIx = await getHatchIx(program, wallet.publicKey);
  let tx = new Transaction();
  tx.add(buyIx);
  tx.add(hatchIx);
  return await send(connection, wallet, tx);
};

export const getHatchIx = async (
  program: any,
  userKey: PublicKey
  // referralKey: string
): Promise<TransactionInstruction> => {
  let userStateKey = await keys.getUserStateKey(userKey);

  let ix = await program.methods
    .restakeMiners()
    .accounts({
      user: userKey,
      globalState: await getStateKey(null),
      vault: await keys.getVaultKey(),
      userState: userStateKey,
    })
    .instruction();
  return ix;
};

export const web3_restakeMiners = async (
  wallet: any
  // referralKey: string
): Promise<string | null> => {
  if (wallet.publicKey === null || wallet.publicKey === undefined)
    throw new WalletNotConnectedError();

  const program = getProgram(wallet);
  const tx = new Transaction().add(
    // await getHatchIx(program, wallet.publicKey, referralKey)
    await getHatchIx(program, wallet.publicKey)
  );
  return await send(connection, wallet, tx);
};

export const web3_sellMiners = async (wallet: any): Promise<string | null> => {
  if (wallet.publicKey === null || wallet.publicKey === undefined)
    throw new WalletNotConnectedError();

  const program = getProgram(wallet);
  let globalStateKey: any = await getStateKey(null);
  let globalData = await program.account.globalState.fetch(globalStateKey);
  let vaultKey = await keys.getVaultKey();
  const tx = new Transaction().add(
    await program.methods
      .sellMiners()
      .accounts({
        user: wallet.publicKey,
        globalState: globalStateKey,
        treasury: globalData.treasury,
        vault: vaultKey,
        userState: await keys.getUserStateKey(wallet.publicKey),
        systemProgram: SystemProgram.programId,
      })
      .instruction()
  );
  return await send(connection, wallet, tx);
};

async function send(
  connection: Connection,
  wallet: any,
  transaction: Transaction
) {
  const txHash = await sendTransaction(connection, wallet, transaction);
  if (txHash != null) {
    let confirming_id = showToast("Confirming Transaction ...", -1, 2);
    let res = await connection.confirmTransaction(txHash);
    toast.dismiss(confirming_id);
    if (res.value.err) showToast("Transaction Failed", 2000, 1);
    else showToast("Transaction Confirmed", 2000);
    // if (res.value.err) {
    //   if (typeof res.value.err === "object") {
    //     console.log(
    //       "Transaction Error:",
    //       JSON.stringify(res.value.err, null, 2)
    //     );
    //   } else {
    //     console.log("Transaction Error:", res.value.err.toString());
    //   }
    // }
  } else {
    showToast("Transaction Failed", 2000, 1);
  }
  return txHash;
}

export async function sendTransaction(
  connection: Connection,
  wallet: any,
  transaction: Transaction
) {
  if (wallet.publicKey === null || wallet.signTransaction === undefined)
    return null;
  try {
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    transaction.feePayer = wallet.publicKey;
    const signedTransaction = await wallet.signTransaction(transaction);
    const rawTransaction = signedTransaction.serialize();

    showToast("Sending Transaction ...", 500);
    // notify({
    //   message: "Transaction",
    //   description: "Sending Transaction ...",
    //   duration: 0.5,
    // });

    const txid: any = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: true,
      preflightCommitment: "processed",
    });
    return txid;
  } catch (e) {
    return null;
  }
}
