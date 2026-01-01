import type { Metadata } from "next";
import "../globals.css";
import styles from "./Auth.module.css";

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
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Throt-All Elites</h1>
        {children}
      </div>
    </div>
  );
}