"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GeistSans, GeistMono } from 'geist/font';
import axios from "axios";
import SurveyResult from "./SurveyResult";
import AdvertiseModal from "@/components/ad/AdvertiseModal";

const geistSans = GeistSans;
const geistMono = GeistMono;

// Hardcoded ad data - will be replaced with database later
const adSpaces = [
  {
    id: 1,
    name: "saas.group",
    tagline: "The acquirer that respects founder DNA.",
    icon: "🍓",
    bgColor: "from-red-900 to-red-950",
    position: "left",
    isEmpty: false
  },
  {
    id: 2,
    name: "Whisper Memos",
    tagline: "Record voice memos, receive emails. iPhone & Apple Watch",
    icon: "🎙️",
    bgColor: "from-blue-900 to-blue-950",
    position: "left",
    isEmpty: false
  },
  {
    id: 3,
    isEmpty: true,
    position: "left"
  },
  {
    id: 4,
    name: "GijberryAI",
    tagline: "Find warm leads and book sales calls automatically",
    icon: "📧",
    bgColor: "from-red-900 to-red-950",
    position: "right",
    isEmpty: false
  },
  {
    id: 5,
    name: "HyperProxies",
    tagline: "Proxy infrastructure built for automating, scaling, and scraping the modern web.",
    icon: "🌐",
    bgColor: "from-green-900 to-green-950",
    position: "right",
    isEmpty: false
  },
  {
    id: 6,
    name: "Mockiu",
    tagline: "Your AI Design tool - Logos, Brand visuals, Photo & Video mockups",
    icon: "🎨",
    bgColor: "from-gray-900 to-gray-950",
    position: "right",
    isEmpty: false
  },
  {
    id: 7,
    isEmpty: true,
    position: "right"
  }
];

