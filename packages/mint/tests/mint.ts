import * as anchor from "@project-serum/anchor";
// ** Comment this to use solpg imported IDL **
import { MintNft } from "../target/types/mint_nft";

const rawGithubUri = 'https://raw.githubusercontent.com/viandwi24/mysol/main'

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
        mintAuthority: wallet.publicKey,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      })
      .signers([mintKeypair])
      .rpc()
  })
})
