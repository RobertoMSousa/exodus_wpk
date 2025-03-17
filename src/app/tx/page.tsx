"use client";

import Header from "../../components/header/header";
import TransactionHistory from "../../components/transactionHistory/transactionHistory";
import { useWallet } from "../../context/WalletContext"; // ✅ Import Wallet Context
import styles from "./tx.module.css"; // Importing new styles
import Link from "next/link";

export default function TransactionHistoryPage() {
    const { walletAddress } = useWallet(); // ✅ Load wallet data from context

    return (
        <div className="grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Header />
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <section className={styles.walletSection}>
                    <div className={styles.walletContainer}>
                        <h1 className={styles.walletTitle}>Transaction History</h1>
                        <p className={styles.walletSubtitle}>
                            View the history of your transactions on Ethereum (Sepolia) and Bitcoin (Testnet).
                        </p>

                        {walletAddress.eth || walletAddress.btc ? (
                            <TransactionHistory />
                        ) : (
                            <Link href="/wallet">
                                <button className={styles.connectWalletButton}>
                                    🔑 Connect your wallet to view transaction history
                                </button>
                            </Link>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}