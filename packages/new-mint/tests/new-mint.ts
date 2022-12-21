import * as anchor from "@project-serum/anchor"
import { Program } from "@project-serum/anchor"
import { TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, createInitializeMintInstruction, MINT_SIZE } from '@solana/spl-token'
import fs from 'fs'
import path from 'path'
import { NewMint } from "../target/types/new_mint"

// ENVS
const rawGithubUri = 'https://raw.githubusercontent.com/viandwi24/mysol/main'

// FUNCS
const getKeypair = (path: string) => {
  const sks = fs.readFileSync(path, 'utf-8')
  const sk = Uint8Array.from(JSON.parse(sks))
  return anchor.web3.Keypair.fromSecretKey(sk)
}

describe("new-mint", () => {
  // set up provider
  const provider = anchor.AnchorProvider.env()
  const wallet = provider.wallet as anchor.Wallet
  anchor.setProvider(provider)

  // program
  const program = anchor.workspace.NewMint as Program<NewMint>;

  // set
  const updateAuthorityKeypair = getKeypair(path.join(__dirname, '../../../configs/keypairs/u1.json'))

  // program id
  const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );

  // print
  console.log('====================================')
  console.log('Program ID : ', program.programId.toString())
  console.log('Update Authority : ', updateAuthorityKeypair.publicKey.toString())
  console.log('User to mint', wallet.publicKey.toString())
  console.log('Token Metadata Program ID', TOKEN_METADATA_PROGRAM_ID.toString())
  console.log('====================================')

  describe("mint-badge", async () => {
    const NftOptions = {
      title: 'Test 2 Trainer Badges',
      symbol: 'MSBADGES',
      uri: `${rawGithubUri}/assets/mysolbadges/metadatas/trainer.json`,
    }

    // set up provider
    const provider = anchor.AnchorProvider.env()
    const wallet = provider.wallet as anchor.Wallet
    anchor.setProvider(provider)

    const mintAuthorityKeypair = getKeypair(path.join(__dirname, './../../../configs/keypairs/u1.json'))
    // const mintAuthority = new PublicKey('9D5vZv9qwBAZ3ufoHa8UUQyLiRvoqpRYRfcdft41wh6M')
    const mintAuthority = mintAuthorityKeypair.publicKey

    console.log(`Wallet: ${wallet.publicKey.toString()}`)
    console.log(`Authority: ${mintAuthorityKeypair.publicKey.toString()}`)
    console.log(`Mint Authority: ${mintAuthority.toString()}`)

    // minted
    let mint: anchor.web3.Keypair | undefined

    // program
    const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
      "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
    )

    it("minted", async () => {
      try {
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
        await program.methods.mintNft(
          NftOptions.title,
          NftOptions.symbol,
          NftOptions.uri
        )
          .accounts({
            masterEdition: masterEditionAddress,
            metadata: metadataAddress,
            mint: mintKeypair.publicKey,
            tokenAccount: tokenAddress,
            mintAuthority: mintAuthorityKeypair.publicKey,
            payer: wallet.publicKey,
            tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          })
          .signers([mintKeypair, mintAuthorityKeypair])
          .rpc()
      } catch (error) {
        console.error(error)
      }
    })
  })
})
