# MYSOL
my repo for learning solana, anchor & metaplex

## Links
- https://docs.solana.com/cli/install-solana-cli-tools
- https://book.anchor-lang.com/getting_started/installation.html

# TEST
## Test 1
### Setup
```bash
solana config set --keypair ./configs/keypairs/u1.json --url https://api.devnet.solana.com
```

## Test 2
### Test Mint
```
PROGRAM ID:
7b8Heiw5c2dTcfQQwGELahjaGhGyRVHiMiXpSX3o5vMB

NEW MINTS:
3AUHQtekWmbcbtPCobBZtDFKMMqm4FhBGxw3ipP4JnaD
8dct6JxsVXxpwqeqntpRhWmJWAvZo3jBUgZNFw6D2wZJ
```
https://solscan.io/token/3AUHQtekWmbcbtPCobBZtDFKMMqm4FhBGxw3ipP4JnaD?cluster=devnet


## Steps
### Prepare Enviroment
- instal solana-cli (https://docs.solana.com/cli/install-solana-cli-tools)
  ```bash
  sh -c "$(curl -sSfL https://release.solana.com/v1.14.10/install)"
  solana --version
  ```
- generate keypair solana-cli
  ```bash
  solana-keygen new --force
  ```
- apply solana-cli config
  ```bash
  solana config set --keypair /home/viandwi24/.config/solana/id.json
  solana config set --url https://api.devnet.solana.com
  ```
- install anchor
  ```bash
  cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
  avm install latest
  avm use latest
  anchor --version
  ```
- test
- test
