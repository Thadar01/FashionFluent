"use client";
import { useEffect, useRef, useState } from "react";
import NavBar from "./commom/NavBar";
import Footer from "./commom/Footer";

const faqs = [
  {
    question: "How to order?",
    answer:
      "You can add your desired products into cart. Then, go to the cart and click the checkout button and fill the checkout form. Finally, you can finish your order by confirm button.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "No, we do not offer internationally for now but we have plan to expand.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once you ordered, we confirm your order and send the process through via email.",
  },
  {
    question: "How do I know what size to order?",
    answer:
      "Each product page includes a size guide. We recommend checking it before placing your order.",
  },
  {
    question: "How do I know what color to order?",
    answer:
      "Each product page includes a color guide. We recommend checking it before placing your order.",
  },
  {
    question: "How can I get promotion?",
    answer: "To grab our promotion, you need to register member.",
  },
  {
    question: "How do I know which product have promotion?",
    answer: "We show the promotion details on the product we promoted.",
  },
];

export default function QA() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <NavBar />
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Frequently Asked Questions
          </h1>
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={isOpen}
                  onClick={() => toggleFAQ(index)}
                />
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function FAQItem({ question, answer, isOpen, onClick }) {
  const contentRef = useRef(null); // ✅ fixed syntax
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen]);

  return (
    <div className="border border-black rounded-md overflow-hidden transition-all duration-300 relative">
      <button
        onClick={onClick}
        className="w-full text-left px-6 py-4 focus:outline-none flex justify-between items-center "
      >
        <span className="font-medium text-gray-900">{question}</span>
        <span className="text-xl">
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="black"
              className="size-4 absolute top-4 right-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 15.75 7.5-7.5 7.5 7.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="black"
              className="size-4 absolute top-4 right-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          )}
        </span>
      </button>
      <div
        ref={contentRef}
        className="px-6 overflow-hidden transition-all duration-300 ease-in-out text-gray-700"
        style={{
          maxHeight: isOpen ? `${height}px` : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="pb-4 pt-1">{answer}</div>
      </div>
    </div>
  );
}
