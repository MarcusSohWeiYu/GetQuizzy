"use client";

import { useState } from "react";

const SurveyPreview = () => {
  const [activeTab, setActiveTab] = useState("ecommerce");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const surveyExamples = {
    ecommerce: {
      title: "Fashion Store Feedback",
      badge: "🛍️ E-commerce",
      color: "purple",
      questions: [
        {
          id: 1,
          question: "How would you rate your overall shopping experience?",
          options: [
            { text: "⭐⭐⭐⭐⭐ Excellent!", value: "excellent" },
            { text: "⭐⭐⭐⭐ Pretty good", value: "good" },
            { text: "⭐⭐⭐ Average", value: "average" },
            { text: "⭐⭐ Needs improvement", value: "poor" }
          ]
        },
        {
          id: 2,
          question: "What did you think of our product quality?",
          options: [
            { text: "Amazing quality! 💯", value: "amazing" },
            { text: "Good, met expectations", value: "good" },
            { text: "Okay, could be better", value: "okay" },
            { text: "Not satisfied", value: "poor" }
          ]
        },
        {
          id: 3,
          question: "How likely are you to shop with us again?",
          options: [
            { text: "Definitely! Already planning my next order 🎉", value: "very" },
            { text: "Probably will", value: "likely" },
            { text: "Maybe", value: "maybe" },
            { text: "Unlikely", value: "unlikely" }
          ]
        }
      ],
      resultType: "discount"
    },
    saas: {
      title: "Product Feedback Quiz",
      badge: "💻 SaaS",
      color: "blue",
      questions: [
        {
          id: 1,
          question: "How easy was it to get started with our product?",
          options: [
            { text: "Super easy! Up and running in minutes 🚀", value: "easy" },
            { text: "Pretty straightforward", value: "okay" },
            { text: "Needed some help", value: "difficult" },
            { text: "Very confusing", value: "verydifficult" }
          ]
        },
        {
          id: 2,
          question: "Which feature do you use the most?",
          options: [
            { text: "Dashboard & Analytics 📊", value: "dashboard" },
            { text: "Team Collaboration 👥", value: "team" },
            { text: "Automation Tools ⚡", value: "automation" },
            { text: "Integrations 🔌", value: "integrations" }
          ]
        },
        {
          id: 3,
          question: "What would make our product even better?",
          options: [
            { text: "More integrations", value: "integrations" },
            { text: "Better mobile app", value: "mobile" },
            { text: "Advanced features", value: "features" },
            { text: "It's already perfect! ✨", value: "perfect" }
          ]
        }
      ],
      resultType: "avatar"
    },
    restaurant: {
      title: "Dining Experience Survey",
      badge: "🍕 Restaurant",
      color: "orange",
      questions: [
        {
          id: 1,
          question: "How was your meal today?",
          options: [
            { text: "Absolutely delicious! 😋", value: "delicious" },
            { text: "Pretty tasty!", value: "good" },
            { text: "It was okay", value: "okay" },
            { text: "Not great", value: "poor" }
          ]
        },
        {
          id: 2,
          question: "How was our service?",
          options: [
            { text: "Outstanding! Super friendly 🌟", value: "outstanding" },
            { text: "Good service", value: "good" },
            { text: "Average", value: "average" },
            { text: "Needs improvement", value: "poor" }
          ]
        },
        {
          id: 3,
          question: "Would you recommend us to friends?",
          options: [
            { text: "Already telling everyone! 📣", value: "yes" },
            { text: "Yes, definitely", value: "probably" },
            { text: "Maybe", value: "maybe" },
            { text: "Probably not", value: "no" }
          ]
        }
      ],
      resultType: "cta"
    },
    skincare: {
      title: "Find Your Perfect Routine",
      badge: "✨ Skincare",
      color: "pink",
      questions: [
        {
          id: 1,
          question: "What's your main skin concern?",
          options: [
            { text: "Acne & breakouts 😫", value: "acne" },
            { text: "Dryness & dehydration 🏜️", value: "dry" },
            { text: "Oily & shiny skin ✨", value: "oily" },
            { text: "Aging & fine lines ⏰", value: "aging" }
          ]
        },
        {
          id: 2,
          question: "How does your skin feel by midday?",
          options: [
            { text: "Tight and uncomfortable", value: "tight" },
            { text: "Shiny, especially T-zone", value: "shiny" },
            { text: "Comfortable and balanced", value: "balanced" },
            { text: "Dry patches with oily areas", value: "combination" }
          ]
        },
        {
          id: 3,
          question: "What's your current skincare routine like?",
          options: [
            { text: "Just water and moisturizer 💧", value: "minimal" },
            { text: "Basic 3-step routine", value: "basic" },
            { text: "Full 10-step routine 🧴", value: "advanced" },
            { text: "What routine? 😅", value: "none" }
          ]
        }
      ],
      resultType: "message"
    }
  };

  const currentSurvey = surveyExamples[activeTab];
  const questions = currentSurvey.questions;

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Last question - show loading then result
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setShowResult(true);
      }, 2000); // 2 second loading
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  // Loading Screen
  if (isLoading) {
    const loadingMessages = {
      ecommerce: "Processing your feedback...",
      saas: "Analyzing your responses...",
      restaurant: "Preparing your thank you...",
      skincare: "Analyzing your skin profile..."
    };

    const borderColors = {
      purple: "border-purple-500/30",
      blue: "border-blue-500/30",
      orange: "border-orange-500/30",
      pink: "border-pink-500/30"
    };

    return (
      <div className={`w-full max-w-2xl mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl border ${borderColors[currentSurvey.color]} overflow-hidden`}>
        <div className="p-16 flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className={`w-20 h-20 border-4 ${borderColors[currentSurvey.color]} border-t-${currentSurvey.color}-500 rounded-full animate-spin`}></div>
          </div>
          <h3 className="text-2xl font-bold text-white">{loadingMessages[activeTab]}</h3>
          <p className="text-gray-400 text-center">Just a moment ✨</p>
        </div>
      </div>
    );
  }

  // Result Screen
  if (showResult) {
    const colorMap = {
      purple: { from: "from-purple-600", to: "to-pink-600", border: "border-purple-500/30", text: "text-purple-400" },
      blue: { from: "from-blue-600", to: "to-cyan-600", border: "border-blue-500/30", text: "text-blue-400" },
      orange: { from: "from-orange-600", to: "to-red-600", border: "border-orange-500/30", text: "text-orange-400" },
      pink: { from: "from-pink-600", to: "to-rose-600", border: "border-pink-500/30", text: "text-pink-400" }
    };
    const colors = colorMap[currentSurvey.color];

    return (
      <div className={`w-full max-w-2xl mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl border ${colors.border} overflow-hidden`}>
        
        
        <div className="p-8 space-y-6">
          {/* Discount Code Result */}
          {currentSurvey.resultType === "discount" && (
            <>
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-white">
                  Get 20% Off Your Next Purchase!
                </h3>
                <p className="text-gray-300">
                  As a thank you for your valuable feedback, here&apos;s an exclusive discount code:
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500 rounded-xl p-6 text-center">
                <div className="text-sm text-purple-300 mb-2">YOUR DISCOUNT CODE</div>
                <div className="text-4xl font-bold text-white tracking-wider mb-2">FASHION20</div>
                <div className="text-sm text-gray-400">Valid for 30 days</div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">Use at checkout for 20% off</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">Valid on all products</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">Can be combined with sale items</span>
                </div>
              </div>

              {/* CTA Button */}
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-3">
                Visit Our Store Now
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </>
          )}

          {/* AI Avatar Result */}
          {currentSurvey.resultType === "avatar" && (
            <>
              <div className="flex justify-center">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 p-1 shadow-2xl">
                  <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-6xl">
                    🚀
                  </div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                  The Innovation Enthusiast
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed max-w-xl mx-auto">
                  You&apos;re the type who dives right in! You love exploring new features and finding creative ways 
                  to use automation tools. Team collaboration is your jam, and you&apos;re always looking for ways 
                  to optimize workflows. You&apos;re the power user everyone comes to for tips!
                </p>
              </div>
            </>
          )}

          {/* CTA Button Result (Restaurant) */}
          {currentSurvey.resultType === "cta" && (
            <>
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-white">
                  Thank You! Here&apos;s Your Reward
                </h3>
                <p className="text-gray-300 text-lg">
                  We appreciate your feedback! Enjoy a special discount on your next visit.
                </p>
              </div>

              {/* Discount Code */}
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-500 rounded-xl p-6 text-center">
                <div className="text-sm text-orange-300 mb-2">YOUR DISCOUNT CODE</div>
                <div className="text-4xl font-bold text-white tracking-wider mb-2">FOODIE15</div>
                <div className="text-sm text-gray-400">15% off your next meal • Valid for 60 days</div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">Show this code to your server</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">Valid for dine-in and takeout</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">Can&apos;t be combined with other offers</span>
                </div>
              </div>


              {/* Social Media CTAs */}
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-4 rounded-xl hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                  Follow Us on Facebook
                </button>
                
                <button className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold py-4 rounded-xl hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Follow Us on Instagram
                </button>
              </div>

              <p className="text-center text-sm text-gray-400">
                Join our community for exclusive menu updates & surprise discounts!
              </p>
            </>
          )}

          {/* Custom Message Result (Skincare) */}
          {currentSurvey.resultType === "message" && (
            <>
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-6xl shadow-2xl">
                  ✨
                </div>
              </div>

              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 text-transparent bg-clip-text">
                  Your Personalized Skincare Routine
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Based on your skin profile, we&apos;ve created a custom routine just for you! 
                  Follow these steps daily for glowing, healthy skin:
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/30 rounded-xl p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 text-pink-400 font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Gentle Cleanser</h4>
                    <p className="text-gray-300 text-sm">Use a pH-balanced cleanser morning and night to remove impurities</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 text-pink-400 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Hydrating Serum</h4>
                    <p className="text-gray-300 text-sm">Apply hyaluronic acid serum to lock in moisture and plump skin</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 text-pink-400 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">SPF Protection</h4>
                    <p className="text-gray-300 text-sm">Never skip sunscreen! Use SPF 30+ daily to protect from UV damage</p>
                  </div>
                </div>
              </div>

              {/* Discount Code - Consistent Styling */}
              <div className="space-y-4 mt-6">
                <div className="text-center">
                  <p className="text-pink-400 font-semibold text-lg">Special Offer for You! 🎁</p>
                </div>

                <div className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 border-2 border-pink-500 rounded-xl p-6 text-center">
                  <div className="text-sm text-pink-300 mb-2">YOUR DISCOUNT CODE</div>
                  <div className="text-4xl font-bold text-white tracking-wider mb-2">GLOW25</div>
                  <div className="text-sm text-gray-400">25% off skincare bundle • Valid for 30 days</div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4 space-y-2">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300 text-sm">Use at checkout for 25% off</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300 text-sm">Valid on recommended products</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300 text-sm">Free shipping on orders over $50</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold py-4 rounded-xl hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-3">
                  Visit Our Store Now
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            </>
          )}

          {/* Restart Button */}
          <button
            onClick={() => {
              setCurrentQuestion(0);
              setAnswers({});
              setShowResult(false);
            }}
            className={`w-full mt-6 bg-gradient-to-r ${colors.from} ${colors.to} text-white font-bold py-3 rounded-xl hover:scale-105 transition-all duration-200 shadow-lg`}
          >
            Try Other Surveys
          </button>
        </div>
      </div>
    );
  }

  const colorGradients = {
    purple: "from-purple-500 to-pink-500",
    blue: "from-blue-500 to-cyan-500",
    orange: "from-orange-500 to-red-500",
    pink: "from-pink-500 to-rose-500"
  };

  const borderColors = {
    purple: "border-purple-500/30",
    blue: "border-blue-500/30",
    orange: "border-orange-500/30",
    pink: "border-pink-500/30"
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {Object.entries(surveyExamples).map(([key, survey]) => (
          <button
            key={key}
            onClick={() => {
              setActiveTab(key);
              setCurrentQuestion(0);
              setAnswers({});
              setShowResult(false);
            }}
            className={`flex-shrink-0 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
              activeTab === key
                ? `bg-gradient-to-r ${colorGradients[survey.color]} text-white shadow-lg scale-105`
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-300 border border-gray-700'
            }`}
          >
            {survey.badge}
          </button>
        ))}
      </div>

      <div className={`bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl border ${borderColors[currentSurvey.color]} overflow-hidden`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 border-b border-gray-700">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-2">
            {currentSurvey.title}
          </h2>
          
          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-4">
            <div 
              className={`h-full bg-gradient-to-r ${colorGradients[currentSurvey.color]} transition-all duration-500 ease-out`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

      {/* Question Content */}
      <div className="p-8 space-y-6">
        <h3 className="text-xl md:text-2xl font-semibold text-white leading-relaxed">
          {currentQ.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option.value)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                answers[currentQuestion] === option.value
                  ? 'border-purple-500 bg-purple-500/20 text-white'
                  : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-purple-400 hover:bg-purple-500/10'
              }`}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>

        {/* Navigation */}
        <div className="p-6 bg-gray-800/50 border-t border-gray-700 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
              currentQuestion === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back
          </button>

          <span className="text-gray-400 font-medium">
            Question {currentQuestion + 1} of {questions.length}
          </span>

          <button
            onClick={handleNext}
            disabled={!answers[currentQuestion]}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
              !answers[currentQuestion]
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : `bg-gradient-to-r ${colorGradients[currentSurvey.color]} text-white hover:scale-105 shadow-lg`
            }`}
          >
            {isLastQuestion ? 'See Result' : 'Next'}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyPreview;
