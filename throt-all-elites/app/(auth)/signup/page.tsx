import Link from "next/link";
import styles from "../Auth.module.css";

export default function SignupPage() {
  return (
    <>
      <form className={styles.form}>
        <div>
          <label className={styles.label}>Full Name</label>
          <input type="text" required className={styles.input} />
        </div>

        <div>
          <label className={styles.label}>Email</label>
          <input type="email" required className={styles.input} placeholder="you@example.com" />
        </div>

        <div>
          <label className={styles.label}>Password</label>
          <input type="password" required className={styles.input} placeholder="••••••••" />
        </div>

        <div>
          <label className={styles.label}>Confirm Password</label>
          <input type="password" required className={styles.input} placeholder="••••••••" />
        </div>

        <button type="submit" className={styles.button}>
          Sign Up
        </button>
      </form>

      <p className={styles.linkText}>
        Already have an account?{" "}
        <Link href="/login" className={styles.link}>
          Sign In
        </Link>
      </p>
    </>
  );
}