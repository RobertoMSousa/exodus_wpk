import Header from "../../components/header/header";

export default function About() {
    return (
        <div className="grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Header />
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <h1 className="text-4xl font-bold text-white">About this</h1>
                <p className="max-w-2xl text-center text-lg text-gray-300">
                    This is a secure, user-friendly cryptocurrency wallet designed to help users manage
                    their digital assets seamlessly. Our mission is to empower people to take control of
                    their wealth in a decentralized world.
                </p>
            </main>
        </div>
    );
}