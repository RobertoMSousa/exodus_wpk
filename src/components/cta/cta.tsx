import styles from "./cta.module.css";

export default function CTA() {
    return (
        <section className={styles.cta}>
            <div className={styles.container}>
                <h2 className={styles.title}>Ready to Build? Start Now!</h2>
                <p className={styles.subtitle}>
                    Get started with the our Wallet SDK and build the future of Web3 applications.
                </p>
                <div className={styles.buttons}>
                    <button className="btn-primary">Start Building Now</button>
                    <a href="/docs" className="btn-secondary">Read the Documentation</a>
                </div>
            </div>
        </section>
    );
}