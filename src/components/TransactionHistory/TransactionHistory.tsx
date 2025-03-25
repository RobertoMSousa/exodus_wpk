"use client";
import { useState, useEffect } from "react";
import { useWallet } from "../../context/WalletContext"
import styles from "./TransactionHistory.module.css";

export default function TransactionHistory() {
    const { walletAddress } = useWallet(); // ✅ Now inside TransactionHistory.tsx
    const [transactions, setTransactions] = useState<{ eth: any[]; btc: any[] }>({ eth: [], btc: [] });

    useEffect(() => {
        if (walletAddress.eth || walletAddress.btc) {
            fetchTransactionHistory();
        }
    }, [walletAddress]);

    const fetchTransactionHistory = async () => {
        try {
            let ethTxs: any[] = [];
            let btcTxs: any[] = [];

            const BLOCKCYPHER_BTC_URL = process.env.NEXT_PUBLIC_BLOCKCYPHER_URL!;
            const ETHER_SCAN_URL = process.env.NEXT_PUBLIC_ETHERSCAN_URL!;
            const ETHER_SCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY!;
            const chainId = process.env.NEXT_PUBLIC_CHAIN_ID!;

            // Fetch Ethereum Transactions (Sepolia Testnet) from Etherscan
            if (walletAddress.eth) {
                const ethResponse = await fetch(`${ETHER_SCAN_URL}/v2/api?chainid=${chainId}&module=account&action=txlist&address=${walletAddress.eth}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHER_SCAN_API_KEY}`);
                const ethData = await ethResponse.json();
                console.log("🚀  roberto --  ~ fetchTransactionHistory ~ ethData:", ethData)
                if (ethData.status === "1" && ethData.result) {
                    ethTxs = ethData.result.map((tx: any) => ({
                        hash: tx.hash,
                        amount: `${(parseInt(tx.value) / 1e18).toFixed(6)} ETH`,
                        date: new Date(parseInt(tx.timeStamp) * 1000).toLocaleString(),
                        status: tx.confirmations > 0 ? "Confirmed" : "Pending",
                    }));
                }
            }

            // Fetch Bitcoin Transactions (Testnet) from BlockCypher
            if (walletAddress.btc) {
                const btcResponse = await fetch(`${BLOCKCYPHER_BTC_URL}/${walletAddress.btc}`);
                const btcData = await btcResponse.json();
                console.log("🚀  roberto --  ~ fetchTransactionHistory ~ btcData:", btcData)
                if (btcData.txrefs) {
                    btcTxs = btcData.txrefs.map((tx: any) => ({
                        hash: tx.tx_hash,
                        amount: `${(btcData.final_balance / 1e8).toFixed(6)} BTC`,
                        date: new Date(tx.confirmed).toLocaleString(),
                        status: tx.confirmations > 0 ? "Confirmed" : "Pending",
                    }));
                }
            }

            setTransactions({ eth: ethTxs, btc: btcTxs });
        } catch (error) {
            console.error("Error fetching transaction history:", error);
        }
    };

    return (
        <>
            {walletAddress.eth || walletAddress.btc ? (

                <div className={styles.walletContainer}>
                    <h2 className={styles.walletTitle}>Transaction History</h2>
                    <p className={styles.walletSubtitle}>
                        View your latest transactions across Ethereum and Bitcoin networks.
                    </p>
                    <div className={styles.transactionHistory}>
                        {/* Ethereum Transactions */}
                        {walletAddress.eth && (
                            <div>
                                <h4>Ethereum (Sepolia)</h4>
                                <p className={styles.walletLabel}>Wallet: {walletAddress.eth}</p>
                                <ul>
                                    {transactions.eth.length > 0 ? (
                                        transactions.eth.map((tx, index) => (
                                            <li key={index}>
                                                <span>🔗 <a href={`https://sepolia.etherscan.io/tx/${tx.hash}`} target="_blank">{tx.hash.slice(0, 10)}...</a></span>
                                                <span>{tx.amount}</span>
                                                <span>{tx.date}</span>
                                                <span className={tx.status === "Confirmed" ? styles.confirmed : styles.pending}>{tx.status}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <p>No recent Ethereum transactions.</p>
                                    )}
                                </ul>
                            </div>
                        )}

                        {/* Bitcoin Transactions */}
                        {walletAddress.btc && (
                            <div>
                                <h4>Bitcoin (Testnet)</h4>
                                <p className={styles.walletLabel}>Wallet: {walletAddress.btc}</p>
                                <ul>
                                    {transactions.btc.length > 0 ? (
                                        transactions.btc.map((tx, index) => (
                                            <li key={index}>
                                                <span>🔗 <a href={`https://live.blockcypher.com/btc-testnet/tx/${tx.hash}`} target="_blank">{tx.hash.slice(0, 10)}...</a></span>
                                                <span>{tx.amount}</span>
                                                <span>{tx.date}</span>
                                                <span className={tx.status === "Confirmed" ? styles.confirmed : styles.pending}>{tx.status}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <p>No recent Bitcoin transactions.</p>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <p className={styles.noWalletMessage}>🔑 Connect your wallet to view transaction history.</p>
            )}
        </>
    );
}
