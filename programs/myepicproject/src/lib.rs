/* -----Every thing is an account!!! ----*/
use anchor_lang::prelude::*;

declare_id!("9pNVhk76iTkKaei3kGQRsvgY5NiC5dNygwK7sVrhXRQe");

#[program]
pub mod myepicproject {
    use super::*;
    // grab base_account from the StartStuffOff context by doing Context<StartStuffOff>
    pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> ProgramResult {
        // mutable reference to base_account
        let base_account = &mut ctx.accounts.base_account;
        // initialize total_gifs
        base_account.total_gifs = 0;
        Ok(())
    }

    //  grabs base_account which was passed in to the function via Context<AddGif> and increment the counter
    // accepts gif link from user and reference user from the contex
    pub fn add_gif(ctx: Context<AddGif>, gif_link: String) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        let user = &mut ctx.accounts.user;

        // building the struct
        let item = ItemStruct {
            gif_link: gif_link.to_string(),
            user_address: *user.to_account_info().key,
        };

        // adding to gif list vector
        base_account.gif_list.push(item);
        base_account.total_gifs += 1;
        Ok(())
    }
}

// speficify how to init and what to hold in startstuffoff context
#[derive(Accounts)]
pub struct StartStuffOff<'info> {
    #[account(init, payer = user, space = 9000)] // allocate 9kb for rent
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>, // data passed into the program to prove user calling owns it
    pub system_program: Program<'info, System>, // create account on solana
}

// adding signer who calls addgif method to the struct to save
#[derive(Accounts)]
pub struct AddGif<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

// ItemStruct holds a string with a gif link and PubKey with user address
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)] // serialize/deserialize the struct data into binary format before storing it, retrieve=deserialize
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
}
// account BaseAccount holds only an int total_gifs
#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
    // attach a vector which holds an array of ItemStructs
    pub gif_list: Vec<ItemStruct>,
}
