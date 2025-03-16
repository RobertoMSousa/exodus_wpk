"use client";
import { useState, useEffect } from "react";
import styles from "./WalletConnection.module.css";
import { ethers } from "ethers"; // Ethereum wallet generation
import { sha256 } from "@noble/hashes/sha256"; // Hashing passkey for determinism
import ExportPasskey from "./ExportPasskey"; // Import ExportPasskey component
import ImportPasskey from "./ImportPasskey"; // Import ImportPasskey component

export default function WalletConnection() {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [privateKey, setPrivateKey] = useState<string | null>(null);
    const [showPrivateKey, setShowPrivateKey] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [passkeyExists, setPasskeyExists] = useState<boolean>(false);
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
                console.log("Existing passkey found, suggesting login.");
                setPasskeyExists(true);
            } else {
                console.log("No existing passkey found, suggesting wallet creation.");
                setPasskeyExists(false);
            }
        } catch (error) {
            console.error("Error checking existing passkey:", error);
            setPasskeyExists(false);
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
            setPrivateKey(privateKeyHex);

            console.log("Wallet Address (from passkey):", wallet.address);
        } catch (error) {
            console.error("Error generating wallet from passkey:", error);
        }
    };

    // Function to log in with an existing passkey
    const loginWithPasskey = async () => {
        try {
            const credential = await navigator.credentials.get({
                publicKey: {
                    challenge: new Uint8Array(32),
                    rpId: window.location.hostname,
                    userVerification: "preferred",
                },
            });

            if (credential) {
                console.log("Logging in with existing passkey.");
                generateWalletFromPasskey(credential.rawId);
            }
        } catch (error) {
            console.error("Error logging in with passkey:", error);
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
        setPrivateKey(null);
        setShowPrivateKey(false);
    };

    return (
        <div className={styles.walletContainer}>
            {!walletAddress ? (
                <>
                    <h3>🔑 Access Your Wallet</h3>
                    {passkeyExists ? (
                        <button className={styles.generateButton} onClick={loginWithPasskey}>
                            Login with Passkey
                        </button>
                    ) : (
                        <button className={styles.generateButton} onClick={() => setShowModal(true)}>
                            Create Wallet
                        </button>
                    )}
                    <ImportPasskey /> {/* Import Passkey Component Added */}
                </>
            ) : (
                <>
                    <p className={styles.walletAddress}>✅ Wallet: {walletAddress}</p>

                    {/* Export Private Key Button */}
                    <button className={styles.exportPrivateKeyButton} onClick={() => setShowPrivateKey(!showPrivateKey)}>
                        {showPrivateKey ? "Hide Private Key" : "Export Private Key"}
                    </button>

                    {showPrivateKey && (
                        <p className={styles.privateKey}>
                            🔑 Private Key: <span>{privateKey}</span>
                        </p>
                    )}

                    <button className={styles.disconnectButton} onClick={disconnectWallet}>
                        Disconnect Wallet
                    </button>
                    <ExportPasskey /> {/* Export Passkey Component Added */}
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