"use client";
import { useState, useEffect } from "react";
import styles from "./WalletConnection.module.css";
import * as secp256k1 from "@noble/secp256k1"; // Cryptographic key generation
import { ethers } from "ethers"; // Ethereum wallet generation
import { sha256 } from "@noble/hashes/sha256"; // Hashing passkey for determinism

export default function WalletConnection() {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [displayName, setDisplayName] = useState<string>("");

    useEffect(() => {
        checkExistingPasskey();
    }, []);

    // Function to check for an existing passkey and load the wallet if available
    const checkExistingPasskey = async () => {
        try {
            const credential = await navigator.credentials.get({
                publicKey: {
                    challenge: new Uint8Array(32), // Random challenge
                    rpId: window.location.hostname,
                    userVerification: "preferred",
                },
            });

            if (credential) {
                console.log("Existing passkey found, using it for wallet generation.");
                generateWalletFromPasskey(credential.rawId);
            } else {
                setShowModal(true); // Show modal if no passkey exists
            }
        } catch (error) {
            console.error("Error checking existing passkey:", error);
            setShowModal(true); // Show modal if there's an error
        }
    };

    // Function to generate a deterministic wallet from the passkey
    const generateWalletFromPasskey = async (passkey: ArrayBuffer) => {
        try {
            const hashedPasskey = sha256(new Uint8Array(passkey));
            const privateKeyHex = Buffer.from(hashedPasskey).toString("hex").slice(0, 64);

            // Generate Ethereum Wallet from the Derived Private Key
            const wallet = new ethers.Wallet(privateKeyHex);
            setWalletAddress(wallet.address);

            console.log("Wallet Address (from passkey):", wallet.address);
        } catch (error) {
            console.error("Error generating wallet from passkey:", error);
        }
    };

    // Function to create a new passkey and derive a wallet
    const generatePasskeyWallet = async () => {
        try {
            if (!email || !displayName) {
                throw new Error("Email and Display Name are required.");
            }

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

            console.log("New passkey created, using it for wallet generation.");
            generateWalletFromPasskey(credential.rawId);
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