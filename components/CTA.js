"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import config from "@/config";

const CTA = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.scroll-animate').forEach((el, index) => {
              setTimeout(() => {
                el.classList.add('animate-fadeInUp');
              }, index * 100);
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
    <section className="relative hero overflow-hidden min-h-[60vh] md:min-h-[70vh] rounded-3xl mb-20 md:mb-32">
      <Image
        src="/CTA-Image.png"
        alt="Background"
        className="object-cover w-full"
        fill
      />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-neutral/70 to-pink-900/80"></div>
      <div ref={sectionRef} className="relative hero-content text-center text-neutral-content p-8 z-10">
        <div className="flex flex-col items-center max-w-2xl p-8 md:p-0">
          <h2 className="scroll-animate font-extrabold text-4xl md:text-6xl tracking-tight mb-6 md:mb-8 leading-tight">
            Ready to create 
            <span className="block mt-2 bg-gradient-to-r from-yellow-300 to-pink-300 text-transparent bg-clip-text">
              surveys people love?
            </span>
          </h2>
          <p className="scroll-animate text-xl md:text-2xl opacity-90 mb-10 md:mb-14 leading-relaxed">
            Join thousands of creators turning boring surveys into viral experiences with AI-powered character rewards.
          </p>

          <button className="scroll-animate btn btn-gradient btn-lg btn-wide text-lg hover:scale-105 transition-all duration-200 shadow-2xl">
            Get Started Free
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
          <p className="scroll-animate text-sm opacity-70 mt-4">No credit card required • Unlimited surveys forever</p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
