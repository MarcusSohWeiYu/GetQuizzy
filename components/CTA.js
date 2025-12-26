"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import config from "@/config";

const CTA = () => {
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
    <section className="relative overflow-hidden rounded-3xl mb-20 md:mb-32 border border-purple-500/30">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-gray-900/90 to-pink-900/90"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div ref={sectionRef} className="relative text-center p-8 md:p-16 lg:p-20 z-10">
        <div className="flex flex-col items-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="scroll-animate inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300 text-sm font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Join hundreds of businesses boosting completion rates
          </div>

          <h2 className="scroll-animate font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6 leading-tight text-white">
            Create Your First Reward-Based Survey
            <span className="block mt-3 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 text-transparent bg-clip-text">
              in Under 5 Minutes
            </span>
          </h2>
          
          <p className="scroll-animate text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
            No credit card. No setup fees. No catch. Start collecting responses with discount codes, AI avatars, and custom CTAs today.
          </p>

          {/* Benefits Grid */}
          <div className="scroll-animate grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 w-full max-w-3xl">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-white font-medium text-sm">Free Forever</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-white font-medium text-sm">Setup in 5 Minutes</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <span className="text-white font-medium text-sm">All Components Included</span>
            </div>
          </div>

          <button 
            onClick={() => router.push(status === "authenticated" ? config.auth.callbackUrl : "/signin")}
            className="scroll-animate bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-base md:text-lg px-10 py-5 rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 flex items-center gap-3 group relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative flex items-center gap-3">
              {status === "authenticated" ? "Go to Dashboard" : "Start Building Your Survey - It's Free"}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-200">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </button>

          <p className="scroll-animate text-sm text-gray-400 mt-4">
            🔒 No credit card required • Cancel anytime • Used by 500+ businesses
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
