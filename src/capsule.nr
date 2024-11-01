// docs:start:pop_capsule
#[oracle(popCapsule)]
unconstrained fn pop_capsule_oracle<let N: u32>() -> [Field; N] {}

// A capsule is a "blob" of data that is passed to the contract through an oracle.
unconstrained pub fn pop_capsule<let N: u32>() -> [Field; N] {
    pop_capsule_oracle()
}

unconstrained pub fn to_u8<let N: u32>(arr: [Field; N]) -> [u8; N] {
    let mut res: [u8; N] = [0; N];
    for i in 0..N {
        res[i] = arr[i] as u8;
    }
    res
}