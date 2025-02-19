#![no_std]

multiversx_sc::imports!();

#[multiversx_sc::contract]
pub trait Contract {
    #[init]
    fn init(&self) {}

    #[payable("*")]
    #[endpoint]
    fn transfer_received(&self, to: ManagedAddress) {
        let token = self.call_value().egld_or_single_esdt();
        self.send().direct(&to, &token.token_identifier, token.token_nonce, &token.amount);
    }
}
