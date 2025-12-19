import Link from "next/link";
import styles from "../Auth.module.css";

export default function LoginPage() {
  return (
    <>
      <form className={styles.form}>
        <div>
          <label className={styles.label}>Email</label>
          <input type="email" required className={styles.input} placeholder="you@example.com" />
        </div>

        <div>
          <label className={styles.label}>Password</label>
          <input type="password" required className={styles.input} placeholder="••••••••" />
        </div>

        <button type="submit" className={styles.button}>
          Sign In
        </button>
      </form>

      <p className={styles.linkText}>
        Don't have an account?{" "}
        <Link href="/signup" className={styles.link}>
          Sign Up
        </Link>
      </p>
    </>
  );
}