use aztec::macros::aztec;

mod capsule;
mod hash_store;

global MAX_CHUNK_LENGTH: u32 = 2048;


unconstrained pub fn last_chunk_len(len: u32) -> u32 {
    // determine how many chunks are available
    let chunks = len / MAX_CHUNK_LENGTH;
    
    // determine if there is a remainder
    let remainder = len % MAX_CHUNK_LENGTH;

    let mut length = 0;
    if remainder == 0 {
        length = MAX_CHUNK_LENGTH;
    } else {
        length = remainder;
    }
    length
}

#[aztec]
contract HashTest {
     use aztec::{
        macros::{
            storage::storage,
            events::event,
            functions::{private, public, internal, view, initializer}
        },
        note::constants::MAX_NOTES_PER_PAGE,
        oracle::{random::random, debug_log::debug_log_format},
        prelude::{AztecAddress, Map, SharedImmutable},
        protocol_types::traits::Serialize,
    };
    use zkemail::partial_hash::{
        partial_sha256_var_start,
        partial_sha256_var_interstitial,
        partial_sha256_var_end
    };
    use crate::{
        MAX_CHUNK_LENGTH,
        capsule::{pop_capsule, to_u8},
        hash_store::HashStore,
        last_chunk_len
    };
    use std::hash::sha256_var;

    #[storage]
    struct Storage<Context> {
        hash_store: Map<u32, SharedImmutable<HashStore, Context>, Context>
    }

    #[public]
    #[initializer]
    fn constructor() {}

    #[private]
    fn hash(len: u32) {
        // start hash
        let data = to_u8(pop_capsule::<MAX_CHUNK_LENGTH>());
        debug_log_format("\n\n\n\n========START HASH========\nFirst Byte: {0}\nSecond Byte: {1}\nThird Byte: {2}\nFourth Byte: {3}\nFifth Byte: {4}\nLENGTH: {5}", [
            data[0] as Field,
            data[1] as Field,
            data[2] as Field,
            data[3] as Field,
            data[4] as Field,
            len as Field
        ]);
        let partial_hash = partial_sha256_var_start(data);
        // call interstitial hashes
        let interstitial_hash = HashTest::at(context.this_address()).
            hash_interstitial(partial_hash, len, 1)
            .call(&mut context);
        // call end hash
        let final_hash = HashTest::at(context.this_address())
            .hash_end(interstitial_hash, len)
            .call(&mut context);
        
        // debug_log_format("\n\n\n\n\nFINAL HASH: [{0}, {1}, {2}, ...]\n\n\n\n\n", [
        //     final_hash[0] as Field,
        //     final_hash[1] as Field,
        //     final_hash[2] as Field
        // ]);
        // assert(final_hash == EXPECTED_HASH_SHORT, "Hash does not match expected hash");

        HashTest::at(context.this_address())
            .set_hash(len, final_hash)
            .enqueue(&mut context);
    }

    #[private]
    #[internal]
    fn hash_interstitial(state: [u32; 8], len: u32, chunk: u32) -> [u32; 8] {
        // get chunk from capsule oracle and convert to u8 (unconstrained, hash check will deal with it)
        let data = to_u8(pop_capsule::<MAX_CHUNK_LENGTH>());

        // compute interstitial hash
        let mut interstitial_hash = partial_sha256_var_interstitial(state, data, MAX_CHUNK_LENGTH);
        
        // call next interstitial hash if there is more data
        let index = chunk * MAX_CHUNK_LENGTH;
        debug_log_format("\n\n\n\n\nCHUNK #{0}, index: {1}\n\n\n\n\n", [chunk as Field, index as Field]);
        if index + (2 * MAX_CHUNK_LENGTH) < len {
            interstitial_hash = HashTest::at(context.this_address())
                .hash_interstitial(interstitial_hash, len, chunk + 1)
                .call(&mut context);
        }
        
        // return interstitial hash
        interstitial_hash
    }

    #[private]
    #[internal]
    fn hash_end(state: [u32; 8], len: u32) -> [u8; 32] {
        // get chunk from capsule oracle and convert to u8 (unconstrained, hash check will deal with it)
        let data = to_u8(pop_capsule::<MAX_CHUNK_LENGTH>());
        debug_log_format("\n\n\n\n========END HASH========\nFirst Byte: {0}\nSecond Byte: {1}\nThird Byte: {2}\nFourth Byte: {3}\nFifth Byte: {4}", [
            data[0] as Field,
            data[1] as Field,
            data[2] as Field,
            data[3] as Field,
            data[4] as Field
        ]);
        // determine last block length
        let last_block_len = unsafe { last_chunk_len(len) };
        debug_log_format("\n\n\n\n========END HASH DATA========\nlast len: {0}\nfull len: {1}\nMAX_CHUNK_LENGTH: {2}", [
            len as Field,
            last_block_len as Field,
            MAX_CHUNK_LENGTH as Field
        ]);
        // compute final hash
        let final_hash = partial_sha256_var_end(state, data, last_block_len as u64, len as u64);
        final_hash
    }

    #[public]
    #[internal]
    fn set_hash(len: u32, hash: [u8; 32]) {
        storage.hash_store.at(len).initialize(HashStore { hash });
    }

    unconstrained pub fn get_hash(at: u32) -> [u8; 32] {
        storage.hash_store.at(at).read_public().hash
    }

    unconstrained pub fn hash_demo(data: [u8; 512], length: u64) -> [u8; 32] {
        sha256_var(data, length)
    }
}