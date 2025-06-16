import { PublicKey } from "@solana/web3.js";

export const GLOBAL_STATE_SEED = "GLOBAL_STATE_SEED_BANDIT_MINER";
export const VAULT_SEED = "VAULT_SEED_BANDIT_MINER";
export const USER_STATE_SEED = "USER_STATE_SEED_BANDIT_MINER";

// todo: for test, it is now one hour
// export const DAY_IN_MS = 3600 * 1000;
export const DAY_IN_MS = 3600 * 24 * 1000;
export const DAY_IN_SECS = 3600 * 24;
export const HOUR_IN_SECS = 3600;
// minimum amount to deposit
// should mul 10**decimals here to get real minimum
export const DEPOSIT_MINIMUM_AMOUNT = 100;
// tier starts from 0
export const DEFAULT_MAX_TIER = 2;

// export const NETWORK = "mainnet-beta";

export const PROGRAM_ID = new PublicKey(
  "ETtzY7hnCgdZcGkmFsdTwRdnBdzKesUKDBNUGfMSr3AS"
);

export const TREASURY = new PublicKey(
  "2MCBTxDtWvNpRXcG2KaWxUdDbsGZgiFM7nFZ4BjrGj5b"
  // "AoUE6xTu8u8MD1PbXANhF3j4s33iaGiyu3hEJRDdPvPr"
);

export const TEAM_TREASURY = new PublicKey(
  "4PbemWeiwya8RR8yMVsU7VxpfX6jyq1PRdnCGQRoZPGy"
  // "EUx9pRk3hdYzwG9iiMafGk4q3F2ePpvuqvWpdNsXyijq"
);

export const MARKETING_TREASURY = new PublicKey(
  "B8oPnSeNXJL6mboG5a4sZHxWqXY1JTXqkNNkj3t9ocn5"
  // "6rU7W9BR4RScficLbd3guj9y33B4TVXJy8hu9yvoD657"
);

export const ME_WALLET = new PublicKey(
  "FbzfyCgmfhsRHouq6e3bUoBHXBAfKVKdep9SZ2rVtUKS"
);
