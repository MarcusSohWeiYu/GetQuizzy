"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import TestimonialsAvatars from "./TestimonialsAvatars";
import config from "@/config";

const Hero = () => {
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
    <section 
      ref={sectionRef}
      className="relative max-w-7xl mx-auto bg-base-100 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20 overflow-hidden"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start z-10">
        <h1 className="scroll-animate font-extrabold text-4xl lg:text-6xl tracking-tight md:-mb-4 leading-tight">
          Boring Surveys? <br />
          <span className="gradient-text">Add AI Magic</span>
          <span className="inline-block animate-wiggle ml-2">✨</span>
        </h1>
        <p className="scroll-animate text-lg lg:text-xl opacity-80 leading-relaxed max-w-xl">
          Turn surveys into experiences people want to complete. 
          End every quiz with a custom AI character reveal.
        </p>
        <button className="scroll-animate bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-orange-500/50 flex items-center gap-3 group">
          Create Your First Quiz
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
      <div className="lg:w-full scroll-animate">
        <div className="relative hover-lift rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src='/Hero-Image.png'
            alt="Product Demo"
            className="w-full rounded-2xl"
            priority={true}
            width={500}
            height={500}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
