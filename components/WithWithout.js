"use client";

import { useEffect, useRef } from "react";

// A useful component when your product is challenging the status quo.
// Highlight the current pain points (left) and how your product is solving them (right)
// Try to match the lines from left to right, so the user can easily compare the two columns
const WithWithout = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.scroll-animate').forEach((el, index) => {
              setTimeout(() => {
                el.classList.add('animate-scaleIn');
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="transparent" ref={sectionRef}>
      <div className="max-w-5xl mx-auto px-8 py-16 md:py-32">
        <h2 className="scroll-animate text-center font-extrabold text-3xl md:text-5xl lg:text-6xl tracking-tight mb-12 md:mb-20">
          Why settle for <span className="text-error">boring</span> surveys?
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-6 md:gap-8">
          <div className="scroll-animate stagger-1 bg-error/20 text-error p-8 md:p-12 rounded-2xl w-full border-2 border-error/30 hover:border-error/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <h3 className="font-bold text-xl md:text-2xl mb-6 flex items-center gap-2">
              <span className="text-3xl">😔</span>
              Traditional Surveys
            </h3>

            <ul className="space-y-3">
              {/* Pains the user is experiencing by not using your product */}
              {[
                "85% abandonment rate",
                "Spend hours writing questions",
                "Boring, forgettable experience",
                "Low response quality",
                "Zero viral potential",
                "Manual data analysis",
              ].map((item, index) => (
                <li key={index} className="flex gap-3 items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-5 h-5 shrink-0 opacity-75 mt-0.5"
                  >
                    <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                  </svg>
                  <span className="text-base md:text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="scroll-animate stagger-2 bg-success/20 text-success p-8 md:p-12 rounded-2xl w-full border-2 border-success/30 hover:border-success/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <h3 className="font-bold text-xl md:text-2xl mb-6 flex items-center gap-2">
              <span className="text-3xl">✨</span>
              With AI Character Rewards
            </h3>

            <ul className="space-y-3">
              {/* Features of your product fixing the pain (try to match each with/withot lines) */}
              {[
                "Increase completion rate",
                "AI generates questions for you",
                "Memorable AI avatar reward",
                "Engaged, quality responses",
                "Built-in viral sharing",
                "Auto-generated insights",
              ].map((item, index) => (
                <li key={index} className="flex gap-3 items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-5 h-5 shrink-0 opacity-75 mt-0.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <span className="text-base md:text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WithWithout;
