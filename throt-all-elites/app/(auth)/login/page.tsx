"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../Auth.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email"); // email or otp
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.text();

      if (res.ok) {
        setMessage(data || "OTP sent to your email!");
        setStep("otp");
      } else {
        setError(data || "Failed to send OTP");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }), // assuming VerifyOtpRequest has email + otp
      });

      if (res.ok) {
        const data = await res.json(); // { accessToken: "...", ... }
        
        // Store JWT (simple localStorage example; for production use httpOnly cookies or better auth lib)
        localStorage.setItem("accessToken", data.accessToken);

        setMessage("Login successful!");
        router.push("/dashboard"); // or wherever your protected page is
      } else {
        const data = await res.json();
        setError(data.message || "Invalid or expired OTP");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {step === "email" ? (
        <form onSubmit={handleSendOtp} className={styles.form}>
          <div>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="you@example.com"
            />
          </div>

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Sending..." : "Send OTP"}
          </button>

          {message && <p style={{ color: "green" }}>{message}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className={styles.form}>
          <div>
            <label className={styles.label}>OTP</label>
            <input
              type="text"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={styles.input}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
            />
          </div>

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Verifying..." : "Verify OTP & Sign In"}
          </button>

          <button
            type="button"
            onClick={() => setStep("email")}
            className={styles.button}
            style={{ marginTop: "10px", background: "gray" }}
          >
            Back to Email
          </button>

          {message && <p style={{ color: "green" }}>{message}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}

      <p className={styles.linkText}>
        Don't have an account?{" "}
        <Link href="/signup" className={styles.link}>
          Sign Up
        </Link>
      </p>
    </>
  );
}