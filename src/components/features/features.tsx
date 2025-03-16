import styles from "./features.module.css";

export default function Features() {
    return (
        <section className={styles.features}>
            <div className={styles.container}>
                <h2 className={styles.title}>Powerful Web3 Developer Tools</h2>
                <div className={styles.featureList}>
                    {/* <div className={styles.featureItem}>
                        <h3>🔗 Wallet Connection</h3>
                        <p>Easily connect your Exodus Wallet with our SDK and interact with blockchain networks effortlessly.</p>
                    </div> */}
                    <div className={styles.featureItem}>
                        <h3>
                            <a href="/wallet" className={styles.link}>🔑 Passkey Wallet Generator</a>
                        </h3>
                        <p>Securely create and access wallets using Passkeys, eliminating the need for seed phrases.</p>
                    </div>
                    <div className={styles.featureItem}>
                        <h3>⛽ Gas Fee Estimator</h3>
                        <p>Get real-time gas fees across Ethereum, Arbitrum, Polygon, and Bitcoin to optimize your transactions.</p>
                    </div>
                    <div className={styles.featureItem}>
                        <h3>🚀 Gasless Transactions</h3>
                        <p>Leverage relayers to send transactions without gas fees—great for onboarding new users.</p>
                    </div>
                    <div className={styles.featureItem}>
                        <h3>📊 Transaction History</h3>
                        <p>Monitor and track all transactions in real-time, with instant updates on status and gas costs.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
