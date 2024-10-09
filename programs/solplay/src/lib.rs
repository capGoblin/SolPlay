use anchor_lang::prelude::*;
use anchor_spl::token::Token;
// use anchor_spl::associated_token::AssociatedToken;
// use mpl_token_metadata::accounts::MasterEdition;
// use mpl_token_metadata::accounts::Metadata;
// use mpl_token_metadata::metadata;
// use anchor_spl::metadata::Metadata as Metaplex;
// use mpl_token_metadata::errors::MplTokenMetadataError;
// use mpl_token_metadata::instructions::CreateCpiBuilder;
use mpl_token_metadata::instructions::CreateV1CpiBuilder;
use mpl_token_metadata::instructions::MintV1CpiBuilder;
use mpl_token_metadata::types::{TokenStandard, PrintSupply, Creator};
// use solana_program::system_program;
// use anchor_spl::{
//     associated_token::AssociatedToken,
//     metadata::{
//         create_metadata_accounts_v3, mpl_token_metadata::types::DataV2, CreateMetadataAccountsV3,
//         Metadata as Metaplex,
//     },
//     token::{mint_to, Mint, MintTo, Token, TokenAccount},
// };

use std::mem::size_of;

declare_id!("GqdmkZC5nqG8czabLKATHUJYVWkejqnZM2auAHUY6321");

// const PLATFORM_FEE: u64 = 1_000_000_000;
const PLATFORM_FEE: u64 = 10_000_000;
const MONTH_IN_SECONDS: i64 = 30 * 24 * 60 * 60;

#[program]
pub mod solplay {
    use super::*;

    // Bot creator registering a free bot
    pub fn register_free_bot(
        ctx: Context<RegisterChatBot>,
        bot_id: String,
        name: String,
        symbol: String,
        uri: String,
        mints: u64,
    ) -> Result<()> {
        let chat_bot_account = &mut ctx.accounts.chat_bot_account;
        let admin = &ctx.accounts.admin;
        let bot_creator = &ctx.accounts.bot_creator;

        chat_bot_account.mints = mints;
        chat_bot_account.premium = 0;
        chat_bot_account.admin = admin.key();
        chat_bot_account.creator = bot_creator.key();
        chat_bot_account.bump = ctx.bumps.chat_bot_account;
        chat_bot_account.bot_id = bot_id;

        // Transfer 1 SOL fee to the admin PDA account
        let sol_transfer = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.bot_creator.key(),
            &admin.key(),
            PLATFORM_FEE,
        );
        anchor_lang::solana_program::program::invoke(
            &sol_transfer,
            &[
                ctx.accounts.bot_creator.to_account_info().clone(),
                admin.to_account_info().clone(),
                ctx.accounts.system_program.to_account_info().clone(),
            ],
        )?;

        CreateV1CpiBuilder::new(&ctx.accounts.token_metadata_program)
            .metadata(&ctx.accounts.metadata)
            .master_edition(Some(&ctx.accounts.master_edition))
            .mint(&ctx.accounts.mint.to_account_info(), true)
            .authority(&admin)
            .payer(&bot_creator)
            .update_authority(&bot_creator, true)
            .creators(vec![Creator {
                address: bot_creator.to_account_info().key.to_owned(),
                verified: true,
                share: 100,
            }])
            .name(name)
            .uri(uri)
            .symbol(symbol)
            .token_standard(TokenStandard::FungibleAsset)
            .decimals(0)
            .print_supply(PrintSupply::Limited(mints))
            .seller_fee_basis_points(500)
            .system_program(&ctx.accounts.system_program)
            .spl_token_program(Some(&ctx.accounts.token_program))
            .sysvar_instructions(&ctx.accounts.sysvar_instructions)
            .invoke()?;
        // .invoke_signed(&signer);

