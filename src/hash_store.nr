use aztec::protocol_types::{address::AztecAddress, traits::{Serialize, Deserialize}, utils::field::field_from_bytes};

global HASH_STORE_LENGTH: u32 = 2;

pub struct HashStore {
    hash: [u8; 32],
}

impl Serialize<HASH_STORE_LENGTH> for HashStore {
    fn serialize(self: Self) -> [Field; HASH_STORE_LENGTH] {
        let mut first: [u8; 16] = [0; 16];
        let mut second: [u8; 16] = [0; 16];
        for i in 0..16 {
            first[i] = self.hash[i];
            second[i] = self.hash[i + 16];
        }
        [
            field_from_bytes(first, true),
            field_from_bytes(second, true)
        ]
    }
}

impl Deserialize<HASH_STORE_LENGTH> for HashStore {
    fn deserialize(fields: [Field; HASH_STORE_LENGTH]) -> Self {
        let mut first: [u8; 16] = fields[0].to_be_bytes();
        let mut second: [u8; 16] = fields[1].to_be_bytes();
        let mut hash: [u8; 32] = [0; 32];
        for i in 0..16 {
            hash[i] = first[i];
            hash[i + 16] = second[i];
        }
        HashStore { hash }
    }
}