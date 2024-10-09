import * as anchor from "@coral-xyz/anchor";
import { Solplay } from "../target/types/solplay";

import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

const BOT_ID = "12";
const METADATA_SEED = "metadata";
const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
const MINT_SEED = "mint1";
const metadata = {
  name: "Net2Dev SPL Rewards Token",
  symbol: "N2DR",
  uri: "https://arweave.net/Xjqaj_rYYQGrsiTk9JRqpguA813w6NGPikcRyA1vAHM",
  decimals: 0,
};

// Comment the below to run the same on playground
const pg: any = null;
const isPlayGround: Boolean = pg != null ? true : false;

const connection = getConnection();
const program = getProgram(isPlayGround);
const adminKeypair = getAdminKeypair(isPlayGround);
const programId = getProgramId(isPlayGround);

const adminPublicKey = adminKeypair.publicKey;

// Get the private key in string format
// const secretKeyHexString = Buffer.from(adminKeypair.secretKey).toString("hex");
// console.log("Secret Key:", secretKeyHexString);

// const keypair = anchor.web3.Keypair.generate();
// console.log("Secret Uint8Array: ", keypair.secretKey);
// console.log("Public Key: ", keypair.publicKey.toString());
const secretKey = new Uint8Array([
  245, 40, 63, 248, 106, 28, 94, 232, 154, 14, 223, 125, 179, 106, 113, 219, 74,
  197, 248, 98, 39, 98, 75, 207, 76, 204, 66, 72, 64, 195, 167, 203, 146, 98,
  43, 234, 39, 254, 213, 147, 253, 101, 55, 81, 170, 46, 77, 195, 150, 91, 141,
  39, 180, 42, 250, 48, 81, 161, 189, 245, 247, 91, 104, 150,
]);
const botCreatorKeypair = anchor.web3.Keypair.fromSecretKey(secretKey);
// const botCreatorKeypair = anchor.web3.Keypair.generate();
const botCreatorPublicKey = botCreatorKeypair.publicKey;

const botUserSecret = new Uint8Array([
  235, 192, 224, 189, 120, 177, 77, 162, 8, 163, 105, 216, 219, 25, 152, 151,
  200, 191, 57, 142, 255, 196, 249, 5, 170, 157, 103, 26, 7, 64, 197, 179, 136,
  86, 0, 189, 33, 132, 70, 154, 36, 247, 25, 103, 231, 195, 161, 220, 208, 153,
  228, 31, 74, 243, 230, 225, 210, 67, 165, 105, 248, 247, 147, 164,
]);
const botUserKeypair = anchor.web3.Keypair.fromSecretKey(botUserSecret);
// const botUserKeypair = anchor.web3.Keypair.generate();
const botUserPublicKey = botUserKeypair.publicKey;

const chatBotPdaAccount = getChatBotPdaAccount(BOT_ID, botCreatorPublicKey);
const botUserPdaAccount = getBotUserPdaAccount(BOT_ID, botUserPublicKey);

// const [mint] = anchor.web3.PublicKey.findProgramAddressSync(
//   [Buffer.from(MINT_SEED)],
//   program.programId
// );
// const [mint] = web3.PublicKey.findProgramAddressSync(
//   [Buffer.from(MINT_SEED), botCreatorPublicKey.toBuffer()],
//   program.programId
// );

// const keypair = anchor.web3.Keypair.generate();
// console.log("Secret Uint8Array: ", keypair.secretKey);
// console.log("Public Key: ", keypair.publicKey.toString());
const mintSecret = new Uint8Array([
  18, 252, 34, 155, 49, 186, 30, 229, 48, 214, 93, 142, 28, 242, 34, 145, 187,
  208, 93, 177, 30, 36, 59, 59, 127, 67, 29, 147, 124, 38, 21, 77, 90, 221, 114,
  232, 44, 158, 42, 44, 177, 113, 172, 90, 233, 18, 154, 178, 85, 112, 245, 52,
  246, 203, 242, 185, 196, 10, 155, 38, 173, 123, 71, 56,
]);
const mintKeypair = anchor.web3.Keypair.fromSecretKey(mintSecret);
// const mintKeypair = keypair;
// const mintKeypair = anchor.web3.Keypair.generate();
const mint = mintKeypair.publicKey;

