import { Keypair } from '@solana/web3.js'
import fs from 'fs'


export function createKeypairFromFile(
    filePath: string,
): Keypair {
    const secretKeyString = fs.readFileSync(filePath, 'utf8') as string
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString))
    return Keypair.fromSecretKey(secretKey);
}
