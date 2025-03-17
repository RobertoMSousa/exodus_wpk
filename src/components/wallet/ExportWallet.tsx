"use client";
import { useState } from "react";
import { useWallet } from "../../context/WalletContext"; // ✅ Import Wallet Context
import styles from "./ExportWallet.module.css";
import ExportPasskey from "./ExportPasskey";

export default function ExportWallet() {
    const { privateKey } = useWallet(); // ✅ Load private keys from context
    const [showPrivateKeys, setShowPrivateKeys] = useState(false);

    return (
        <div className={styles.exportContainer}>
            <button className={styles.exportPrivateKeyButton} onClick={() => setShowPrivateKeys(!showPrivateKeys)}>
                {showPrivateKeys ? "Hide Private Keys" : "Export Private Keys"}
            </button>

            {showPrivateKeys && (
                <div className={styles.privateKeyContainer}>
                    {privateKey.eth && (
                        <p className={styles.privateKey}>
                            🔑 ETH Private Key: <span>{privateKey.eth}</span>
                        </p>
                    )}
                    {privateKey.btc && (
                        <p className={styles.privateKey}>
                            🔑 BTC Private Key (WIF): <span>{privateKey.btc}</span>
                        </p>
                    )}
                </div>
            )}

            <ExportPasskey />
        </div>
    );
}