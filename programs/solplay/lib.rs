use anchor_lang::prelude::*;
use std::mem::size_of;

// use anchor_lang::solana_program::system_program;

declare_id!("Br2jNdq8NZa8BQYbPcNXKHaM7MeXUanZe2WLNpSy8fHN");

const PLATFORM_FEE: u64 = 1_000_000_000;
const MONTH_IN_SECONDS: i64 = 30 * 24 * 60 * 60;

#[program]
pub mod solplay {
    use super::*;

    // Bot creator registering a free bot
    pub fn register_free_bot(ctx: Context<RegisterChatBot>, mints: u64, bot_id: String) -> Result<()> {
        let chat_bot_account = &mut ctx.accounts.chat_bot_account;
        let admin = &ctx.accounts.admin;
        
        chat_bot_account.mints = mints;
        chat_bot_account.premium = 0;
        chat_bot_account.admin = admin.key();
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

        Ok(())
    }

    // Bot creator registering a premium bot
    pub fn register_premium_bot(
        ctx: Context<RegisterChatBot>,
        mints: u64,
        premium: u64,
        bot_id: String
    ) -> Result<()> {
        let chat_bot_account = &mut ctx.accounts.chat_bot_account;
        let admin = &ctx.accounts.admin;

        chat_bot_account.mints = mints;
        chat_bot_account.premium = premium;
        chat_bot_account.admin = admin.key();
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

        Ok(())
    }

    // End user registering to chat with bot (first time for premium)
    pub fn register_for_chat(ctx: Context<RegisterForChat>) -> Result<()> {
        let bot_user_account = &mut ctx.accounts.bot_user_account;
        let chat_bot_account = &ctx.accounts.chat_bot_account;

        bot_user_account.bump = ctx.bumps.bot_user_account;

        if chat_bot_account.premium > 0 {
            let premium = chat_bot_account.premium;

            let sol_transfer = anchor_lang::solana_program::system_instruction::transfer(
                &ctx.accounts.bot_user.key(),
                &chat_bot_account.key(),
                premium,
            );
            anchor_lang::solana_program::program::invoke(
                &sol_transfer,
                &[
                    ctx.accounts.bot_user.to_account_info().clone(),
                    chat_bot_account.to_account_info().clone(),
                    ctx.accounts.system_program.to_account_info().clone(),
                ],
            )?;

            bot_user_account.expiration = Clock::get()?.unix_timestamp + MONTH_IN_SECONDS; // 30 days from now
        } else {
            bot_user_account.expiration = 0;
        }

        Ok(())
    }

    // End user makes monthly premium payment
    pub fn make_premium_payment(ctx: Context<MakePremiumPayment>) -> Result<()> {
        let bot_user_account = &mut ctx.accounts.bot_user_account;
        let chat_bot_account = &ctx.accounts.chat_bot_account;

        require!(chat_bot_account.premium > 0, ErrorCode::NotPremiumBot);

        // Transfer premium amount directly to the bot creator
        let premium = chat_bot_account.premium;

        let sol_transfer = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.bot_user.key(),
            &chat_bot_account.key(),
            premium,
        );
        anchor_lang::solana_program::program::invoke(
            &sol_transfer,
            &[
                ctx.accounts.bot_user.to_account_info().clone(),
                chat_bot_account.to_account_info().clone(),
                ctx.accounts.system_program.to_account_info().clone(),
            ],
        )?;

        // Extend the premium expiration by 30 days
        bot_user_account.expiration += MONTH_IN_SECONDS;

        Ok(())
    }

    // Public function to validate chat eligibility
    pub fn validate_chat_eligibility(
        ctx: Context<ValidateChatEligibility>
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
    #[account(signer)]
    pub admin: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(bot_id: String)]
pub struct RegisterForChat<'info> {
    #[account(mut)]
    pub bot_user: Signer<'info>,
    #[account(
        init,
        payer = bot_user,
        space = size_of::<BotUser>() + 8, // Adjust space according to the needed fields
        seeds = [b"bot_user", bot_id.as_bytes().as_ref(), bot_user.key().as_ref()],
        bump,
    )]
    pub bot_user_account: Account<'info, BotUser>,
    pub chat_bot_account: Account<'info, ChatBot>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(bot_id: String)]
pub struct MakePremiumPayment<'info> {
    #[account(mut)]
    pub bot_user: Signer<'info>,
    #[account(
        mut,
        seeds = [b"bot_user", bot_id.as_bytes().as_ref(), bot_user.key().as_ref()],
        bump = bot_user_account.bump,
    )]
    pub bot_user_account: Account<'info, BotUser>,
    pub chat_bot_account: Account<'info, ChatBot>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ValidateChatEligibility<'info> {
    pub bot_user_account: Account<'info, BotUser>,
    pub chat_bot_account: Account<'info, ChatBot>,
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
