import * as anchor from "@project-serum/anchor";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {
  createTransferInstruction,
  createAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

const connection = new web3.Connection(
  "https://api.devnet.solana.com",
  "confirmed"
);

const TOKEN_MINT_ADDRESS = "ExwSdKk455aTyJ6poApJ4gVCrS57vyexGDDc6qeGGPob";

const adminKeypair = pg.wallet.keypair;
const adminPublicKey = adminKeypair.publicKey;
const program = pg.program;

// Get the secret key in string format
// const secretKeyHexString = Buffer.from(admin.keypair.secretKey).toString("hex");
// console.log("Secret Key:", secretKeyHexString);

// const secretKey = new Uint8Array([
//   218, 61, 181, 179, 3, 125, 90, 34, 71, 79, 79, 220, 110, 30, 129, 196, 30,
//   235, 77, 160, 0, 61, 139, 197, 146, 63, 224, 101, 130, 250, 211, 167, 186,
//   152, 192, 121, 11, 56, 99, 205, 138, 248, 125, 218, 183, 154, 30, 28, 236,
//   219, 221, 205, 72, 219, 114, 22, 50, 8, 165, 16, 134, 114, 169, 139,
// ]);
// const payer = web3.Keypair.fromSecretKey(secretKey);

const depositAmount = new anchor.BN(1 * LAMPORTS_PER_SOL);

const botCreatorKeypair = anchor.web3.Keypair.generate();
const botCreatorPublicKey = botCreatorKeypair.publicKey;
// var airdropSignature = await connection.requestAirdrop(
//       botCreatorPublicKey,
//       web3.LAMPORTS_PER_SOL,
//     );
// await connection.confirmTransaction(airdropSignature);
await anchor.web3.sendAndConfirmTransaction(
  connection,
  new anchor.web3.Transaction().add(
    anchor.web3.SystemProgram.transfer({
      fromPubkey: adminPublicKey,
      toPubkey: botCreatorPublicKey,
      lamports: 0.12 * LAMPORTS_PER_SOL,
    })
  ),
  [adminKeypair]
);

const botUserKeypair = anchor.web3.Keypair.generate();
const botUserPublicKey = botUserKeypair.publicKey;
// var airdropSignature = await connection.requestAirdrop(
//       botUserPublicKey,
//       web3.LAMPORTS_PER_SOL,
//     );
// await connection.confirmTransaction(airdropSignature);
await anchor.web3.sendAndConfirmTransaction(
  connection,
  new anchor.web3.Transaction().add(
    anchor.web3.SystemProgram.transfer({
      fromPubkey: adminPublicKey,
      toPubkey: botUserPublicKey,
      lamports: 0.03 * LAMPORTS_PER_SOL,
    })
  ),
  [adminKeypair]
);

const chatBotPdaAccount = getChatBotPdaAccount("1", botCreatorPublicKey);
const botUserPdaAccount = getBotUserPdaAccount("1", botUserPublicKey);
sleep(5000);
// console.log("Trace 1")
// await register_free_bot();
await register_premium_bot();
// console.log("Trace 2")
await register_for_chat();
// console.log("Trace 3")
await make_premium_payment();
// console.log("Trace 4")
await validate_chat_eligibility();
// console.log("Trace 5")

async function register_free_bot() {
  await program.rpc.registerFreeBot("1", new anchor.BN(10), {
    accounts: {
      botCreator: botCreatorPublicKey,
      chatBotAccount: chatBotPdaAccount,
      admin: adminPublicKey,
      systemProgram: web3.SystemProgram.programId,
    },
    signers: [adminKeypair, botCreatorKeypair],
  });

  await displayPda();

  sleep(2000);
}

async function register_premium_bot() {
  await program.rpc.registerPremiumBot(
    "1",
    new anchor.BN(10),
    new anchor.BN(0.01 * LAMPORTS_PER_SOL),
    {
      accounts: {
        botCreator: botCreatorPublicKey,
        chatBotAccount: chatBotPdaAccount,
        admin: adminPublicKey,
        systemProgram: web3.SystemProgram.programId,
      },
      signers: [adminKeypair, botCreatorKeypair],
    }
  );

  await displayPda();

  sleep(2000);
}

async function register_for_chat() {
  await program.rpc.registerForChat("1", {
    accounts: {
      botUser: botUserPublicKey,
      botUserAccount: botUserPdaAccount,
      chatBotAccount: chatBotPdaAccount,
      botCreator: botCreatorPublicKey,
      systemProgram: web3.SystemProgram.programId,
    },
    signers: [botUserKeypair],
  });

  await displayPda();
  await displayBotUserPda();

  sleep(2000);
}

async function make_premium_payment() {
  await program.rpc.makePremiumPayment("1", {
    accounts: {
      botUser: botUserPublicKey,
      botUserAccount: botUserPdaAccount,
      chatBotAccount: chatBotPdaAccount,
      botCreator: botCreatorPublicKey,
      systemProgram: web3.SystemProgram.programId,
    },
    signers: [botUserKeypair],
  });

  await displayPda();
  await displayBotUserPda();

  sleep(2000);
}

async function validate_chat_eligibility() {
  await program.rpc.validateChatEligibility("1", {
    accounts: {
      botUser: botUserPublicKey,
      botUserAccount: botUserPdaAccount,
      chatBotAccount: chatBotPdaAccount,
      botCreator: botCreatorPublicKey,
    },
  });

  await displayPda();
  await displayBotUserPda();

  sleep(2000);
}

function getChatBotPdaAccount(
  bot_id: string,
  userPublicKey: anchor.web3.PublicKey
) {
  const programId = getProgramId();
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
  const programId = getProgramId();
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

function getProgramId() {
  return pg.PROGRAM_ID;
}

async function getTokenAccount(addr: PublicKey) {
  const TOKEN_MINT = new web3.PublicKey(TOKEN_MINT_ADDRESS);
  const tokenList = await connection.getTokenAccountsByOwner(
    new web3.PublicKey(addr),
    { mint: TOKEN_MINT }
  );

  let paymentTokenAccount = null;
  if (tokenList.value.length > 0) {
    const usdcTokenAccount = tokenList.value[0];
    paymentTokenAccount = usdcTokenAccount.pubkey;
  } else {
    // Create associated token accounts for the new accounts
    paymentTokenAccount = await createAssociatedTokenAccount(
      program.provider.connection,
      admin.keypair,
      TOKEN_MINT,
      addr
    );
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
