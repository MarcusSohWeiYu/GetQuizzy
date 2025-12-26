"use client";

import { useRef, useState, useEffect } from "react";

// <FAQ> component is a lsit of <Item> component
// Just import the FAQ & add your FAQ content to the const faqList

const faqList = [
  {
    question: "What reward components can I add to my surveys?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        <p>
          You can choose from 5 powerful reward components: <strong>Discount Codes</strong> (perfect for e-commerce), <strong>Custom CTA Buttons</strong> (drive traffic anywhere), <strong>AI Avatars</strong> (personality results), <strong>Personalized Messages</strong> (product recommendations), and <strong>Custom AI Content</strong>.
        </p>
        <p>
          The best part? You can combine multiple components in a single survey! For example, show a personalized skincare routine + discount code + CTA button to your store.
        </p>
      </div>
    ),
  },
  {
    question: "How do discount codes work?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        <p>
          After completing your survey, customers instantly receive a discount code they can use at checkout. You set the code, discount amount, validity period, and terms.
        </p>
        <p>
          This creates a powerful incentive to finish the survey and encourages repeat purchases. Perfect for fashion stores, restaurants, beauty brands, and any business that wants to reward customer feedback with tangible value.
        </p>
      </div>
    ),
  },
  {
    question: "Can I drive traffic to my website or social media?",
    answer: (
      <p>
        Absolutely! Add custom CTA buttons at the end of your survey that link anywhere: your online store, product pages, Instagram, Facebook, booking systems, or any URL. Convert survey respondents into customers, followers, or subscribers with one strategic click.
      </p>
    ),
  },
  {
    question: "What are personalized AI messages?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        <p>
          Based on survey responses, you can show custom recommendations, advice, or content. Examples: personalized skincare routines based on skin type, product recommendations based on preferences, or wellness plans based on goals.
        </p>
        <p>
          This creates a valuable, educational experience that builds trust and positions your brand as helpful—not just collecting data.
        </p>
      </div>
    ),
  },
  {
    question: "Is this only for e-commerce businesses?",
    answer: (
      <p>
        Not at all! Our reward components work for any business: e-commerce stores (discount codes), restaurants (loyalty rewards + social CTAs), SaaS companies (personality quizzes + trial CTAs), beauty brands (personalized routines + product links), service businesses (booking CTAs), and more. If you want higher survey completion rates, we have a solution for you.
      </p>
    ),
  },
  {
    question: "Do I need any technical skills?",
    answer: (
      <p>
        Nope! Our builder is super simple. Create your questions, choose which reward components to show at the end, customize the content and colors, then publish. No coding, no design skills needed. If you can create a Google Form, you can create engaging reward-based surveys here—but 10x more powerful.
      </p>
    ),
  },
  {
    question: "What types of surveys can I create?",
    answer: (
      <p>
        Anything! Customer feedback surveys, product research, personality quizzes, skincare finders, style quizzes, market research, post-purchase surveys, event feedback, restaurant reviews, employee engagement—any survey where you want high completion rates and conversion opportunities.
      </p>
    ),
  },
  {
    question: "How much does it cost?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        <p>
          Guess what... its free of charge!!
        </p>
      </div>
    ),
  },
];

const Item = ({ item }) => {
  const accordion = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li className="border-t border-base-content/10 hover:bg-base-100/50 transition-colors duration-200 rounded-lg">
      <button
        className="relative flex gap-2 items-center w-full py-5 px-4 text-base font-semibold text-left md:text-lg"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        <span
          className={`flex-1 text-base-content transition-colors duration-200 ${isOpen ? "text-primary" : ""}`}
        >
          {item?.question}
        </span>
        <svg
          className={`flex-shrink-0 w-5 h-5 ml-auto fill-current transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center transition duration-200 ease-out ${
              isOpen && "rotate-180"
            }`}
          />
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center rotate-90 transition duration-200 ease-out ${
              isOpen && "rotate-180 hidden"
            }`}
          />
        </svg>
      </button>

      <div
        ref={accordion}
        className={`transition-all duration-300 ease-in-out opacity-80 overflow-hidden`}
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 px-4 leading-relaxed">{item?.answer}</div>
      </div>
    </li>
  );
};

const FAQ = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.scroll-animate').forEach((el, index) => {
              setTimeout(() => {
                el.classList.add('animate-fadeInUp');
              }, index * 50);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="transparent" id="faq">
      <div ref={sectionRef} className="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        <div className="flex flex-col text-left basis-1/2 scroll-animate">
          <p className="inline-block font-semibold text-primary mb-4 text-lg">FAQ</p>
          <p className="sm:text-5xl text-4xl font-extrabold text-base-content mb-6">
            Frequently Asked Questions
          </p>
          <p className="text-lg opacity-70">
            Everything you need to know about boosting survey completion rates with reward components.
          </p>
        </div>

        <ul className="basis-1/2 space-y-2 scroll-animate">
          {faqList.map((item, i) => (
            <Item key={i} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FAQ;
