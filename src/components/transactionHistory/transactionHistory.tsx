"use client";
import { useState, useEffect } from "react";
import { useWallet } from "../../context/WalletContext"; // ✅ Import Wallet Context
import styles from "./transactionHistory.module.css";

export default function TransactionHistory() {
    const { walletAddress } = useWallet(); // ✅ Load wallet data from context
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

            // Fetch Ethereum Transactions (Sepolia Testnet)
            if (walletAddress.eth) {
                const ethResponse = await fetch(`https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${walletAddress.eth}&startblock=0&endblock=99999999&sort=desc&apikey=YOUR_ETHERSCAN_API_KEY`);
                const ethData = await ethResponse.json();
                if (ethData.status === "1") {
                    ethTxs = ethData.result.map((tx: any) => ({
                        hash: tx.hash,
                        amount: `${(parseInt(tx.value) / 1e18).toFixed(6)} ETH`,
                        date: new Date(parseInt(tx.timeStamp) * 1000).toLocaleString(),
                        status: tx.confirmations > 0 ? "Confirmed" : "Pending",
                    }));
                }
            }

            // Fetch Bitcoin Transactions (Testnet) using BlockCypher
            if (walletAddress.btc) {
                const btcResponse = await fetch(`https://api.blockcypher.com/v1/btc/test3/addrs/${walletAddress.btc}`);
                const btcData = await btcResponse.json();
                if (btcData.txs) {
                    btcTxs = btcData.txs.map((tx: any) => ({
                        hash: tx.hash,
                        amount: `${(tx.total / 1e8).toFixed(6)} BTC`,
                        date: new Date(tx.received).toLocaleString(),
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
        <div className={styles.transactionHistory}>
            <h3>📜 Transaction History</h3>

            {/* Ethereum Transaction History */}
            {walletAddress.eth && (
                <div>
                    <h4>Ethereum (Sepolia)</h4>
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

            {/* Bitcoin Transaction History */}
            {walletAddress.btc && (
                <div>
                    <h4>Bitcoin (Testnet)</h4>
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
    );
}