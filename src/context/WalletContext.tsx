"use client";
import { createContext, useContext, useState } from "react";

interface WalletContextProps {
    walletAddress: { eth: string | null; btc: string | null };
    privateKey: { eth: string | null; btc: string | null };
    setWalletAddress: (wallet: { eth: string | null; btc: string | null }) => void;
    setPrivateKey: (key: { eth: string | null; btc: string | null }) => void;
    disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
    const [walletAddress, setWalletAddress] = useState<{ eth: string | null; btc: string | null }>({ eth: null, btc: null });
    const [privateKey, setPrivateKey] = useState<{ eth: string | null; btc: string | null }>({ eth: null, btc: null });

    const disconnectWallet = () => {
        setWalletAddress({ eth: null, btc: null });
        setPrivateKey({ eth: null, btc: null });
    };

    return (
        <WalletContext.Provider value={{ walletAddress, privateKey, setWalletAddress, setPrivateKey, disconnectWallet }}>
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
