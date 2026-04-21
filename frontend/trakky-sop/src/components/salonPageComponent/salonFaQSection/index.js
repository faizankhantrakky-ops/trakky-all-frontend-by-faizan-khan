"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "../../icon";
import { SalonFAQData } from "@/mock/data";

// Icon rotate animation
const rotateVariants = {
  open: { rotate: 45 },
  closed: { rotate: 0 },
};

// Content slide + fade animation (super smooth)
const contentVariants = {
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
      opacity: { duration: 0.3, ease: "easeOut" },
    },
  },
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
      opacity: { duration: 0.2, ease: "easeIn" },
    },
  },
};

const SalonFAQSection = () => {
  const [activeId, setActiveId] = useState(null);
  const [faqData] = useState(SalonFAQData);

  const toggleFAQ = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section className="bg-white py-10 lg:py-24">
      <div className="max-w-[1200px] px-8 xl:px-0 mx-auto">
        <h2 className="text-4xl !leading-[3rem] md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-12 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {faqData.map((faq) => (
            <div
              key={faq.id}
              className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full flex justify-between items-center px-6 py-5 bg-[#5E38D1]/10 hover:bg-[#5E38D1]/20 transition-colors duration-300 font-semibold text-[#5E38D1] text-lg text-left"
                aria-expanded={activeId === faq.id}
                aria-controls={`faq-answer-${faq.id}`}
                id={`faq-question-${faq.id}`}
              >
                <span>{faq.question}</span>

                <motion.span
                  variants={rotateVariants}
                  animate={activeId === faq.id ? "open" : "closed"}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-2xl ml-4 flex-shrink-0"
                >
                  <Icon icon="ic:baseline-add" />
                </motion.span>
              </button>

              {/* Answer - Super Smooth Animation */}
              <AnimatePresence initial={false}>
                {activeId === faq.id && (
                  <motion.div
                    variants={contentVariants}
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    className="overflow-hidden"
                  >
                    <div
                      id={`faq-answer-${faq.id}`}
                      role="region"
                      aria-labelledby={`faq-question-${faq.id}`}
                      className="px-6 pb-6 pt-2 bg-[#5E38D1]/5 text-gray-700 select-text"
                    >
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SalonFAQSection;