        Ok(())
    }

    // Bot creator registering a premium bot
    pub fn register_premium_bot(
        ctx: Context<RegisterChatBot>,
        bot_id: String,
        name: String,
        symbol: String,
        uri: String,
        mints: u64,
        premium: u64,
    ) -> Result<()> {
        let chat_bot_account = &mut ctx.accounts.chat_bot_account;
        let admin = &ctx.accounts.admin;
        let bot_creator = &ctx.accounts.bot_creator;

        chat_bot_account.mints = mints;
        chat_bot_account.premium = premium;
        chat_bot_account.admin = admin.key();
        chat_bot_account.creator = bot_creator.key();
        chat_bot_account.bump = ctx.bumps.chat_bot_account;
        chat_bot_account.bot_id = bot_id;

        // Transfer 1 SOL fee to the admin PDA account
        let admin = &ctx.accounts.admin;

        let sol_transfer = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.bot_creator.key(),
            &admin.key(),
            PLATFORM_FEE,
        );
        anchor_lang::solana_program::program::invoke(
            &sol_transfer,
            &[
                ctx.accounts.bot_creator.to_account_info().clone(),
                admin.to_account_info().clone(),
                ctx.accounts.system_program.to_account_info().clone(),
            ],
        )?;

        CreateV1CpiBuilder::new(&ctx.accounts.token_metadata_program)
            .metadata(&ctx.accounts.metadata)
            .master_edition(Some(&ctx.accounts.master_edition))
            .mint(&ctx.accounts.mint.to_account_info(), true)
            .authority(&admin)
            .payer(&bot_creator)
            .update_authority(&bot_creator, true)
            .creators(vec![Creator {
                address: bot_creator.to_account_info().key.to_owned(),
                verified: true,
                share: 100,
            }])
            .name(name)
            .uri(uri)
            .symbol(symbol)
            .token_standard(TokenStandard::FungibleAsset)
            .decimals(0)
            .print_supply(PrintSupply::Limited(mints))
            .seller_fee_basis_points(500)
            .system_program(&ctx.accounts.system_program)
            .spl_token_program(Some(&ctx.accounts.token_program))
            .sysvar_instructions(&ctx.accounts.sysvar_instructions)
            .invoke()?;
        // .invoke_signed(&signer);

        Ok(())
    }

    // End user registering to chat with bot (first time for premium)
    pub fn register_for_chat(ctx: Context<RegisterForChat>, bot_id: String) -> Result<()> {
        let bot_user_account = &mut ctx.accounts.bot_user_account;
        let chat_bot_account = &ctx.accounts.chat_bot_account;
        // let bot_creator = &mutctx.accounts.bot_creator;

        bot_user_account.bump = ctx.bumps.bot_user_account;

        if chat_bot_account.premium > 0 {
            let premium = chat_bot_account.premium;

            let sol_transfer = anchor_lang::solana_program::system_instruction::transfer(
                &ctx.accounts.bot_user.key(),
                &ctx.accounts.bot_creator.key(),
                premium,
            );
            anchor_lang::solana_program::program::invoke(
                &sol_transfer,
                &[
                    ctx.accounts.bot_user.to_account_info().clone(),
                    ctx.accounts.bot_creator.to_account_info().clone(),
                    ctx.accounts.system_program.to_account_info().clone(),
                ],
            )?;

            bot_user_account.expiration = Clock::get()?.unix_timestamp + MONTH_IN_SECONDS; // 30 days from now
        } else {
            bot_user_account.expiration = 0;
        }

        MintV1CpiBuilder::new(&ctx.accounts.token_metadata_program)
            .metadata(&ctx.accounts.metadata)
            .master_edition(Some(&ctx.accounts.master_edition))
            .mint(&ctx.accounts.mint.to_account_info())
            .authority(&ctx.accounts.admin)
            .payer(&ctx.accounts.bot_user)
            .token(&ctx.accounts.token_account)
            .token_owner(Some(&ctx.accounts.bot_user))
            .system_program(&ctx.accounts.system_program)
            .spl_token_program(&ctx.accounts.token_program)
            .spl_ata_program(&ctx.accounts.ata_program)
            .sysvar_instructions(&ctx.accounts.sysvar_instructions)
            .invoke()?;

        Ok(())
    }

    // End user makes monthly premium payment
    pub fn make_premium_payment(ctx: Context<MakePremiumPayment>, bot_id: String) -> Result<()> {
        let bot_user_account = &mut ctx.accounts.bot_user_account;
        let chat_bot_account = &ctx.accounts.chat_bot_account;

        require!(chat_bot_account.premium > 0, ErrorCode::NotPremiumBot);

        // Transfer premium amount directly to the bot creator
        let premium = chat_bot_account.premium;

        let sol_transfer = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.bot_user.key(),
            &ctx.accounts.bot_creator.key(),
            premium,
        );
        anchor_lang::solana_program::program::invoke(
            &sol_transfer,
            &[
                ctx.accounts.bot_user.to_account_info().clone(),
                ctx.accounts.bot_creator.to_account_info().clone(),
                ctx.accounts.system_program.to_account_info().clone(),
            ],
        )?;

        // Extend the premium expiration by 30 days
        bot_user_account.expiration += MONTH_IN_SECONDS;

        Ok(())
    }

    // Public function to validate chat eligibility
    pub fn validate_chat_eligibility(
        ctx: Context<ValidateChatEligibility>,
        bot_id: String,
    ) -> Result<()> {
        let bot_user_account = &ctx.accounts.bot_user_account;
        let chat_bot_account = &ctx.accounts.chat_bot_account;

        if chat_bot_account.premium > 0 {
            require!(
                Clock::get()?.unix_timestamp < bot_user_account.expiration,
                ErrorCode::PremiumExpired
            );
        }

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(bot_id: String)]
pub struct RegisterChatBot<'info> {
    #[account(mut)]
    pub bot_creator: Signer<'info>,
    #[account(
        init,
        payer = bot_creator,
        space = size_of::<ChatBot>() + 8, // Adjust space according to the needed fields
        seeds = [b"chat_bot", bot_id.as_bytes().as_ref(), bot_creator.key().as_ref()],
        bump,
    )]
    pub chat_bot_account: Account<'info, ChatBot>,
    // #[account(signer)]
    pub admin: Signer<'info>,
    #[account(mut)]
    /// CHECK: UncheckedAccount
    pub metadata: UncheckedAccount<'info>,
    #[account(mut)]
    /// CHECK: UncheckedAccount
    pub master_edition: UncheckedAccount<'info>,
    /// CHECK: Checking in program
    #[account(mut)]
    pub mint: Signer<'info>,
    // pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    /// CHECK: Metaplex will check this
    pub token_metadata_program: UncheckedAccount<'info>,
    /// CHECK: Metaplex will check this
    pub sysvar_instructions: AccountInfo<'info>,
}