export default function PublicSurvey({ survey, questions }) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adRotationIndex, setAdRotationIndex] = useState(0);
  const [isAdvertiseModalOpen, setIsAdvertiseModalOpen] = useState(false);
  
  const leftAds = adSpaces.filter(ad => ad.position === "left");
  const rightAds = adSpaces.filter(ad => ad.position === "right");
  
  // Auto-rotate ads every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAdRotationIndex(prev => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  // Get 5 ads to display, cycling through all ads
  const getDisplayAds = (ads) => {
    const displayAds = [];
    for (let i = 0; i < 5; i++) {
      const index = (adRotationIndex + i) % ads.length;
      displayAds.push(ads[index]);
    }
    return displayAds;
  };

  const handleAnswer = (answer) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);
    setValidationMessage("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleTextInput = (value) => {
    const newAnswers = { ...answers, [currentQuestion]: value };
    setAnswers(newAnswers);
    setValidationMessage("");
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setValidationMessage("");
    }
  };

  const handleForward = async () => {
    const answer = answers[currentQuestion];
    const currentQ = questions[currentQuestion];
    
    if (!answer || (typeof answer === 'string' && answer.trim() === '')) {
      const isTextInput = currentQ.questionType === 'text';
      const message = isTextInput 
        ? "Please enter your answer before moving forward! ✍️" 
        : "Hold up! Pick an answer before moving forward! 🎯";
      setValidationMessage(message);
      return;
    }
    
    if (currentQuestion === questions.length - 1) {
      // Submit all responses to database
      await submitAllResponses();
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setValidationMessage("");
    }
  };

  const submitAllResponses = async () => {
    setIsSubmitting(true);
    try {
      // Prepare all answers in the format expected by API
      const answersArray = questions.map((question, index) => ({
        questionId: question._id,
        answer: answers[index] || "", // Include all answers
      }));

      // Use survey.id or survey._id depending on how it was serialized
      const surveyId = survey._id || survey.id;
      console.log('Submitting:', { answers: answersArray, surveyId, survey });

      // Send batch request to API
      const response = await axios.post('/api/response', {
        answers: answersArray,
        surveyId: surveyId,
        metadata: {
          userAgent: navigator.userAgent,
          completedAt: new Date().toISOString(),
        }
      });

      console.log('Success:', response.data);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting responses:', error);
      console.error('Error details:', error.response?.data);
      setValidationMessage("Oops! Something went wrong. Please try again. 😔");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSurvey = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen bg-gradient-to-b from-purple-600 via-purple-700 to-pink-700 relative overflow-x-hidden`}>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Back Button */}
            <div className="flex items-center gap-4">
              
              <a href="https://getquizzy.online" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center font-bold text-white text-lg">
                  Q
                </div>
                <span className="text-white font-bold text-xl hidden sm:block">GetQuizzy</span>
              </a>
            </div>

            {/* Marketing CTA */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-gray-300 text-sm">
                <span>Want to create surveys like this?</span>
              </div>
              <a 
                href="https://www.getquizzy.online/signin?callbackUrl=https%3A%2F%2Fwww.getquizzy.online%2Fdashboard" 
                className="px-4 py-2 md:px-6 md:py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30"
              >
                Sign Up Free ✨
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Horizontal Ad Carousel - Swipeable */}
      <div className="lg:hidden fixed top-16 left-0 right-0 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800 z-40">
        {/* Advertise Button - Top Left */}
        <div className="px-2 pt-2">
          <button 
            onClick={() => setIsAdvertiseModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400 hover:bg-gray-700/70 hover:border-gray-600 hover:text-white transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
            </svg>
            <span className="text-[10px] font-semibold">Advertise</span>
          </button>
        </div>
        
        {/* Swipeable Ads */}
        <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory" style={{ scrollBehavior: 'smooth' }}>
          <div className="flex gap-2 px-2 py-2">
          {adSpaces.map((ad, index) => (
            ad.isEmpty ? (
              // Empty Ad Slot
              <a
                key={`mobile-${ad.id}-${index}`}
                href="https://getquizzy.online/advertise"
                className="flex items-center gap-2 bg-gray-800/50 border border-dashed border-gray-700 rounded-lg px-3 py-1.5 hover:border-purple-500/50 transition-all duration-300 group min-w-[140px] shrink-0 snap-start"
              >
                <div className="w-7 h-7 flex items-center justify-center bg-gray-700/50 rounded-lg group-hover:bg-purple-500/20 transition-colors shrink-0">
                  <span className="text-sm">📢</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[10px] text-gray-400 group-hover:text-purple-300 truncate">
                    Your Ad
                  </h3>
                  <p className="text-[8px] text-purple-400 font-semibold">
                    Advertise
                  </p>
                </div>
              </a>
            ) : (
              // Regular Ad
              <a
                key={`mobile-${ad.id}-${index}`}
                href="#"
                className={`flex items-center gap-2 bg-gradient-to-r ${ad.bgColor} rounded-lg px-3 py-1.5 shadow-md hover:shadow-lg transition-all duration-300 text-white border border-white/10 relative group min-w-[140px] shrink-0 snap-start`}
              >
                <div className="absolute top-0.5 right-0.5 text-[7px] text-white/40 bg-black/20 px-1 py-0.5 rounded">
                  Ad
                </div>
                <div className="w-7 h-7 flex items-center justify-center bg-white/10 rounded-lg backdrop-blur-sm shrink-0">
                  <span className="text-sm">{ad.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[10px] mb-0.5 leading-tight truncate">{ad.name}</h3>
                  <p className="text-[8px] opacity-80 leading-tight truncate">{ad.tagline}</p>
                </div>
              </a>
            )
          ))}
          </div>
        </div>
      </div>

      {/* Main Container with Ad Spaces - Added top padding for fixed nav and mobile ads */}
      <div className="flex flex-col lg:flex-row min-h-screen pt-[5.5rem] lg:pt-16 pb-[4rem] lg:pb-0">
        
        {/* Left Ad Space - Fixed to left edge on desktop */}
        <aside className="hidden lg:flex flex-col gap-2 w-44 shrink-0 p-2 fixed left-0 top-16 h-[calc(100vh-4rem)]">
          {/* Advertise Button */}
          <button 
            onClick={() => setIsAdvertiseModalOpen(true)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400 hover:bg-gray-700/70 hover:border-gray-600 hover:text-white transition-all duration-300 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
            </svg>
            <span className="text-xs font-semibold">Advertise</span>
          </button>

          {/* Display 5 rotating ads */}
          <div className="flex-1 flex flex-col gap-2 justify-center">
            {getDisplayAds(leftAds).map((ad, index) => (
              ad.isEmpty ? (
                // Empty Ad Slot
                <a 
                  key={`${ad.id}-${index}`}
                  href="https://getquizzy.online/advertise"
                  className="block bg-gray-800/50 border border-dashed border-gray-700 rounded-lg p-2 hover:border-purple-500/50 hover:bg-gray-800/70 transition-all duration-300 text-center group h-[calc((100vh-8rem)/5-0.5rem)]"
                >
                  <div className="flex flex-col items-center justify-center gap-1 h-full">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-700/50 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                      <span className="text-lg">📢</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[10px] text-gray-400 group-hover:text-purple-300">
                        Ad Space
                      </h3>
                      <p className="text-[8px] text-purple-400 font-semibold mt-0.5">
                        Click →
                      </p>
                    </div>
                  </div>
                </a>
              ) : (
                // Regular Ad
                <a 
                  key={`${ad.id}-${index}`}
                  href="#"
                  className={`block bg-gradient-to-br ${ad.bgColor} rounded-lg p-2 shadow-md hover:shadow-purple-500/20 hover:scale-[1.01] transition-all duration-300 text-white border border-white/10 relative group h-[calc((100vh-8rem)/5-0.5rem)]`}
                >
                  <div className="absolute top-1 right-1 text-[7px] text-white/40 bg-black/20 px-1 py-0.5 rounded">
                    Ad
                  </div>
                  <div className="flex flex-col items-center justify-center text-center gap-1 h-full">
                    <div className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg backdrop-blur-sm">
                      <span className="text-lg">{ad.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[10px] mb-0.5 leading-tight">{ad.name}</h3>
                      <p className="text-[8px] opacity-80 leading-tight line-clamp-2">{ad.tagline}</p>
                    </div>
                  </div>
                </a>
              )
            ))}
          </div>
        </aside>

        {/* Main Survey Content */}
        <main className="flex-1 lg:ml-44 lg:mr-44 flex items-center justify-center px-3 md:p-4 py-2 lg:py-6">
          <div className="w-full max-w-lg bg-gray-900 rounded-lg shadow-md p-3 md:p-5 border border-gray-800">
          
          {!showResults ? (
            <div className="space-y-3 md:space-y-5">
              <div className="text-center">
                <h1 className="text-xl md:text-2xl font-bold mb-2 text-white">{survey.name}</h1>
                <p className="text-gray-400 text-xs">Question {currentQuestion + 1} of {questions.length}</p>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-3 md:mb-5">
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-center mb-3 md:mb-5">
                <h2 className="text-lg md:text-xl font-semibold mb-5 text-white leading-relaxed">
                  {questions[currentQuestion].title}
                </h2>
                
                {/* Text Input */}
                {questions[currentQuestion].questionType === 'text' ? (
                  <div className="mb-3 md:mb-5">
                    <textarea
                      value={answers[currentQuestion] || ""}
                      onChange={(e) => handleTextInput(e.target.value)}
                      placeholder="Type your answer here..."
                      rows={4}
                      className="w-full p-3 rounded-lg border-2 border-gray-700 focus:border-purple-500 focus:outline-none bg-gray-800 text-white placeholder-gray-500 text-sm transition-all duration-200 resize-none"
                    />
                  </div>
                ) : questions[currentQuestion].questionType === 'rating' ? (
                  /* Rating Scale */
                  <div className="mb-3 md:mb-5">
                    <div className="flex justify-center gap-2 md:gap-3">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => handleAnswer(rating.toString())}
                          className={`w-10 h-10 md:w-14 md:h-14 rounded-xl border-2 transition-all duration-200 font-bold text-base md:text-lg ${
                            answers[currentQuestion] === rating.toString()
                              ? 'border-purple-500 bg-gradient-to-br from-purple-500 to-pink-500 text-white scale-110 shadow-lg shadow-purple-500/50'
                              : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-purple-500 hover:text-white hover:scale-105'
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-400 px-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                ) : (
                  /* Multiple Choice Options */
                  <div className="grid grid-cols-1 gap-2.5 mb-3 md:mb-5">
                    {questions[currentQuestion].options?.map((option, index) => (
                      <button
                        key={option._id || index}
                        onClick={() => handleAnswer(option.value || option.text || option)}
                        className={`p-3 text-left rounded-lg border-2 transition-all duration-200 text-sm md:text-base ${
                          answers[currentQuestion] === (option.value || option.text || option)
                            ? 'border-purple-500 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white shadow-lg shadow-purple-500/20' 
                            : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-purple-500 hover:bg-gray-750 hover:text-white'
                        }`}
                      >
                        <span>{option.text || option.value || option}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Validation Message */}
                {validationMessage && (
                  <div className="text-pink-400 mb-4 animate-bounce text-sm font-medium">
                    {validationMessage}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={handleBack}
                    className={`flex items-center justify-center gap-1.5 px-4 md:px-5 py-2 rounded-full transition-all text-sm font-semibold min-w-[90px] ${
                      currentQuestion > 0
                        ? 'bg-gray-800 hover:bg-gray-700 text-white border-2 border-gray-700'
                        : 'bg-gray-900 text-gray-600 cursor-not-allowed border-2 border-gray-800'
                    }`}
                    disabled={currentQuestion === 0}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={2.5} 
                      stroke="currentColor" 
                      className="w-4 h-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Back
                  </button>
                  
                  <button
                    onClick={handleForward}
                    disabled={isSubmitting}
                    className={`flex items-center justify-center gap-1.5 px-4 md:px-5 py-2 rounded-full transition-all text-sm font-semibold min-w-[90px] disabled:opacity-50 disabled:cursor-not-allowed ${
                      currentQuestion === questions.length - 1
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/50'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/50'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
                        {currentQuestion !== questions.length - 1 && (
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={2.5} 
                            stroke="currentColor" 
                            className="w-4 h-4"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Results Page */
            <SurveyResult 
              survey={survey} 
              questions={questions} 
              answers={answers}
            />
          )}
        </div>
        </main>

        {/* Right Ad Space - Fixed to right edge on desktop */}
        <aside className="hidden lg:flex flex-col gap-2 w-44 shrink-0 p-2 fixed right-0 top-16 h-[calc(100vh-4rem)]">
          {/* Advertise Button */}
          <button 
            onClick={() => setIsAdvertiseModalOpen(true)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400 hover:bg-gray-700/70 hover:border-gray-600 hover:text-white transition-all duration-300 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
            </svg>
            <span className="text-xs font-semibold">Advertise</span>
          </button>

          {/* Display 5 rotating ads */}
          <div className="flex-1 flex flex-col gap-2 justify-center">
            {getDisplayAds(rightAds).map((ad, index) => (
              ad.isEmpty ? (
                // Empty Ad Slot
                <a 
                  key={`${ad.id}-${index}`}
                  href="https://getquizzy.online/advertise"
                  className="block bg-gray-800/50 border border-dashed border-gray-700 rounded-lg p-2 hover:border-purple-500/50 hover:bg-gray-800/70 transition-all duration-300 text-center group h-[calc((100vh-8rem)/5-0.5rem)]"
                >
                  <div className="flex flex-col items-center justify-center gap-1 h-full">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-700/50 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                      <span className="text-lg">📢</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[10px] text-gray-400 group-hover:text-purple-300">
                        Ad Space
                      </h3>
                      <p className="text-[8px] text-purple-400 font-semibold mt-0.5">
                        Click →
                      </p>
                    </div>
                  </div>
                </a>
              ) : (
                // Regular Ad
                <a 
                  key={`${ad.id}-${index}`}
                  href="#"
                  className={`block bg-gradient-to-br ${ad.bgColor} rounded-lg p-2 shadow-md hover:shadow-purple-500/20 hover:scale-[1.01] transition-all duration-300 text-white border border-white/10 relative group h-[calc((100vh-8rem)/5-0.5rem)]`}
                >
                  <div className="absolute top-1 right-1 text-[7px] text-white/40 bg-black/20 px-1 py-0.5 rounded">
                    Ad
                  </div>
                  <div className="flex flex-col items-center justify-center text-center gap-1 h-full">
                    <div className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg backdrop-blur-sm">
                      <span className="text-lg">{ad.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[10px] mb-0.5 leading-tight">{ad.name}</h3>
                      <p className="text-[8px] opacity-80 leading-tight line-clamp-2">{ad.tagline}</p>
                    </div>
                  </div>
                </a>
              )
            ))}
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Ad Carousel - Swipeable */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur-sm border-t border-gray-800 z-40">
        <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory" style={{ scrollBehavior: 'smooth' }}>
          <div className="flex gap-2 px-2 py-2">
          {adSpaces.map((ad, index) => (
            ad.isEmpty ? (
              // Empty Ad Slot
              <a
                key={`mobile-bottom-${ad.id}-${index}`}
                href="https://getquizzy.online/advertise"
                className="flex items-center gap-2 bg-gray-800/50 border border-dashed border-gray-700 rounded-lg px-3 py-1.5 hover:border-purple-500/50 transition-all duration-300 group min-w-[140px] shrink-0 snap-start"
              >
                <div className="w-7 h-7 flex items-center justify-center bg-gray-700/50 rounded-lg group-hover:bg-purple-500/20 transition-colors shrink-0">
                  <span className="text-sm">📢</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[10px] text-gray-400 group-hover:text-purple-300 truncate">
                    Your Ad
                  </h3>
                  <p className="text-[8px] text-purple-400 font-semibold">
                    Advertise
                  </p>
                </div>
              </a>
            ) : (
              // Regular Ad
              <a
                key={`mobile-bottom-${ad.id}-${index}`}
                href="#"
                className={`flex items-center gap-2 bg-gradient-to-r ${ad.bgColor} rounded-lg px-3 py-1.5 shadow-md hover:shadow-lg transition-all duration-300 text-white border border-white/10 relative group min-w-[140px] shrink-0 snap-start`}
              >
                <div className="absolute top-0.5 right-0.5 text-[7px] text-white/40 bg-black/20 px-1 py-0.5 rounded">
                  Ad
                </div>
                <div className="w-7 h-7 flex items-center justify-center bg-white/10 rounded-lg backdrop-blur-sm shrink-0">
                  <span className="text-sm">{ad.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[10px] mb-0.5 leading-tight truncate">{ad.name}</h3>
                  <p className="text-[8px] opacity-80 leading-tight truncate">{ad.tagline}</p>
                </div>
              </a>
            )
          ))}
          </div>
        </div>
      </div>

      {/* Advertise Modal */}
      <AdvertiseModal 
        isOpen={isAdvertiseModalOpen} 
        onClose={() => setIsAdvertiseModalOpen(false)} 
      />
    </div>
  );
}
