"use client";
import { useState, useEffect } from "react";
import { useWallet } from "../../context/WalletContext";
import styles from "./WalletConnection.module.css";
import { ethers } from "ethers";
import { sha256 } from "@noble/hashes/sha256";
import { networks, payments } from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import * as ecc from "tiny-secp256k1";
import bs58check from 'bs58check'
import ImportPasskey from "./ImportPasskey";
import ExportWallet from "./ExportWallet";
import WalletModal from "./WalletModal";
import WalletBalance from "./WalletBalance";

const ECPair = ECPairFactory(ecc);

export default function WalletConnection() {
    const { walletAddress, setWalletAddress, setPrivateKey, disconnectWallet } = useWallet();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [passkeyExists, setPasskeyExists] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [displayName, setDisplayName] = useState<string>("");

    useEffect(() => {
        if (!walletAddress.eth) {
            checkExistingPasskey();
        } else {
            console.log("Wallet already exists in context, skipping passkey check.");
            setPasskeyExists(true);
        }
    }, [walletAddress]);

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

    const generateWalletFromPasskey = async (passkey: ArrayBuffer) => {
        try {
            const hashedPasskey = sha256(new Uint8Array(passkey));
            const privateKeyHex = Buffer.from(hashedPasskey).toString("hex").slice(0, 64);

            const ethWallet = new ethers.Wallet(privateKeyHex);
            const keyPair = ECPair.fromPrivateKey(Buffer.from(privateKeyHex, "hex"), { compressed: true });
            const pubkeyBuffer = Buffer.from(keyPair.publicKey);

            const { address: btcAddress } = payments.p2wpkh({
                pubkey: pubkeyBuffer,
                network: networks.testnet,
            });

            const btcPrivateKeyWIF = bs58check.encode(
                Buffer.concat([Buffer.from([0xEF]), keyPair.privateKey!])
            );

            console.log("Generated Testnet BTC Address:", btcAddress);

            setWalletAddress({ eth: ethWallet.address, btc: btcAddress ?? null });
            setPrivateKey({ eth: privateKeyHex, btc: btcPrivateKeyWIF });

        } catch (error) {
            console.error("Error generating wallets from passkey:", error);
        }
    };

    const loginWithPasskey = async () => {
        try {
            const credential = await navigator.credentials.get({
                publicKey: {
                    challenge: new Uint8Array(32),
                    rpId: window.location.hostname,
                    userVerification: "preferred",
                },
            });

            if (credential && credential.type === "public-key") {
                console.log("Logging in with existing passkey.");
                const publicKeyCredential = credential as PublicKeyCredential;
                generateWalletFromPasskey(publicKeyCredential.rawId);
            }
        } catch (error) {
            console.error("Error logging in with passkey:", error);
        }
    };


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
            if (credential && credential.type === "public-key") {
                const publicKeyCredential = credential as PublicKeyCredential;
                generateWalletFromPasskey(publicKeyCredential.rawId);
            }

            setShowModal(false);
        } catch (error) {
            console.error("Error generating passkey wallet:", error);
        }
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
                    <WalletBalance walletAddress={walletAddress} />

                    <ExportWallet />

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