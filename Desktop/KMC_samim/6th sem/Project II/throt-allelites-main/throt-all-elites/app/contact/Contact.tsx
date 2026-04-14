"use client";

import { useState } from "react";
import styles from "./Contact.module.css";
import emailjs from "emailjs-com";

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    street: "",
    city: "",
    postcode: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs
      .send("service_5bny0m6", "template_fuhrrsb", formData, "q9vJpPlUG5G2X1Jc2") // Replace with your EmailJS service ID, template ID, and public key
      .then(() => alert("Message sent successfully!"))
      .catch(() => alert("Failed to send message."));
  };
  return (
    <main className={styles.page}>
      <div className={styles.grain} aria-hidden="true" />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Throt-All Elites</p>
          <h1 className={styles.heroTitle}>
            Let's
            <br />
            <span className={styles.heroAccent}>Talk</span>
            <br />
            Machines.
          </h1>
          <div className={styles.heroDivider} />
          <p className={styles.heroSub}>
            Whether you're hunting your next ride, need service, or just want to
            geek out about bikes — we're always in the garage.
          </p>
        </div>

        <div className={styles.heroSlash} aria-hidden="true" />

        <div className={styles.infoStack}>
          <div className={styles.infoCard}>
            <span className={styles.infoIcon}>📍</span>
            <div>
              <p className={styles.infoLabel}>Find Us</p>
              <p className={styles.infoValue}>Tindobato, Banepa</p>
            </div>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoIcon}>📞</span>
            <div>
              <p className={styles.infoLabel}>Call / WhatsApp</p>
              <p className={styles.infoValue}>+977 9823141414</p>
            </div>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoIcon}>🕐</span>
            <div>
              <p className={styles.infoLabel}>Showroom Hours</p>
              <p className={styles.infoValue}>Sun – Fri · 9 AM – 6 PM</p>
              <p className={styles.infoValue}>Saturday · 10 AM – 4 PM</p>
            </div>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoIcon}>✉️</span>
            <div>
              <p className={styles.infoLabel}>Email</p>
              <p className={styles.infoValue}>throtallelites@gmail.com</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.contactSection}>
        <div className={styles.contactContainer}>
          <div className={styles.grid}>
            <div className={styles.formSide}>
              <span className={styles.formTag}>— Drop a message</span>
              <h2 className={styles.formTitle}>Get In Touch</h2>
              <p className={styles.formSubtitle}>
                Have a specific inquiry? Our experienced team is ready to roll.
              </p>

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formFields}>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    className={styles.input}
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />

                  <input
                    type="text"
                    name="street"
                    placeholder="Street"
                    className={styles.input}
                    value={formData.street}
                    onChange={handleChange}
                  />

                  <div className={styles.row}>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      className={styles.input}
                      value={formData.city}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="postcode"
                      placeholder="Postcode"
                      className={styles.input}
                      value={formData.postcode}
                      onChange={handleChange}
                    />
                  </div>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone No."
                    className={styles.input}
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className={styles.input}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                  <textarea
                    name="message"
                    placeholder="Write your message — bike model, budget, questions..."
                    className={styles.textarea}
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  Send Message
                </button>
              </form>

              <ul className={styles.contactList}>
                <li className={styles.contactItem}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 479.058 479.058"
                    className={styles.contactIcon}
                  >
                    <path d="M434.146 59.882H44.912C20.146 59.882 0 80.028 0 104.794v269.47c0 24.766 20.146 44.912 44.912 44.912h389.234c24.766 0 44.912-20.146 44.912-44.912v-269.47c0-24.766-20.146-44.912-44.912-44.912zm0 29.941c2.034 0 3.969.422 5.738 1.159L239.529 264.631 39.173 90.982a14.902 14.902 0 0 1 5.738-1.159zm0 299.411H44.912c-8.26 0-14.971-6.71-14.971-14.971V122.615l199.778 173.141c2.822 2.441 6.316 3.655 9.81 3.655s6.988-1.213 9.81-3.655l199.778-173.141v251.649c-.001 8.26-6.711 14.97-14.971 14.97z" />
                  </svg>
                  <a
                    href="mailto:throtallelites@gmail.com"
                    className={styles.contactLink}
                  >
                    throtallelites@gmail.com
                  </a>
                </li>
                <li className={styles.contactItem}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 482.6 482.6"
                    className={styles.contactIcon}
                  >
                    <path d="M98.339 320.8c47.6 56.9 104.9 101.7 170.3 133.4 24.9 11.8 58.2 25.8 95.3 28.2 2.3.1 4.5.2 6.8.2 24.9 0 44.9-8.6 61.2-26.3.1-.1.3-.3.4-.5 5.8-7 12.4-13.3 19.3-20 4.7-4.5 9.5-9.2 14.1-14 21.3-22.2 21.3-50.4-.2-71.9l-60.1-60.1c-10.2-10.6-22.4-16.2-35.2-16.2-12.8 0-25.1 5.6-35.6 16.1l-35.8 35.8c-3.3-1.9-6.7-3.6-9.9-5.2-4-2-7.7-3.9-11-6-32.6-20.7-62.2-47.7-90.5-82.4-14.3-18.1-23.9-33.3-30.6-48.8 9.4-8.5 18.2-17.4 26.7-26.1 3-3.1 6.1-6.2 9.2-9.3 10.8-10.8 16.6-23.3 16.6-36s-5.7-25.2-16.6-36l-29.8-29.8c-3.5-3.5-6.8-6.9-10.2-10.4-6.6-6.8-13.5-13.8-20.3-20.1-10.3-10.1-22.4-15.4-35.2-15.4-12.7 0-24.9 5.3-35.6 15.5l-37.4 37.4c-13.6 13.6-21.3 30.1-22.9 49.2-1.9 23.9 2.5 49.3 13.9 80 17.5 47.5 43.9 91.6 83.1 138.7zm-72.6-216.6c1.2-13.3 6.3-24.4 15.9-34l37.2-37.2c5.8-5.6 12.2-8.5 18.4-8.5 6.1 0 12.3 2.9 18 8.7 6.7 6.2 13 12.7 19.8 19.6 3.4 3.5 6.9 7 10.4 10.6l29.8 29.8c6.2 6.2 9.4 12.5 9.4 18.7s-3.2 12.5-9.4 18.7c-3.1 3.1-6.2 6.3-9.3 9.4-9.3 9.4-18 18.3-27.6 26.8l-.5.5c-8.3 8.3-7 16.2-5 22.2.1.3.2.5.3.8 7.7 18.5 18.4 36.1 35.1 57.1 30 37 61.6 65.7 96.4 87.8 4.3 2.8 8.9 5 13.2 7.2 4 2 7.7 3.9 11 6 .4.2.7.4 1.1.6 3.3 1.7 6.5 2.5 9.7 2.5 8 0 13.2-5.1 14.9-6.8l37.4-37.4c5.8-5.8 12.1-8.9 18.3-8.9 7.6 0 13.8 4.7 17.7 8.9l60.3 60.2c12 12 11.9 25-.3 37.7-4.2 4.5-8.6 8.8-13.3 13.3-7 6.8-14.3 13.8-20.9 21.7-11.5 12.4-25.2 18.2-42.9 18.2-1.7 0-3.5-.1-5.2-.2-32.8-2.1-63.3-14.9-86.2-25.8-62.2-30.1-116.8-72.8-162.1-127-37.3-44.9-62.4-86.7-79-131.5-10.3-27.5-14.2-49.6-12.6-69.7z" />
                  </svg>
                  <a href="tel:+9779823141414" className={styles.contactLink}>
                    +977 9823141414
                  </a>
                </li>
              </ul>
            </div>

            <div className={styles.mapSide}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3534.58!2d85.5191!3d27.6312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1d94e2c73b5b%3A0x5fef7aee25e33d2!2sTindobato%2C+Banepa!5e0!3m2!1sen!2snp!4v1730000000000!5m2!1sen!2snp"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Throt-All Elites Showroom - Tindobato, Banepa"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
