import React, { useState } from "react";
import styles from "./FAQ.module.css";
import faqData from "../../Library/faqData";

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className={styles.faqContainer}>
      <h2 className={styles.faqTitle}>שאלות ותשובות</h2>
      <div className={styles.faqInnerContainer}>
        <div className={styles.faqQuestions}>
          {faqData.map((item) => (
            <div
              key={item.id}
              className={`${styles.faqItem} ${
                openFAQ === item.id ? styles.active : ""
              }`}
              onClick={() => toggleFAQ(item.id)}
            >
              <span>{item.question}</span>
            </div>
          ))}
        </div>
        <div className={styles.faqAnswers}>
          {faqData.map((item) => (
            <div
              key={item.id}
              className={`${styles.faqAnswerContent} ${
                openFAQ === item.id ? styles.show : ""
              }`}
            >
              <h2 className={styles.faqAnswerTitle}>{item.title}</h2>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
