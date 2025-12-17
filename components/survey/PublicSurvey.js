"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GeistSans, GeistMono } from 'geist/font';
import axios from "axios";
import SurveyResult from "./SurveyResult";

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

      {/* Main Container with Ad Spaces - Added top padding for fixed nav */}
      <div className="flex flex-col lg:flex-row min-h-screen pt-16">
        
        {/* Left Ad Space - Fixed to left edge on desktop */}
        <aside className="hidden lg:flex flex-col gap-6 w-72 shrink-0 p-6 fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
          {/* Ad Disclaimer */}
          <div className="text-center mb-2">
            <p className="text-xs text-purple-200/60 leading-relaxed">
              💜 We keep surveys free through ads
            </p>
          </div>

          {adSpaces.filter(ad => ad.position === "left").map((ad) => (
            ad.isEmpty ? (
              // Empty Ad Slot
              <a 
                key={ad.id}
                href="https://getquizzy.online/advertise"
                className="block bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-3xl p-6 hover:border-purple-500 hover:bg-gray-800/70 transition-all duration-300 text-center group"
              >
                <div className="flex flex-col items-center text-center gap-4 py-4">
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-700/50 rounded-2xl group-hover:bg-purple-500/20 transition-colors">
                    <span className="text-3xl">📢</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-2 text-gray-400 group-hover:text-purple-300">
                      Your Ad Here
                    </h3>
                    <p className="text-sm text-gray-500 group-hover:text-gray-400 leading-relaxed">
                      Reach thousands of engaged users
                    </p>
                    <div className="mt-3 text-xs text-purple-400 font-semibold">
                      Click to advertise →
                    </div>
                  </div>
                </div>
              </a>
            ) : (
              // Regular Ad
              <a 
                key={ad.id}
                href="#"
                className={`block bg-gradient-to-br ${ad.bgColor} rounded-3xl p-6 shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 text-white border border-white/10 relative group`}
              >
                <div className="absolute top-2 right-2 text-[10px] text-white/40 bg-black/20 px-2 py-0.5 rounded-full">
                  Ad
                </div>
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 flex items-center justify-center bg-white/10 rounded-2xl backdrop-blur-sm">
                    <span className="text-4xl">{ad.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-2">{ad.name}</h3>
                    <p className="text-sm opacity-90 leading-relaxed">{ad.tagline}</p>
                  </div>
                </div>
              </a>
            )
          ))}
        </aside>

        {/* Main Survey Content */}
        <main className="flex-1 lg:ml-72 lg:mr-72 flex items-center justify-center p-4 md:p-8 py-12">
          <div className="w-full max-w-3xl bg-gray-900 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-800">
          
          {!showResults ? (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">{survey.name}</h1>
                <p className="text-gray-400 text-sm">Question {currentQuestion + 1} of {questions.length}</p>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-white leading-relaxed">
                  {questions[currentQuestion].title}
                </h2>
                
                {/* Text Input */}
                {questions[currentQuestion].questionType === 'text' ? (
                  <div className="mb-8">
                    <textarea
                      value={answers[currentQuestion] || ""}
                      onChange={(e) => handleTextInput(e.target.value)}
                      placeholder="Type your answer here..."
                      rows={5}
                      className="w-full p-5 rounded-2xl border-2 border-gray-700 focus:border-purple-500 focus:outline-none bg-gray-800 text-white placeholder-gray-500 text-lg transition-all duration-200 resize-none"
                    />
                  </div>
                ) : questions[currentQuestion].questionType === 'rating' ? (
                  /* Rating Scale */
                  <div className="mb-8">
                    <div className="flex justify-center gap-3 md:gap-5">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => handleAnswer(rating.toString())}
                          className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl border-2 transition-all duration-200 font-bold text-xl md:text-2xl ${
                            answers[currentQuestion] === rating.toString()
                              ? 'border-purple-500 bg-gradient-to-br from-purple-500 to-pink-500 text-white scale-110 shadow-lg shadow-purple-500/50'
                              : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-purple-500 hover:text-white hover:scale-105'
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between mt-4 text-sm text-gray-400 px-2">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                ) : (
                  /* Multiple Choice Options */
                  <div className="grid grid-cols-1 gap-4 mb-8">
                    {questions[currentQuestion].options?.map((option, index) => (
                      <button
                        key={option._id || index}
                        onClick={() => handleAnswer(option.value || option.text || option)}
                        className={`p-5 text-left rounded-2xl border-2 transition-all duration-200 text-base md:text-lg ${
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
                  <div className="text-pink-400 mb-6 animate-bounce text-base md:text-lg font-medium">
                    {validationMessage}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-10">
                  <button
                    onClick={handleBack}
                    className={`flex items-center justify-center gap-2 px-6 md:px-8 py-3 rounded-full transition-all text-base font-semibold min-w-[110px] ${
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
                      className="w-5 h-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Back
                  </button>
                  
                  <button
                    onClick={handleForward}
                    disabled={isSubmitting}
                    className={`flex items-center justify-center gap-2 px-6 md:px-8 py-3 rounded-full transition-all text-base font-semibold min-w-[110px] disabled:opacity-50 disabled:cursor-not-allowed ${
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
                            className="w-5 h-5"
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
        <aside className="hidden lg:flex flex-col gap-6 w-72 shrink-0 p-6 fixed right-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
          {/* Ad Disclaimer */}
          <div className="text-center mb-2">
            <p className="text-xs text-purple-200/60 leading-relaxed">
              💜 We keep surveys free through ads
            </p>
          </div>

          {adSpaces.filter(ad => ad.position === "right").map((ad) => (
            ad.isEmpty ? (
              // Empty Ad Slot
              <a 
                key={ad.id}
                href="https://getquizzy.online/advertise"
                className="block bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-3xl p-6 hover:border-purple-500 hover:bg-gray-800/70 transition-all duration-300 text-center group"
              >
                <div className="flex flex-col items-center text-center gap-4 py-4">
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-700/50 rounded-2xl group-hover:bg-purple-500/20 transition-colors">
                    <span className="text-3xl">📢</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-2 text-gray-400 group-hover:text-purple-300">
                      Your Ad Here
                    </h3>
                    <p className="text-sm text-gray-500 group-hover:text-gray-400 leading-relaxed">
                      Reach thousands of engaged users
                    </p>
                    <div className="mt-3 text-xs text-purple-400 font-semibold">
                      Click to advertise →
                    </div>
                  </div>
                </div>
              </a>
            ) : (
              // Regular Ad
              <a 
                key={ad.id}
                href="#"
                className={`block bg-gradient-to-br ${ad.bgColor} rounded-3xl p-6 shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 text-white border border-white/10 relative group`}
              >
                <div className="absolute top-2 right-2 text-[10px] text-white/40 bg-black/20 px-2 py-0.5 rounded-full">
                  Ad
                </div>
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 flex items-center justify-center bg-white/10 rounded-2xl backdrop-blur-sm">
                    <span className="text-4xl">{ad.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-2">{ad.name}</h3>
                    <p className="text-sm opacity-90 leading-relaxed">{ad.tagline}</p>
                  </div>
                </div>
              </a>
            )
          ))}
        </aside>
      </div>

      {/* Mobile Ad Space - Shown at bottom on mobile */}
      <div className="lg:hidden mt-8 px-4 pb-8">
        <h3 className="text-center text-sm font-semibold text-purple-200 mb-6">Featured Partners</h3>
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          {adSpaces.slice(0, 4).map((ad) => (
            <a 
              key={ad.id}
              href="#"
              className={`block bg-gradient-to-br ${ad.bgColor} rounded-2xl p-4 shadow-xl text-white border border-white/10`}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-xl">
                  <span className="text-2xl">{ad.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-xs mb-1">{ad.name}</h3>
                  <p className="text-[10px] opacity-90 leading-tight line-clamp-2">{ad.tagline}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
