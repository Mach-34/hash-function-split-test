import { Fr } from "@aztec/circuits.js";

export const MAX_CHUNK_SIZE = 2048;

/**
 * Breaks u8 array into capsules
 * @param data - the data to break into capsules
 * @returns the capsules in order to insert
 */
export function breakIntoCapsules(data: number[], maxLength: number, chunkSize?: number): Fr[][] {
    // pad to maxLength
    data = padZeroes(data, maxLength);
    if (!chunkSize) chunkSize = MAX_CHUNK_SIZE;
    const chunks: Fr[][] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
        // chunks.push(data.slice(i, i + MAX_CHUNK_SIZE).map((x) => parseInt(x)));
        chunks.push(data.slice(i, i + chunkSize).map(x => new Fr(x)));
    }
    return chunks.reverse();
}

export function makePreimage(maxLength: number): number[] {
    const preimage: number[] = [];
    for (let i = 0; i < maxLength; i++) {
        preimage.push(i % 256);
    }
    return preimage;
}

export function padZeroes(data: number[], maxLength: number): number[] {
    if (data.length > maxLength) throw new Error('Data length must be less than maxLength');
    return data.concat(Array(maxLength - data.length).fill(0));
}