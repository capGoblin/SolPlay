import * as anchor from "@project-serum/anchor";

// const bs58 = require("bs58");
// import * as bs58 from "bs58";
import bs58 from "bs58";

function getAdminKeypair() {
  // const adminPrivateKey = new Buffer(process.env.NEXT_PUBLIC_KEY as string, 'base64').toString('ascii');
  const adminPrivateKey = process.env.NEXT_PUBLIC_ADMIN_PK as string;
  return anchor.web3.Keypair.fromSecretKey(bs58.decode(adminPrivateKey));
}

function getProgramId() {
  return new anchor.web3.PublicKey(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string
  );
}

function getChatBotPdaAccount(
  bot_id: string,
  userPublicKey: anchor.web3.PublicKey
) {
  const programId = getProgramId();
  const [pdaPublicKey, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
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
  const [pdaPublicKey, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("bot_user"),
      anchor.utils.bytes.utf8.encode(bot_id),
      userPublicKey.toBuffer(),
    ],
    programId
  );
  return pdaPublicKey;
}

async function registerFreeBot(
  program: anchor.Program,
  botId: string,
  botCreatorPublicKey: anchor.web3.PublicKey
) {
  const chatBotPdaAccount = getChatBotPdaAccount(botId, botCreatorPublicKey);
  const adminKeypair = getAdminKeypair();
  const adminPublicKey = adminKeypair.publicKey;
  await program.rpc.registerFreeBot(botId, new anchor.BN(10), {
    accounts: {
      botCreator: botCreatorPublicKey,
      chatBotAccount: chatBotPdaAccount,
      admin: adminPublicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
    signers: [adminKeypair],
  });
}

async function registerPremiumBot(
  program: anchor.Program,
  botId: string,
  mints: number,
  premium: number,
  botCreatorPublicKey: anchor.web3.PublicKey
) {
  const chatBotPdaAccount = getChatBotPdaAccount(botId, botCreatorPublicKey);
  const adminKeypair = getAdminKeypair();
  const adminPublicKey = adminKeypair.publicKey;
  await program.rpc.registerPremiumBot(
    botId,
    new anchor.BN(mints),
    new anchor.BN(premium * anchor.web3.LAMPORTS_PER_SOL),
    {
      accounts: {
        botCreator: botCreatorPublicKey,
        chatBotAccount: chatBotPdaAccount,
        admin: adminPublicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [adminKeypair],
    }
  );
}

async function registerForChat(
  program: anchor.Program,
  botId: string,
  botCreatorPublicKey: anchor.web3.PublicKey,
  botUserPublicKey: anchor.web3.PublicKey
) {
  const chatBotPdaAccount = getChatBotPdaAccount(botId, botCreatorPublicKey);
  const botUserPdaAccount = getBotUserPdaAccount(botId, botUserPublicKey);
  await program.rpc.registerForChat(botId, {
    accounts: {
      botUser: botUserPublicKey,
      botUserAccount: botUserPdaAccount,
      chatBotAccount: chatBotPdaAccount,
      botCreator: botCreatorPublicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
    signers: [],
  });
}

async function makePremiumPayment(
  program: anchor.Program,
  botId: string,
  botCreatorPublicKey: anchor.web3.PublicKey,
  botUserPublicKey: anchor.web3.PublicKey
) {
  const chatBotPdaAccount = getChatBotPdaAccount(botId, botCreatorPublicKey);
  const botUserPdaAccount = getBotUserPdaAccount(botId, botUserPublicKey);
  await program.rpc.makePremiumPayment(botId, {
    accounts: {
      botUser: botUserPublicKey,
      botUserAccount: botUserPdaAccount,
      chatBotAccount: chatBotPdaAccount,
      botCreator: botCreatorPublicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
    signers: [],
  });
}

async function validateChatEligibility(
  program: anchor.Program,
  botId: string,
  botCreatorPublicKey: anchor.web3.PublicKey,
  botUserPublicKey: anchor.web3.PublicKey
) {
  const chatBotPdaAccount = getChatBotPdaAccount(botId, botCreatorPublicKey);
  const botUserPdaAccount = getBotUserPdaAccount(botId, botUserPublicKey);
  await program.rpc.validateChatEligibility(botId, {
    accounts: {
      botUser: botUserPublicKey,
      botUserAccount: botUserPdaAccount,
      chatBotAccount: chatBotPdaAccount,
      botCreator: botCreatorPublicKey,
    },
  });
}
