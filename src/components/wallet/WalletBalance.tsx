"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "../../context/WalletContext";
import styles from "./WalletBalance.module.css";

export default function WalletBalance() {
    const { walletAddress } = useWallet();
    const [walletBalance, setWalletBalance] = useState<{ eth: string | null; btc: string | null }>({
        eth: null,
        btc: null,
    });
    const quickNodeETHLink = "https://thrilling-late-morning.ethereum-sepolia.quiknode.pro/007834c3ceb39f62ff46f3a69b32f39fe1893623";

    useEffect(() => {
        if (walletAddress.eth || walletAddress.btc) {
            fetchWalletBalances();
        }
    }, [walletAddress]);

    const fetchWalletBalances = async () => {
        try {
            if (walletAddress.eth) {
                const provider = new ethers.JsonRpcProvider(quickNodeETHLink);
                const balance = await provider.getBalance(walletAddress.eth);
                setWalletBalance((prev) => ({ ...prev, eth: ethers.formatEther(balance) }));
            }

            if (walletAddress.btc) {
                const btcResponse = await fetch(`https://api.blockcypher.com/v1/btc/test3/addrs/${walletAddress.btc}/balance`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const btcData = await btcResponse.json();
                if (btcData.balance !== undefined) {
                    setWalletBalance((prev) => ({ ...prev, btc: (btcData.balance / 1e8).toFixed(8) }));
                } else {
                    setWalletBalance((prev) => ({ ...prev, btc: "0.00000000" }));
                }
            }
        } catch (error) {
            console.error("Error fetching wallet balances:", error);
        }
    };

    return (
        <p className={styles.walletBalance}>
            ✅ ETH (Sepolia) Wallet: {walletAddress.eth} ({walletBalance.eth} ETH)<br />
            ✅ BTC (Testnet) Wallet: {walletAddress.btc} ({walletBalance.btc} BTC)
        </p>
    );
}
