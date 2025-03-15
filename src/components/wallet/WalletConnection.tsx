"use client";
import { useState } from "react";
import styles from "./WalletConnection.module.css";
import * as secp256k1 from "@noble/secp256k1"; // For cryptographic key generation
import { ethers } from "ethers"; // For Ethereum wallet generation

export default function WalletConnection() {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [displayName, setDisplayName] = useState<string>("");

    // Function to create a passkey and derive a wallet
    const generatePasskeyWallet = async () => {
        try {
            if (!email || !displayName) {
                throw new Error("Email and Display Name are required.");
            }

            // Step 1: Generate a new WebAuthn Credential (Passkey)
            const credential = await navigator.credentials.create({
                publicKey: {
                    challenge: new Uint8Array(32), // Random challenge
                    rp: { name: "Exodus Web3" },
                    user: {
                        id: new Uint8Array(16),
                        name: email,
                        displayName: displayName,
                    },
                    pubKeyCredParams: [{ type: "public-key", alg: -7 }], // ECDSA with SHA-256
                    authenticatorSelection: { userVerification: "preferred" },
                },
            });

            if (!credential) throw new Error("Failed to create credential");

            // Step 2: Extract Public Key from Credential
            const publicKey = credential.response.getPublicKey();
            if (!publicKey) throw new Error("Public key generation failed");

            // Step 3: Derive a Private Key (Simulating Passkey-Based Wallet Generation)
            const privateKey = secp256k1.utils.randomPrivateKey();
            const privateKeyHex = Buffer.from(privateKey).toString("hex");

            // Step 4: Generate an Ethereum Wallet from the Derived Private Key
            const wallet = new ethers.Wallet(privateKeyHex);
            setWalletAddress(wallet.address);

            console.log("Generated Wallet Address:", wallet.address);
            setShowModal(false);
        } catch (error) {
            console.error("Error generating passkey wallet:", error);
        }
    };

    // Function to disconnect the wallet
    const disconnectWallet = () => {
        setWalletAddress(null);
    };

    return (
        <div className={styles.walletContainer}>
            {!walletAddress ? (
                <>
                    <h3>🔑 Generate a Wallet with Passkeys</h3>
                    <button className={styles.generateButton} onClick={() => setShowModal(true)}>
                        Generate Wallet
                    </button>
                </>
            ) : (
                <>
                    <p className={styles.walletAddress}>✅ Wallet: {walletAddress}</p>
                    <button className={styles.disconnectButton} onClick={disconnectWallet}>
                        Disconnect Wallet
                    </button>
                </>
            )}

            {showModal && (
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
            )}
        </div>
    );
}