"use client";
import { useState, useEffect } from "react";
import styles from "./WalletConnection.module.css";
import { ethers } from "ethers";
import { sha256 } from "@noble/hashes/sha256";
import { payments } from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import * as ecc from "tiny-secp256k1";
import bs58check from 'bs58check'
import ImportPasskey from "./ImportPasskey";
import ExportWallet from "./ExportWallet";
import WalletModal from "./WalletModal";

const ECPair = ECPairFactory(ecc);

export default function WalletConnection() {
    const [walletAddress, setWalletAddress] = useState<{ eth: string | null; btc: string | null }>({
        eth: null,
        btc: null,
    });
    const [privateKey, setPrivateKey] = useState<{ eth: string | null; btc: string | null }>({
        eth: null,
        btc: null,
    });
    const [showModal, setShowModal] = useState<boolean>(false);
    const [passkeyExists, setPasskeyExists] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [displayName, setDisplayName] = useState<string>("");

    useEffect(() => {
        checkExistingPasskey();
    }, []);

    // Function to check for an existing passkey
    const checkExistingPasskey = async () => {
        try {
            const credential = await navigator.credentials.get({
                publicKey: {
                    challenge: new Uint8Array(32),
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

    // Function to generate Ethereum and Bitcoin wallets from passkey
    const generateWalletFromPasskey = async (passkey: ArrayBuffer) => {
        try {
            const hashedPasskey = sha256(new Uint8Array(passkey));
            const privateKeyHex = Buffer.from(hashedPasskey).toString("hex").slice(0, 64);

            // 🔹 Generate Ethereum Wallet
            const ethWallet = new ethers.Wallet(privateKeyHex);

            // 🔹 Generate Bitcoin Wallet
            const keyPair = ECPair.fromPrivateKey(Buffer.from(privateKeyHex, "hex"), { compressed: true });

            // Ensure the public key is properly formatted
            const pubkeyBuffer = Buffer.from(keyPair.publicKey);

            console.log("🚀  roberto --  ~ generateWalletFromPasskey ~ keyPair:", keyPair);
            console.log("🚀  roberto --  ~ generateWalletFromPasskey ~ pubkey:", pubkeyBuffer);

            const { address: btcAddress } = payments.p2wpkh({ pubkey: pubkeyBuffer });

            // 🔹 Convert private key to Bitcoin WIF format
            const btcPrivateKeyWIF = bs58check.encode(Buffer.concat([Buffer.from([0x80]), keyPair.privateKey!]));

            console.log("ETH Wallet Address:", ethWallet.address);
            console.log("BTC Wallet Address:", btcAddress);
            console.log("BTC Private Key (WIF):", btcPrivateKeyWIF);

            // Store both ETH & BTC addresses
            setWalletAddress({ eth: ethWallet.address, btc: btcAddress });
            setPrivateKey({ eth: privateKeyHex, btc: btcPrivateKeyWIF });

        } catch (error) {
            console.error("Error generating wallets from passkey:", error);
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

    // Function to create a new passkey and derive wallets
    const generatePasskeyWallet = async () => {
        try {
            if (!email || !displayName) {
                throw new Error("Email and Display Name are required.");
            }

            const credential = await navigator.credentials.create({
                publicKey: {
                    challenge: new Uint8Array(32),
                    rp: { name: "Exodus Web3" },
                    user: {
                        id: new Uint8Array(16),
                        name: email,
                        displayName: displayName,
                    },
                    pubKeyCredParams: [{ type: "public-key", alg: -7 }],
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
        setWalletAddress({ eth: null, btc: null });
        setPrivateKey({ eth: null, btc: null });
    };

    return (
        <div className={styles.walletContainer}>
            {!walletAddress.eth ? (
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
                    <ImportPasskey />
                </>
            ) : (
                <>
                    <p className={styles.walletAddress}>
                        ✅ ETH Wallet: {walletAddress.eth} <br />
                        ✅ BTC Wallet: {walletAddress.btc}
                    </p>

                    <ExportWallet privateKey={privateKey} />

                    <button className={styles.disconnectButton} onClick={disconnectWallet}>
                        Disconnect Wallet
                    </button>
                </>
            )}

            {showModal && (
                <WalletModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    email={email}
                    setEmail={setEmail}
                    displayName={displayName}
                    setDisplayName={setDisplayName}
                    generatePasskeyWallet={generatePasskeyWallet}
                />
            )}
        </div>
    );
}