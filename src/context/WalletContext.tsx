"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface WalletContextProps {
    walletAddress: { eth: string | null; btc: string | null };
    setWalletAddress: (wallet: { eth: string | null; btc: string | null }) => void;
    disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
    const [walletAddress, setWalletAddress] = useState<{ eth: string | null; btc: string | null }>({ eth: null, btc: null });
    // const [privateKey, setPrivateKey] = useState<{ eth: string | null; btc: string | null }>({ eth: null, btc: null });

    // Load wallet data from localStorage on mount
    useEffect(() => {
        const savedWallet = localStorage.getItem("walletAddress");
        // const savedPrivateKey = localStorage.getItem("privateKey");

        if (savedWallet) {
            setWalletAddress(JSON.parse(savedWallet));
            // setPrivateKey(JSON.parse(savedPrivateKey));
        }
    }, []);

    // Function to update wallet state and persist to localStorage
    const updateWallet = (addressData: { eth: string | null; btc: string | null }) => {
        setWalletAddress(addressData);
        // setPrivateKey(privateKeyData);

        // Save to localStorage
        localStorage.setItem("walletAddress", JSON.stringify(addressData));
        // localStorage.setItem("privateKey", JSON.stringify(privateKeyData));
    };

    // Disconnect Wallet & Clear Local Storage
    const disconnectWallet = () => {
        setWalletAddress({ eth: null, btc: null });
        // setPrivateKey({ eth: null, btc: null });

        localStorage.removeItem("walletAddress");
        // localStorage.removeItem("privateKey");
    };

    return (
        <WalletContext.Provider value={{ walletAddress, setWalletAddress: updateWallet, disconnectWallet }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
};
