## Web3 app on Solana with React and Rust

---

### `Links`

[Vercel Deployment](https://solana-gif-portal-nine.vercel.app/) • [Solana Explorer](https://explorer.solana.com/address/9pNVhk76iTkKaei3kGQRsvgY5NiC5dNygwK7sVrhXRQe?cluster=devnet)  • [Client Side](https://github.com/ScooterMcgavin21/solana-gif-portal/tree/main/app) 



---


<br />

### Technologies: 
- [Node.js](https://nodejs.org/en/) - JavaScript runtime environment
- [Rust](https://doc.rust-lang.org/book/ch01-01-installation.html) - Language used to build on chain programs (contracts)
- [Mocha](https://mochajs.org/) - Framework for testing Solana programs
- [Solana](https://2501babe.github.io/posts/solana101.html) - Introduction to the Solana Blockchain
- [Anchor](https://project-serum.github.io/anchor/getting-started/introduction.html) - The hardhat for Solana development
- [Browser Wallet](https://phantom.app/) - Phantom Wallet

<br />

# Getting Solana Started <small>(on a M1 Mac)</small>

## ⚙️ Install Rust
<hr />

```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

## 🔥 Build Solana from source
<hr />

```bash
git clone https://github.com/solana-labs/solana.git/
```

**Checkout stable version**
```bash
cd solana
git checkout v1.8.5
```

**Compile source code with Cargo**
```bash
cargo build
```

**Run the install script**
```bash
./scripts/cargo-install-all.sh .
```

**Run validator manually**
```bash
solana-test-validator --no-bpf-jit
```

## ⚓️ Cast Anchor 
<hr />

```bash
cargo install --git https://github.com/project-serum/anchor anchor-cli --locked
```

**Build with Anchor**
```bash
anchor build
```

**Fetch Project ID**
```bash
solana address -k target/deploy/myepicproject-keypair.json
```

The command above returns the keypair in terminal. Copy the outputted address and replace the addresses currently located in:
</br> `.Anchor.toml` on line 2
</br> `programs/myepicproject/src/lib.rs` on line 4  
&nbsp;

**Pass the Test**
```bash
anchor test --skip-local-validator
```

# Running Locally

1. Clone the repository
```bash
git clone git@github.com:ScooterMcgavin21/solana-gif-portal.git
```

2. Install Anchor npm modules
```bash
npm install
```

3. Change into app directory to install client dependencies
```bash
cd app && npm install
```

4. Run the client-side
```bash
npm start
```