#[derive(Accounts)]
#[instruction(bot_id: String)]
pub struct RegisterForChat<'info> {
    #[account(
        init,
        payer = bot_user,
        space = size_of::<BotUser>() + 8, // Adjust space according to the needed fields
        seeds = [b"bot_user", bot_id.as_bytes().as_ref(), bot_user.key().as_ref()],
        bump,
    )]
    pub bot_user_account: Account<'info, BotUser>,
    #[account(mut)]
    pub bot_user: Signer<'info>,
    #[account(
        seeds = [b"chat_bot", bot_id.as_bytes().as_ref(), bot_creator.key().as_ref()],
        bump = chat_bot_account.bump,
    )]
    pub chat_bot_account: Account<'info, ChatBot>,
    /// CHECK: 
    #[account(mut)]
    pub bot_creator: AccountInfo<'info>,
    pub admin: Signer<'info>,
    /// CHECK: 
    #[account(mut)]
    pub token_account: AccountInfo<'info>,
    #[account(mut)]
    /// CHECK: UncheckedAccount
    pub metadata: UncheckedAccount<'info>,
    #[account(mut)]
    /// CHECK: UncheckedAccount
    pub master_edition: UncheckedAccount<'info>,
    #[account(mut)]
    pub mint: Signer<'info>,
    // pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    /// CHECK: Metaplex will check this
    pub ata_program: UncheckedAccount<'info>,
    /// CHECK: Metaplex will check this
    pub token_metadata_program: UncheckedAccount<'info>,
    /// CHECK: Metaplex will check this
    pub sysvar_instructions: AccountInfo<'info>,
}

#[derive(Accounts)]
#[instruction(bot_id: String)]
pub struct MakePremiumPayment<'info> {
    #[account(
        mut,
        seeds = [b"bot_user", bot_id.as_bytes().as_ref(), bot_user.key().as_ref()],
        bump = bot_user_account.bump,
    )]
    pub bot_user_account: Account<'info, BotUser>,
    #[account(mut)]
    pub bot_user: Signer<'info>,
    #[account(
        seeds = [b"chat_bot", bot_id.as_bytes().as_ref(), bot_creator.key().as_ref()],
        bump = chat_bot_account.bump,
    )]
    pub chat_bot_account: Account<'info, ChatBot>,
    /// CHECK: 
    #[account(mut)]
    pub bot_creator: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(bot_id: String)]
pub struct ValidateChatEligibility<'info> {
    #[account(
        seeds = [b"bot_user", bot_id.as_bytes().as_ref(), bot_user.key().as_ref()],
        bump = bot_user_account.bump,
    )]
    pub bot_user_account: Account<'info, BotUser>,
    /// CHECK: 
    pub bot_user: AccountInfo<'info>,
    #[account(
        seeds = [b"chat_bot", bot_id.as_bytes().as_ref(), bot_creator.key().as_ref()],
        bump = chat_bot_account.bump,
    )]
    pub chat_bot_account: Account<'info, ChatBot>,
    /// CHECK: 
    pub bot_creator: AccountInfo<'info>,
}

#[account]
pub struct ChatBot {
    pub bot_id: String,
    pub admin: Pubkey,
    pub creator: Pubkey,
    pub mints: u64,
    pub premium: u64,
    pub bump: u8,
}

#[account]
pub struct BotUser {
    pub expiration: i64, // Timestamp when premium expires (0 if not premium)
    pub bump: u8,
}

#[error_code]
pub enum ErrorCode {
    #[msg("This bot is not a premium bot.")]
    NotPremiumBot,
    #[msg("Premium subscription has expired.")]
    PremiumExpired,
}
