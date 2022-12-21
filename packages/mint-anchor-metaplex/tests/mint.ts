import fs from 'fs'
import * as anchor from "@project-serum/anchor";
// ** Comment this to use solpg imported IDL **
import { MintNft } from "../target/types/mint_nft";
import { PublicKey } from '@solana/web3.js';

// ENVS
const rawGithubUri = 'https://raw.githubusercontent.com/viandwi24/mysol/main'


// FUNCS
const getKeypair = (path: string) => {
  const sks = fs.readFileSync(path, 'utf-8')
  const sk = Uint8Array.from(JSON.parse(sks))
  return anchor.web3.Keypair.fromSecretKey(sk)
}


// TESTS
describe("mint-badge", async () => {
  const NftOptions = {
    title: 'Trainer Badges',
    symbol: 'NOKIBADGES',
    uri: `${rawGithubUri}/assets/mysolbadges/metadatas/trainer.json`,
  }

  // set up provider
  const provider = anchor.AnchorProvider.env()
  const wallet = provider.wallet as anchor.Wallet
  anchor.setProvider(provider)

  const buyer = getKeypair(__dirname + '/keypairs/u1.json')
  // const mintAuthority = new PublicKey('9D5vZv9qwBAZ3ufoHa8UUQyLiRvoqpRYRfcdft41wh6M')
  const mintAuthority = wallet.publicKey

  console.log(`Wallet: ${wallet.publicKey.toString()}`)
  console.log(`Buyer: ${buyer.publicKey.toString()}`)
  console.log(`Mint Authority: ${mintAuthority.toString()}`)

  // minted
  let mint: anchor.web3.Keypair | undefined

  // program
  const program = anchor.workspace.MintNft as anchor.Program<MintNft>
  const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  )

  it("minted", async () => {
    // Derive the mint address and the associated token account address
    const mintKeypair: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    const tokenAddress = await anchor.utils.token.associatedAddress({
      mint: mintKeypair.publicKey,
      owner: wallet.publicKey
    });
    console.log(`Mint Keypair: ${mintKeypair.publicKey.toString()}`)
    console.log(`Token Address: ${tokenAddress.toString()}`)
    mint = mintKeypair

    // Derive the metadata and master edition addresses
    const metadataAddress = (await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    ))[0];
    console.log(`Metadata initialized: ${metadataAddress.toString()}`)

    // master edition
    const masterEditionAddress = (await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
        Buffer.from('edition'),
      ],
      TOKEN_METADATA_PROGRAM_ID
    ))[0];
    console.log(`Master edition metadata initialized: ${masterEditionAddress.toString()}`)

    // mint
    await program.methods.mint(
      NftOptions.title,
      NftOptions.symbol,
      NftOptions.uri
    )
      .accounts({
        masterEdition: masterEditionAddress,
        metadata: metadataAddress,
        mint: mintKeypair.publicKey,
        tokenAccount: tokenAddress,
        mintAuthority: mintAuthority,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      })
      .signers([mintKeypair])
      .rpc()
  })

  // it("sell", async () => {
  //   const saleAmount = 1 * anchor.web3.LAMPORTS_PER_SOL
  //   const mintPubKey: anchor.web3.PublicKey = new anchor.web3.PublicKey(
  //     mint.publicKey.toString()
  //   )
  //   console.log(`Mint PubKey: ${mintPubKey.toString()}`)
  //   console.log(`Sale Amount: ${saleAmount}`)
  //   console.log(`Buyer PubKey: ${buyer.publicKey.toString()}`)

  //   // Derive the associated token account address for owner & buyer
  //   const ownerTokenAddress = await anchor.utils.token.associatedAddress({
  //     mint: mintPubKey,
  //     owner: wallet.publicKey
  //   });
  //   const buyerTokenAddress = await anchor.utils.token.associatedAddress({
  //     mint: mintPubKey,
  //     owner: buyer.publicKey,
  //   });
  //   console.log(`Request to sell NFT: ${mintPubKey} for ${saleAmount} lamports.`);
  //   console.log(`Owner's Token Address: ${ownerTokenAddress}`);
  //   console.log(`Buyer's Token Address: ${buyerTokenAddress}`);

  //   // Transact with the "sell" function in our on-chain program
  //   await program.methods.sell(
  //     new anchor.BN(saleAmount)
  //   )
  //     .accounts({
  //       mint: mintPubKey,
  //       ownerTokenAccount: ownerTokenAddress,
  //       ownerAuthority: wallet.publicKey,
  //       buyerTokenAccount: buyerTokenAddress,
  //       buyerAuthority: buyer.publicKey,
  //     })
  //     .signers([buyer])
  //     .rpc()
  // })
})
