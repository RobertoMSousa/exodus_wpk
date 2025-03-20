# Exodus Web3 Developer Dashboard

This project is a **Web3 Developer Dashboard** designed to **seamlessly integrate and test crypto transactions** using the **Exodus Wallet SDK**. It provides **secure passkey authentication**, wallet management, transaction history, and gasless transactions.

## Features

✅ **Passkey Authentication** – Securely generate and access wallets using WebAuthn.  
✅ **Multi-Chain Support** – Connect to **Ethereum (Sepolia), Bitcoin (Testnet), Arbitrum, and Polygon**.  
✅ **Gasless Transactions** – Enable gas-free transactions via relayers.  
✅ **Wallet Import & Export** – Export private keys and import existing wallets.  
✅ **Transaction Monitoring** – View real-time transaction history.  

## Getting Started

### **1️⃣ Install Dependencies**
Run the following command to install all necessary packages:
```bash
npm install
```

### **2️⃣ Start the Development Server**
Launch the development environment with:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
The project will be available at **[http://localhost:3000](http://localhost:3000)**.

## **Project Structure**
```
/src
 ├── /app
 │    ├── page.tsx         # Landing Page
 │    ├── layout.tsx       # App Layout (includes WalletProvider)
 │    ├── /wallet          # Wallet-related pages
 │    ├── /tx              # Transaction history page
 │
 ├── /components
 │    ├── /wallet
 │    │    ├── WalletConnection.tsx   # Handles wallet connection via passkeys
 │    │    ├── ExportWallet.tsx       # Allows private key export
 │    │    ├── WalletBalance.tsx      # Displays ETH & BTC wallet balances
 │    │    ├── TransactionHistory.tsx # Displays past transactions
 │
 ├── /context
 │    ├── WalletContext.tsx # React Context for wallet state management
 │
 ├── /styles
 │    ├── globals.css       # Global styles
 │    ├── wallet.module.css # Wallet-related styles
```

## **Environment Variables**
Create a `.env.local` file and set up required API keys:
```
```

## **Deploying the Project**
To deploy the project on **Vercel**, run:
```bash
vercel
```
Or, for a manual deployment, build the project with:
```bash
npm run build
```

## **Contributing**
We welcome contributions! Please submit pull requests for bug fixes, features, or improvements.

## **License**
This project is licensed under **MIT**.

---

### **🔹 Additional Resources**
- [Next.js Documentation](https://nextjs.org/docs)
- [Exodus Wallet SDK](https://www.exodus.com/)
- [QuickNode API](https://www.quicknode.com/)
- [Ethers.js Documentation](https://docs.ethers.io/)
