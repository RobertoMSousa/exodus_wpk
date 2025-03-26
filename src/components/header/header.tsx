"use client";

import { useState } from "react";
import Link from "next/link";
import styles from './header.module.css';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <h1>Web3 Test Dashboard</h1>
                </Link>

                {/* Burger Menu Button */}
                <button className={styles.burger} onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? "✖" : "☰"}
                </button>

                {/* Navigation */}
                <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
                    <ul>
                        <li>
                            <Link href="/">Home</Link>
                        </li>
                        <li>
                            <Link href="/tx">Transactions</Link>
                        </li>
                        <li>
                            <Link href="/about">About</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