const [metadataAddress] = anchor.web3.PublicKey.findProgramAddressSync(
  [
    Buffer.from(METADATA_SEED),
    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
    mint.toBuffer(),
  ],
  TOKEN_METADATA_PROGRAM_ID
);
const [masterEditionAddress] = anchor.web3.PublicKey.findProgramAddressSync(
  [
    Buffer.from(METADATA_SEED),
    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
    mint.toBuffer(),
    Buffer.from("edition"),
  ],
  TOKEN_METADATA_PROGRAM_ID
);

console.log("Mint:", mint.toString());
console.log("Metadata:", metadataAddress.toString());
console.log("Master Edition:", masterEditionAddress.toString());
console.log("Bot Creator:", botCreatorPublicKey.toString());
console.log("Chat Bot:", chatBotPdaAccount.toString());
console.log("Bot User:", botUserPublicKey.toString());
console.log("Bot User Account :", botUserPdaAccount.toString());

// console.log("Trace 1");
// airDrop();
// console.log("Trace 2");

// register_free_bot();
// register_premium_bot();
register_for_chat();
// make_premium_payment();
// validate_chat_eligibility();

// sleep(5000);
// await register_free_bot();
// await register_premium_bot();
// await register_for_chat();
// await make_premium_payment();
// await validate_chat_eligibility();

async function register_free_bot() {
  await program.rpc.registerFreeBot(
    BOT_ID,
    "Test",
    "TEST",
    "https://arweave.net/Xjqaj_rYYQGrsiTk9JRqpguA813w6NGPikcRyA1vAHM",
    new anchor.BN(10),
    {
      accounts: {
        botCreator: botCreatorPublicKey,
        chatBotAccount: chatBotPdaAccount,
        admin: adminPublicKey,
        metadata: metadataAddress,
        masterEdition: masterEditionAddress,
        mint: mint,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        sysvarInstructions: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
      },
      signers: [botCreatorKeypair, mintKeypair],
    }
  );

  await displayPda();

  //   sleep(2000);
}

async function register_premium_bot() {
  await program.rpc.registerPremiumBot(
    BOT_ID,
    "Test",
    "TEST",
    "https://arweave.net/Xjqaj_rYYQGrsiTk9JRqpguA813w6NGPikcRyA1vAHM",
    new anchor.BN(10),
    new anchor.BN(0.01 * LAMPORTS_PER_SOL),
    {
      accounts: {
        botCreator: botCreatorPublicKey,
        chatBotAccount: chatBotPdaAccount,
        admin: adminPublicKey,
        metadata: metadataAddress,
        masterEdition: masterEditionAddress,
        mint: mint,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        sysvarInstructions: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
      },
      signers: [botCreatorKeypair, mintKeypair],
    }
  );

  await displayPda();

  //   sleep(2000);
}

async function register_for_chat() {
  // const botUserTokenAccount = await getTokenAccount(mint, botUserPublicKey);
  const botUserTokenAccount = await getAssociatedTokenAddress(
    mint,
    botUserPublicKey
  );
  console.log("ATA: ", botUserTokenAccount.toString());
  await program.rpc.registerForChat(BOT_ID, {
    accounts: {
      botUser: botUserPublicKey,
      botUserAccount: botUserPdaAccount,
      chatBotAccount: chatBotPdaAccount,
      botCreator: botCreatorPublicKey,
      tokenAccount: botUserTokenAccount,
      admin: adminPublicKey,
      metadata: metadataAddress,
      masterEdition: masterEditionAddress,
      mint: mint,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      ataProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      sysvarInstructions: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
    },
    signers: [botUserKeypair, mintKeypair],
  });

  await displayPda();
  await displayBotUserPda();

  //   sleep(2000);
}

async function make_premium_payment() {
  await program.rpc.makePremiumPayment(BOT_ID, {
    accounts: {
      botUser: botUserPublicKey,
      botUserAccount: botUserPdaAccount,
      chatBotAccount: chatBotPdaAccount,
      botCreator: botCreatorPublicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
    signers: [botUserKeypair],
  });

  await displayPda();
  await displayBotUserPda();

  //   sleep(2000);
}

async function validate_chat_eligibility() {
  await program.rpc.validateChatEligibility(BOT_ID, {
    accounts: {
      botUser: botUserPublicKey,
      botUserAccount: botUserPdaAccount,
      chatBotAccount: chatBotPdaAccount,
      botCreator: botCreatorPublicKey,
    },
  });

  await displayPda();
  await displayBotUserPda();

  //   sleep(2000);
}

function getChatBotPdaAccount(
  bot_id: string,
  userPublicKey: anchor.web3.PublicKey
) {
  const [pdaPublicKey, _] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("chat_bot"),
      anchor.utils.bytes.utf8.encode(bot_id),
      userPublicKey.toBuffer(),
    ],
    programId
  );
  return pdaPublicKey;
}

