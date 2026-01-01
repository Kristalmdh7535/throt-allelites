"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../Auth.module.css";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Registration failed");
      }

      const message = await res.text();
      setSuccess(true);
      setError("");

      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <label className={styles.label}>Full Name</label>
          <input
            type="text"
            required
            className={styles.input}
            placeholder="Prabek Rajbanshi"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            required
            className={styles.input}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            required
            className={styles.input}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label className={styles.label}>Confirm Password</label>
          <input
            type="password"
            required
            className={styles.input}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>Registration successful! Check your email for OTP.</p>}

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Registering..." : "Sign Up"}
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