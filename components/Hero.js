"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TestimonialsAvatars from "./TestimonialsAvatars";
import SurveyPreview from "./SurveyPreview";
import config from "@/config";

const Hero = () => {
  const sectionRef = useRef(null);
  const { data: session, status } = useSession();
  const router = useRouter();

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
      className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 px-8 py-8 lg:py-20 overflow-visible"
    >
      {/* Floating background elements - extended beyond bounds */}
      <div className="absolute -inset-40 pointer-events-none -z-10">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="flex flex-col gap-6 lg:gap-8 items-center text-center lg:text-left lg:items-start relative z-10 lg:flex-1 max-w-2xl">
        {/* Badge */}
        <div className="scroll-animate inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-sm font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          Reward-Based Survey Builder
        </div>

        <h1 className="scroll-animate font-extrabold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-tight text-white">
          Create Surveys{" "}
          <br />
          <span className="relative inline-block mt-2">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text">
              People Love Finishing
            </span>
          </span>
        </h1>

        <p className="scroll-animate text-lg lg:text-xl xl:text-2xl text-gray-300 leading-relaxed font-medium">
          Boost completion rates with{" "}
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-lg"></span>
            <span className="relative text-white font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">rewarding endings</span>
          </span>{" "}
          — AI avatars, discount codes, custom messages & more. Mix and match components to create unforgettable experiences.
        </p>

        {/* Features List */}
        <div className="scroll-animate flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-white text-sm font-medium">AI Avatars</span>
          </div>
          <div className="flex items-center gap-2 bg-pink-500/10 border border-pink-500/30 rounded-full px-4 py-2">
            <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-white text-sm font-medium">Discount Codes</span>
          </div>
          <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-2">
            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-white text-sm font-medium">Custom CTAs</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-white text-sm font-medium">AI Messages</span>
          </div>
        </div>

        <button 
          onClick={() => router.push(status === "authenticated" ? config.auth.callbackUrl : "/signin")}
          className="scroll-animate bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-base lg:text-lg px-8 lg:px-10 py-4 lg:py-5 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 inline-flex items-center gap-3 group relative overflow-hidden"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative flex items-center gap-3">
            {status === "authenticated" ? "Go to Dashboard" : "Create Your First Quiz Free"}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 lg:w-6 lg:h-6 group-hover:translate-x-2 transition-transform duration-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </button>
      </div>

      <div className="w-full lg:flex-1 scroll-animate relative max-w-2xl">
        {/* Try it callout */}
        <div className="flex justify-center mb-6 animate-bounce">
          <span className="text-purple-400 font-bold text-sm md:text-base bg-purple-500/10 px-4 md:px-6 py-2 rounded-full border border-purple-500/30">
            👇 Try different examples
          </span>
        </div>
        
        {/* Subtle spotlight effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-3xl blur-2xl -z-10"></div>
        
        <div className="relative">
          <SurveyPreview />
        </div>
      </div>
    </section>
  );
};

export default Hero;
