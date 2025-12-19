import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import styles from "./Auth.module.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sign In | Throt-All Elites",
  description: "Sign in to your Throt-All Elites account.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className={styles.container}>
          <div className={styles.card}>
            <h1 className={styles.heading}>Throt-All Elites</h1>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}