"use client";
import styles from "./WalletModal.module.css";

export default function WalletModal({
    showModal,
    setShowModal,
    email,
    setEmail,
    displayName,
    setDisplayName,
    generatePasskeyWallet
}: {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    email: string;
    setEmail: (email: string) => void;
    displayName: string;
    setDisplayName: (name: string) => void;
    generatePasskeyWallet: () => void;
}) {
    if (!showModal) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h3>Enter Your Details</h3>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.inputField}
                />
                <input
                    type="text"
                    placeholder="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className={styles.inputField}
                />
                <button className={styles.modalButton} onClick={generatePasskeyWallet}>
                    Create Wallet
                </button>
                <button className={styles.closeButton} onClick={() => setShowModal(false)}>
                    Cancel
                </button>
            </div>
        </div>
    );
}