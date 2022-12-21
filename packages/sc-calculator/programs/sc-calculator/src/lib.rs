use anchor_lang::prelude::*;

declare_id!("7ATMSJ1J7qop76bFuK7bfeeKmx94ogPprx4WZC4KMKhM");

#[program]
pub mod sc_calculator {
    use super::*;

    pub fn initialize(ctx: Context<IncrementPlatform>) -> Result<()> {
        let increment: &mut Account<Increment> = &mut ctx.accounts.increment;

        increment.value = 0;

        msg!(
            "Initialized increment platform with value {}",
            increment.value
        );

        Ok(())
    }

    pub fn increment(ctx: Context<IncrementNow>) -> Result<()> {
        let increment: &mut Account<Increment> = &mut ctx.accounts.increment;

        increment.value += 1;

        msg!(
            "Incremented increment platform with value {}",
            increment.value
        );

        Ok(())
    }

    pub fn decrement(ctx: Context<IncrementPlatform>) -> Result<()> {
        let increment: &mut Account<Increment> = &mut ctx.accounts.increment;

        increment.value -= 1;

        msg!(
            "Decremented increment platform with value {}",
            increment.value
        );

        Ok(())
    }
}

#[derive(Accounts)]
pub struct IncrementPlatform<'info> {
    #[account(init,payer=user,space=8+32)]
    pub increment: Account<'info, Increment>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct IncrementNow<'info> {
    #[account(mut)]
    pub increment: Account<'info, Increment>,
}

#[account]
pub struct Increment {
    pub value: u64,
}
