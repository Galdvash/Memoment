// FAQ.jsx
import React, { useState } from "react";
import "./FAQ.css";

const FAQ = () => {
  const faqData = [
    {
      id: 1,
      question: "מהי טכנולוגיית זיהוי הפנים?",
      answer:
        "טכנולוגיית זיהוי הפנים היא שיטה לזיהוי או אימות זהות אדם באמצעות דפוסי הפנים שלו.",
    },
    {
      id: 2,
      question: "איך ניתן להשתמש בזיהוי פנים באירועים?",
      answer:
        "ניתן להשתמש בזיהוי פנים כדי לאפשר לאורחים למצוא את תמונותיהם בגלריה דיגיטלית בצורה מהירה ובטוחה.",
    },
    {
      id: 3,
      question: "האם המידע שנאסף בטוח?",
      answer: "כן, כל המידע מאובטח ונשמר בהתאם לתקני אבטחה מחמירים.",
    },
    {
      id: 4,
      question: "כיצד ניתן ליצור אירוע חדש?",
      answer:
        "ניתן ליצור אירוע חדש בכמה דקות באמצעות הפלטפורמה שלנו, בלי צורך בידע טכני.",
    },
    // ניתן להוסיף שאלות נוספות כאן
  ];

  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="faq-container">
      <h2 className="faq-title">שאלות נפוצות</h2>
      <div className="faq-list">
        {faqData.map((item) => (
          <div key={item.id} className="faq-item">
            <button
              className="faq-question"
              onClick={() => toggleFAQ(item.id)}
              aria-expanded={openFAQ === item.id}
              aria-controls={`faq-answer-${item.id}`}
              id={`faq-question-${item.id}`}
            >
              <span>{item.question}</span>
              <span
                className={`arrow ${openFAQ === item.id ? "down" : "up"}`}
              ></span>
            </button>
            <div
              id={`faq-answer-${item.id}`}
              className={`faq-answer ${openFAQ === item.id ? "open" : ""}`}
              role="region"
              aria-labelledby={`faq-question-${item.id}`}
            >
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
