"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface WalletContextProps {
    walletAddress: { eth: string | null; btc: string | null };
    privateKey: { eth: string | null; btc: string | null };
    setWalletAddress: (wallet: { eth: string | null; btc: string | null }) => void;
    setPrivateKey: (privateKey: { eth: string | null; btc: string | null }) => void;
    disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
    const [walletAddress, setWalletAddress] = useState<{ eth: string | null; btc: string | null }>({ eth: null, btc: null });
    const [privateKey, setPrivateKey] = useState<{ eth: string | null; btc: string | null }>({ eth: null, btc: null });

    // Load wallet data from localStorage on mount
    useEffect(() => {
        const savedWallet = localStorage.getItem("walletAddress");
        const savedPrivateKey = localStorage.getItem("privateKey");

        if (savedWallet && savedWallet !== "undefined") {
            setWalletAddress(JSON.parse(savedWallet));
        }

        if (savedPrivateKey && savedPrivateKey !== "undefined") {
            setPrivateKey(JSON.parse(savedPrivateKey));
        }
    }, []);

    // Function to update wallet and persist in localStorage
    const updateWalletAddress = (addressData: { eth: string | null; btc: string | null }) => {
        setWalletAddress(addressData);
        localStorage.setItem("walletAddress", JSON.stringify(addressData));
    };

    // Function to update private key and persist in localStorage
    const updatePrivateKey = (privateKeyData: { eth: string | null; btc: string | null }) => {
        setPrivateKey(privateKeyData);
        localStorage.setItem("privateKey", JSON.stringify(privateKeyData));
    };

    // Disconnect Wallet & Clear Local Storage
    const disconnectWallet = () => {
        setWalletAddress({ eth: null, btc: null });
        setPrivateKey({ eth: null, btc: null });

        localStorage.removeItem("walletAddress");
        localStorage.removeItem("privateKey");
    };

    return (
        <WalletContext.Provider value={{ walletAddress, privateKey, setWalletAddress: updateWalletAddress, setPrivateKey: updatePrivateKey, disconnectWallet }}>
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