function getBotUserPdaAccount(
  bot_id: string,
  userPublicKey: anchor.web3.PublicKey
) {
  const [pdaPublicKey, _] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("bot_user"),
      anchor.utils.bytes.utf8.encode(bot_id),
      userPublicKey.toBuffer(),
    ],
    programId
  );
  return pdaPublicKey;
}

function getMetadataPdaAccount(mintPublicKey: anchor.web3.PublicKey) {
  const [_pdaPublicKey, bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("metadata"),
      programId.toBuffer(),
      mintPublicKey.toBuffer(),
    ],
    programId
  );
  const pdaPublicKey = anchor.web3.PublicKey.createProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("metadata"),
      programId.toBuffer(),
      mintPublicKey.toBuffer(),
      Buffer.from([bump]),
    ],
    programId
  );
  return pdaPublicKey;
}

function getConnection() {
  const connection = new anchor.web3.Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );
  return connection;
}

function getProgram(playGround: Boolean = false) {
  if (!playGround) {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    const program = anchor.workspace.Solplay as anchor.Program<Solplay>;
    return program;
  } else {
    return pg.program;
  }
}

function getAdminKeypair(playGround: Boolean = false) {
  if (!playGround) {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    return provider.wallet;
  } else {
    return pg.wallet.keypair;
  }
}

function getProgramId(playGround: Boolean = false) {
  if (!playGround) {
    return new anchor.web3.PublicKey(
      "GqdmkZC5nqG8czabLKATHUJYVWkejqnZM2auAHUY6321"
    );
  } else {
    return pg.PROGRAM_ID;
  }
}

async function getTokenAccount(tokenMint: PublicKey, addr: PublicKey) {
  // const TOKEN_MINT = new anchor.web3.PublicKey(TOKEN_MINT_ADDRESS);
  const tokenList = await connection.getTokenAccountsByOwner(addr, {
    mint: tokenMint,
  });

  let paymentTokenAccount = null;
  if (tokenList.value.length > 0) {
    const usdcTokenAccount = tokenList.value[0];
    paymentTokenAccount = usdcTokenAccount.pubkey;
  } else {
    // Create associated token accounts for the new accounts
    // paymentTokenAccount = await createAssociatedTokenAccount(
    //   program.provider.connection,
    //   adminKeypair,
    //   tokenMint,
    //   addr
    // );
  }
  return paymentTokenAccount;
}

async function displayPda() {
  const chat_bot_account = await program.account.chatBot.fetch(
    chatBotPdaAccount
  );
  console.log(
    `(botId:${chat_bot_account.botId.toString()},admin:${chat_bot_account.admin.toString()},creator:${chat_bot_account.creator.toString()},mints:${chat_bot_account.mints.toString()},premium:${chat_bot_account.premium.toString()})`
  );

  console.log(
    "Admin Balance       : ",
    await connection.getBalance(adminPublicKey)
  );
  console.log(
    "Bot Creator Balance : ",
    await connection.getBalance(botCreatorPublicKey)
  );
  console.log(
    "Bot User Balance    : ",
    await connection.getBalance(botUserPublicKey)
  );
}

async function displayBotUserPda() {
  const bot_user_account = await program.account.botUser.fetch(
    botUserPdaAccount
  );
  console.log(`(expiration:${bot_user_account.expiration.toString()})`);
}

async function airDrop() {
  const tx = await anchor.web3.sendAndConfirmTransaction(
    connection,
    new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.transfer({
        fromPubkey: adminPublicKey,
        toPubkey: botCreatorPublicKey,
        lamports: 0.12 * LAMPORTS_PER_SOL,
      })
    ),
    []
    // [adminKeypair]
  );

  // await anchor.web3.sendAndConfirmTransaction(
  //   connection,
  //   new anchor.web3.Transaction().add(
  //     anchor.web3.SystemProgram.transfer({
  //       fromPubkey: adminPublicKey,
  //       toPubkey: botUserPublicKey,
  //       lamports: 0.03 * LAMPORTS_PER_SOL,
  //     })
  //   ),
  //   []
  //   // [adminKeypair]
  // );
}
