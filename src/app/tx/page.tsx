import Header from "../../components/header/header";
import TransactionHistory from "../../components/TransactionHistory/TransactionHistory";
import styles from "./tx.module.css"; // Importing new styles

export default function TransactionHistoryPage() {
    return (
        <div className="grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Header />
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <section className={styles.walletSection}>
                    <div className={styles.walletContainer}>
                        <h1 className={styles.walletTitle}>Transaction History</h1>
                        <p className={styles.walletSubtitle}>
                            View your latest Ethereum and Bitcoin transactions. Connect your wallet to access real-time transaction history.
                        </p>
                        <TransactionHistory />
                    </div>
                </section>

            </main>
        </div>
    );
}
