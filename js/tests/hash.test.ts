import { describe, expect, beforeAll, it, jest } from "@jest/globals";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { HashTestContract } from "../src/HashTest";
import {
  getInitialTestAccountsWallets,
  createAccount,
} from "@aztec/accounts/testing";
import {
  AccountWalletWithSecretKey,
  AztecAddress,
  AztecAddressLike,
  EventType,
  ExtendedNote,
  Fr,
  FunctionCall,
  Note,
  PXE,
  TxExecutionRequest,
  TxHash,
  computeSecretHash,
  createDebugLogger,
  createPXEClient,
} from "@aztec/aztec.js";
import { generateEmailVerifierInputs } from "@zk-email/zkemail-nr";
import { breakIntoCapsules, makePreimage, padZeroes } from "./utils";
import * as crypto from 'crypto';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const email = readFileSync(join(__dirname, "./linode_sep.eml"));

const PXE_URL = "http://localhost:8080";

describe("Test deposit to zimburse", () => {
  let pxe: PXE;
  let account: AccountWalletWithSecretKey;
  jest.setTimeout(1000000);
  let instance: HashTestContract;
  beforeAll(async () => {
    pxe = await createPXEClient(PXE_URL);
    // account = await createAccount(pxe);
    account = (await getInitialTestAccountsWallets(pxe))[0];
    instance = await HashTestContract.deploy(account).send().deployed();
  });

  it("Attempt to load PXE", async () => {
    // parameters for hashing
    const dataLength = 50129;  //53248
    const chunkLength = 2048;
    
    // load capsules into pxe
    const preimage = makePreimage(dataLength);
    const capsules = breakIntoCapsules(preimage, 53248, chunkLength);
    for (const capsule of capsules) {
      await account.addCapsule(capsule);
    }
    // attempt to hash
    const start = Date.now();
    await instance.methods.hash(preimage.length).send().wait();
    
    // check hash output
    const storedHash = await instance.methods.get_hash(preimage.length).simulate();
    console.log("end", Date.now() - start);
    const hashParsed = Buffer.from(storedHash.map((x: bigint) => Number(x))).toString('hex');
    console.log("Stored hash: ", hashParsed);

    const buffer = Buffer.from(preimage);
    const expectedHash = crypto.createHash('sha256').update(buffer).digest('hex');
    console.log("Expected hash: ", expectedHash);
    expect(hashParsed).toBe(expectedHash);
  })

  xit("Fake Hash", async () => {
    const data: number[] = [];
    for (let i = 0; i < 191; i++)
      data.push(i % 256);
    const padded = padZeroes(data, 512);
    const hash = await instance.methods.hash_demo(padded, 191 ).simulate();
    const hashParsed = Buffer.from(hash.map((x: bigint) => Number(x))).toString('hex');
    console.log("Hash from contract: ", hashParsed);
    const buffer = Buffer.from(data);
    const expectedHash = crypto.createHash('sha256').update(buffer).digest('hex');
    expect(hashParsed).toBe(expectedHash);
  })  
});