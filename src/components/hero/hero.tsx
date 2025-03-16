import styles from "./hero.module.css";

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.container}>
                <h1 className={styles.title}>Build with the Exodus Wallet SDK</h1>
                <p className={styles.subtitle}>
                    A seamless Web3 Developer Dashboard for integrating and testing crypto transactions with secure passkey authentication.
                </p>
                <div className={styles.features}>
                    <span>🔑 Generate and access wallets securely using Passkeys</span>
                    {/* <span>🔗 Connect Exodus Wallet effortlessly</span> */}
                    <span>⛽ Estimate and optimize gas fees</span>
                    <span>🚀 Send gasless transactions via relayers</span>
                    <span>📊 Monitor transaction history in real-time</span>
                </div>
                <button className={styles.downloadBtn}>
                    🚀 Start Building Now
                </button>
                <a href="#" className={styles.link}>Learn more about the SDK</a>
            </div>
        </section>
    );
}