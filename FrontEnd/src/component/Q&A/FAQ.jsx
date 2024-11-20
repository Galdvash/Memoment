import React, { useState } from "react";
import styless from "./FAQ.module.css";
import faqData from "../../Library/faqData";

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className={styless.faqContainer}>
      <h2 className={styless.faqTitle}>שאלות ותשובות</h2>
      <div className={styless.faqInnerContainer}>
        <div className={styless.faqQuestions}>
          {faqData.map((item) => (
            <div
              key={item.id}
              className={`${styless.faqItem} ${
                openFAQ === item.id ? styless.active : ""
              }`}
              onClick={() => toggleFAQ(item.id)}
            >
              <span>{item.question}</span>
            </div>
          ))}
        </div>
        <div className={styless.faqAnswers}>
          {faqData.map((item) => (
            <div
              key={item.id}
              className={`${styless.faqAnswerContent} ${
                openFAQ === item.id ? styless.show : ""
              }`}
            >
              <h2 className={styless.faqAnswerTitle}>{item.title}</h2>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
