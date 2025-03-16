"use client";
import { useState } from "react";
import styles from "./ImportPasskey.module.css";
import { sha256 } from "@noble/hashes/sha256";
import { ethers } from "ethers";

export default function ImportPasskey() {
    const [importedKey, setImportedKey] = useState<string>("");
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Function to derive a wallet from the imported passkey
    const importPasskey = async () => {
        try {
            if (!importedKey) throw new Error("Please enter a valid passkey.");

            // Convert Base64 back to ArrayBuffer
            const rawKey = new Uint8Array(
                atob(importedKey)
                    .split("")
                    .map((char) => char.charCodeAt(0))
            );

            // Hash the imported passkey to derive a wallet
            const hashedPasskey = sha256(rawKey);
            const privateKeyHex = Buffer.from(hashedPasskey).toString("hex").slice(0, 64);
            const wallet = new ethers.Wallet(privateKeyHex);
            setWalletAddress(wallet.address);
            setError(null);
        } catch (err) {
            setError("Invalid passkey format. Please check and try again.");
            console.error("Error importing passkey:", err);
        }
    };

    return (
        <div className={styles.importContainer}>
            <h3>🔑 Import Your Passkey</h3>
            <textarea
                placeholder="Paste your Base64 passkey here..."
                value={importedKey}
                onChange={(e) => setImportedKey(e.target.value)}
                className={styles.importTextArea}
            />
            <button className={styles.importButton} onClick={importPasskey}>
                Import Passkey
            </button>

            {walletAddress && (
                <div className={styles.importResult}>
                    <p>✅ Wallet Imported: {walletAddress}</p>
                </div>
            )}

            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
}