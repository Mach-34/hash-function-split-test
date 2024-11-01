#!/bin/bash
aztec-nargo compile --force --silence-warnings

aztec codegen ./target/hash_test-HashTest.json -o ./target/

sed -i "s|./hash_test-HashTest.json|../../target/hash_test-HashTest.json|" target/HashTest.ts

mv target/HashTest.ts js/src/HashTest.ts