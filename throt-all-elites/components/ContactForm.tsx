"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiMessageSquare, FiSend } from "react-icons/fi";
import "./ContactForm.css";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [charCount, setCharCount] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "message") {
      setCharCount(value.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
        setCharCount(0);
      } else {
        setStatus("Failed to send message. Please try again.");
      }
    } catch (error) {
      setStatus("An error occurred. Please try again later.");
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        <motion.h2
          className="contact-title"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Get in Touch
        </motion.h2>
        <motion.p
          className="contact-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          We'd love to hear from you! Reach out for inquiries or support.
        </motion.p>
        <motion.form
          onSubmit={handleSubmit}
          className="contact-form"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          <motion.div className="input-group" variants={inputVariants}>
            <FiUser className="input-icon" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="contact-input"
              required
            />
          </motion.div>
          <motion.div className="input-group" variants={inputVariants}>
            <FiMail className="input-icon" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="contact-input"
              required
            />
          </motion.div>
          <motion.div className="input-group" variants={inputVariants}>
            <FiMessageSquare className="input-icon" />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              className="contact-textarea"
              required
              maxLength={500}
            />
            <div className="char-counter">{charCount} / 500</div>
          </motion.div>
          <motion.button
            type="submit"
            className="contact-button"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(220, 38, 38, 0.7)" }}
            whileTap={{ scale: 0.95 }}
            variants={inputVariants}
          >
            <FiSend />
            <span>Send Message</span>
          </motion.button>
          {status && <p className="contact-status">{status}</p>}
        </motion.form>
      </div>
    </section>
  );
}