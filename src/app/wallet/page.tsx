import Header from "../../components/header/header";
import WalletConnection from "../../components/wallet/WalletConnection";
import styles from "./wallet.module.css"; // Importing new styles

export default function Wallet() {
    return (
        <div className="grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Header />
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <section className={styles.walletSection}>
                    <div className={styles.walletContainer}>
                        <h1 className={styles.walletTitle}>Passkey Wallet Generator</h1>
                        <p className={styles.walletSubtitle}>
                            Securely create and access your wallet using Passkeys, eliminating the need for seed phrases.
                            Your wallet is protected with WebAuthn technology, ensuring seamless and secure authentication.
                        </p>
                        <WalletConnection />
                    </div>
                </section>
            </main>
        </div>
    );
}