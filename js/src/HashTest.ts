
/* Autogenerated file, do not edit! */

/* eslint-disable */
import {
  type AbiType,
  AztecAddress,
  type AztecAddressLike,
  CompleteAddress,
  Contract,
  type ContractArtifact,
  ContractBase,
  ContractFunctionInteraction,
  type ContractInstanceWithAddress,
  type ContractMethod,
  type ContractStorageLayout,
  type ContractNotes,
  decodeFromAbi,
  DeployMethod,
  EthAddress,
  type EthAddressLike,
  EventSelector,
  type FieldLike,
  Fr,
  type FunctionSelectorLike,
  L1EventPayload,
  loadContractArtifact,
  type NoirCompiledContract,
  NoteSelector,
  Point,
  type PublicKey,
  type UnencryptedL2Log,
  type Wallet,
  type WrappedFieldLike,
} from '@aztec/aztec.js';
import HashTestContractArtifactJson from '../../target/hash_test-HashTest.json' assert { type: 'json' };
export const HashTestContractArtifact = loadContractArtifact(HashTestContractArtifactJson as NoirCompiledContract);



/**
 * Type-safe interface for contract HashTest;
 */
export class HashTestContract extends ContractBase {
  
  private constructor(
    instance: ContractInstanceWithAddress,
    wallet: Wallet,
  ) {
    super(instance, HashTestContractArtifact, wallet);
  }
  

  
  /**
   * Creates a contract instance.
   * @param address - The deployed contract's address.
   * @param wallet - The wallet to use when interacting with the contract.
   * @returns A promise that resolves to a new Contract instance.
   */
  public static async at(
    address: AztecAddress,
    wallet: Wallet,
  ) {
    return Contract.at(address, HashTestContract.artifact, wallet) as Promise<HashTestContract>;
  }

  
  /**
   * Creates a tx to deploy a new instance of this contract.
   */
  public static deploy(wallet: Wallet, ) {
    return new DeployMethod<HashTestContract>(Fr.ZERO, wallet, HashTestContractArtifact, HashTestContract.at, Array.from(arguments).slice(1));
  }

  /**
   * Creates a tx to deploy a new instance of this contract using the specified public keys hash to derive the address.
   */
  public static deployWithPublicKeysHash(publicKeysHash: Fr, wallet: Wallet, ) {
    return new DeployMethod<HashTestContract>(publicKeysHash, wallet, HashTestContractArtifact, HashTestContract.at, Array.from(arguments).slice(2));
  }

  /**
   * Creates a tx to deploy a new instance of this contract using the specified constructor method.
   */
  public static deployWithOpts<M extends keyof HashTestContract['methods']>(
    opts: { publicKeysHash?: Fr; method?: M; wallet: Wallet },
    ...args: Parameters<HashTestContract['methods'][M]>
  ) {
    return new DeployMethod<HashTestContract>(
      opts.publicKeysHash ?? Fr.ZERO,
      opts.wallet,
      HashTestContractArtifact,
      HashTestContract.at,
      Array.from(arguments).slice(1),
      opts.method ?? 'constructor',
    );
  }
  

  
  /**
   * Returns this contract's artifact.
   */
  public static get artifact(): ContractArtifact {
    return HashTestContractArtifact;
  }
  

  public static get storage(): ContractStorageLayout<'hash_store'> {
      return {
        hash_store: {
      slot: new Fr(1n),
    }
      } as ContractStorageLayout<'hash_store'>;
    }
    

  

  /** Type-safe wrappers for the public methods exposed by the contract. */
  public declare methods: {
    
    /** compute_note_hash_and_optionally_a_nullifier(contract_address: struct, nonce: field, storage_slot: field, note_type_id: field, compute_nullifier: boolean, serialized_note: array) */
    compute_note_hash_and_optionally_a_nullifier: ((contract_address: AztecAddressLike, nonce: FieldLike, storage_slot: FieldLike, note_type_id: FieldLike, compute_nullifier: boolean, serialized_note: FieldLike[]) => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;

    /** constructor() */
    constructor: (() => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;

    /** get_hash() */
    get_hash: (() => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;

    /** hash(len: integer) */
    hash: ((len: (bigint | number)) => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;

    /** hash_demo(data: array, length: integer) */
    hash_demo: ((data: (bigint | number)[], length: (bigint | number)) => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;

    /** public_dispatch(selector: field) */
    public_dispatch: ((selector: FieldLike) => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;
  };

  
}
