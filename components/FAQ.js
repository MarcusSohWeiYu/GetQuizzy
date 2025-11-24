"use client";

import { useRef, useState, useEffect } from "react";

// <FAQ> component is a lsit of <Item> component
// Just import the FAQ & add your FAQ content to the const faqList

const faqList = [
  {
    question: "Is it really free? What's the catch?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        <p>
          Yes, 100% free! Create unlimited surveys with unlimited questions and unlimited responses. No credit card required, no hidden fees, no &ldquo;free trial&rdquo; that converts to paid.
        </p>
        <p>
          We keep it free by showing small ads on survey pages. You don&apos;t pay anything—we monetize through advertising so you can focus on getting responses.
        </p>
      </div>
    ),
  },
  {
    question: "How does the AI avatar generation work?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        <p>
          When someone completes your survey, our AI analyzes their responses and generates a unique character avatar that matches their personality profile. It uses DALL-E 3 for stunning, creative images.
        </p>
        <p>
          Each avatar is completely unique and personalized. Users get excited to finish the survey because they want to see &ldquo;their character&rdquo;—this boosts completion rates by 70%+.
        </p>
      </div>
    ),
  },
  {
    question: "Can the AI really write my survey questions?",
    answer: (
      <p>
        Absolutely! Just tell us what you want to learn (e.g., &ldquo;customer satisfaction for my coffee shop&rdquo; or &ldquo;personality quiz about travel styles&rdquo;), and our AI will generate professional, relevant questions in seconds. You can edit them or use them as-is. It&apos;s like having a survey expert on demand.
      </p>
    ),
  },
  {
    question: "How does the viral sharing work?",
    answer: (
      <p>
        After completing your survey, respondents get a &ldquo;Share Your Avatar&rdquo; button. One click lets them post their AI character to social media with a link back to your survey. Their friends see the cool avatar, get curious, and take your survey too. It&apos;s exponential growth on autopilot—no ads needed.
      </p>
    ),
  },
  {
    question: "What kind of insights will I get?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        <p>
          Our AI automatically analyzes all responses and generates insights like: most common answers, trends over time, audience segments, drop-off points, and key takeaways.
        </p>
        <p>
          No need to export to Excel or manually crunch numbers. You get smart summaries, visualizations, and actionable recommendations instantly.
        </p>
      </div>
    ),
  },
  {
    question: "What types of surveys can I create?",
    answer: (
      <p>
        Anything! Personality quizzes, customer feedback forms, market research, employee engagement surveys, event registrations, trivia quizzes, &ldquo;Which character are you?&rdquo; quizzes, product research—if it needs questions and answers, you can build it here.
      </p>
    ),
  },
  {
    question: "Do I need any technical skills?",
    answer: (
      <p>
        Nope! Our builder is designed for anyone. Just type your questions (or let AI generate them), choose answer types, and publish. No coding, no design skills, no complicated setup. If you can use Google Forms, you can use this—but way more powerful and engaging.
      </p>
    ),
  },
  {
    question: "Can I customize how the survey looks?",
    answer: (
      <p>
        Yes! You can customize colors, add your logo, write custom result descriptions, and personalize the AI avatar prompts. Make it match your brand while keeping the core engagement features that drive completions.
      </p>
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
            Everything you need to know about creating engaging surveys with AI character rewards.
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
