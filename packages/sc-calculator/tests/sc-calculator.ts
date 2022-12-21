import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { ScCalculator } from "../target/types/sc_calculator";

describe("sc-calculator", () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.ScCalculator as Program<ScCalculator>

  it("Is initialized!", async () => {
    const data = anchor.web3.Keypair.generate()

    // init
    console.log('[1/4] initialize', data.publicKey.toString())
    await program.methods
      .initialize()
      .accounts({
        increment: data.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([data])
      .rpc()

    // increment +1
    console.log('[2/4] increment', data.publicKey.toString())
    await program.methods
      .increment()
      .accounts({
        increment: data.publicKey,
      })
      .rpc()

    // // increment +1
    console.log('[3/4] increment', data.publicKey.toString())
    await program.methods
      .increment()
      .accounts({
        increment: data.publicKey,
      })
      .rpc()


    // // get value
    const account = await program.account.increment.fetch(data.publicKey)
    console.log("[4/4] Value", account.value)


    // Add your test here.
    // const tx = await program.methods.initialize().rpc()
    // console.log("Your transaction signature", tx)
  });
});
