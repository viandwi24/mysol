import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { ScTest } from "../target/types/sc_test";

describe("sc-test", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.ScTest as Program<ScTest>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
