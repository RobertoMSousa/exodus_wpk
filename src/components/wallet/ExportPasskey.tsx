"use client";
import { useState } from "react";
import styles from "./ExportPasskey.module.css";

export default function ExportPasskey() {
    const [exportedKey, setExportedKey] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Function to export the user's passkey
    const exportPasskey = async () => {
        try {
            const credential = await navigator.credentials.get({
                publicKey: {
                    challenge: new Uint8Array(32),
                    rpId: window.location.hostname,
                    userVerification: "preferred",
                },
            });

            if (!credential) {
                throw new Error("No passkey found. Please ensure you have one created.");
            }

            // Convert passkey to Base64 for easier transfer
            const exportedKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));

            setExportedKey(exportedKeyBase64);
            setError(null);
        } catch (err) {
            setError("Failed to export passkey. Ensure you have a passkey and try again.");
            console.error("Error exporting passkey:", err);
        }
    };

    return (
        <div className={styles.exportContainer}>
            <h3>🔑 Export Your Passkey</h3>
            <button className={styles.exportButton} onClick={exportPasskey}>
                Export Passkey
            </button>

            {exportedKey && (
                <div className={styles.exportResult}>
                    <p>🔗 Your passkey (Base64):</p>
                    <textarea readOnly value={exportedKey} className={styles.exportTextArea} />
                    <p>Copy this key and use it on your other device to recover your wallet.</p>
                </div>
            )}

            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
}