import Header from "../../components/header/header";
import WalletConnection from "../../components/wallet/WalletConnection"

export default function About() {
    return (
        <div className="grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Header />
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <h1 className="text-4xl font-bold text-white">About Exodus</h1>
                <WalletConnection />
            </main>
        </div>
    );
}