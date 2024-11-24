import React from "react";
import styles from "./contactStyle.module.css";

const ContactUs = () => {
  return (
    <div className={styles.contactContainer}>
      <h2 className={styles.title}>Contact Us</h2>
      <p className={styles.description}>
        Have any questions or feedback? Feel free to reach out to us!
      </p>
      <form className={styles.contactForm}>
        <label className={styles.label}>
          Name:
          <input type="text" placeholder="Your Name" className={styles.input} />
        </label>
        <label className={styles.label}>
          Email:
          <input
            type="email"
            placeholder="Your Email"
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Message:
          <textarea
            placeholder="Your Message"
            className={styles.textarea}
          ></textarea>
        </label>
        <button type="submit" className={styles.submitButton}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
