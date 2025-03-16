"use client";
import { useState } from "react";
import styles from "./ExportWallet.module.css";
import ExportPasskey from "./ExportPasskey";

export default function ExportWallet({ privateKey }: { privateKey: string | null }) {
    const [showPrivateKey, setShowPrivateKey] = useState(false);

    return (
        <div className={styles.exportContainer}>
            <button className={styles.exportPrivateKeyButton} onClick={() => setShowPrivateKey(!showPrivateKey)}>
                {showPrivateKey ? "Hide Private Key" : "Export Private Key"}
            </button>

            {showPrivateKey && (
                <p className={styles.privateKey}>
                    🔑 Private Key: <span>{privateKey}</span>
                </p>
            )}

            <ExportPasskey />
        </div>
    );
}