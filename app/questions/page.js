"use client";
import Image from "next/image";
import { GeistSans, GeistMono } from 'geist/font';
import { useState, useEffect } from "react";
import { ImageGenerationPrompt } from "@/libs/helpers/prompt";
import { tr } from "zod/v4/locales";

// Replace the font initialization with direct usage of GeistSans and GeistMono
const geistSans = GeistSans;
const geistMono = GeistMono;

const questions = [
  {
    id: 0,
    question: "What is your name?"
  },
  {
    id: 1,
    question: "What is your gender?",
    options: ["Male", "Female"]
  },
  {
    id: 2,
    question: "If you were a superhero, what would your power be?",
    options: ["Invisibility (ninja mode activated)", "Flying (bye bye traffic)", "Mind Reading (no more awkward convos)", "Time Control (eternal weekend!)"],
  },
  {
    id: 3,
    question: "You've been given a time machine for a day. Where are you headed?",
    options: ["Future (flying cars please)", "Dinosaur era (just to pet one)", "90s/80s (vintage vibes)", "Stay put (2025 is wild enough)"],
  },
  {
    id: 4,
    question: "Your phone battery is at 1% and you can only keep one app. Which one?",
    options: ["WhatsApp (gotta stay connected)", "Spotify (silence is scary)", "Instagram (FOMO is real)", "Food delivery app (survival first)"],
  },
  {
    id: 5,
    question: "If your life had a theme song, it would be:",
    options: ["Epic movie soundtrack", "Chill lofi beats", "High-energy pop hits", "Dramatic K-drama OST"],
  },
  {
    id: 6,
    question: "You're stuck on a desert island, you can magically summon one restaurant chain:",
    options: ["McDonald's (McNuggets forever)", "Starbucks (caffeinated survival)", "Subway (healthy-ish option)", "Pizza Hut (pizza never gets old)"],
  },
  {
    id: 7,
    question: "Your perfect hideout spot during a zombie apocalypse would be:",
    options: ["Shopping mall (resources + roof access)", "Library (quiet + knowledge)", "Gym (strong survivor vibes)", "IKEA (endless maze + meatballs)"],
  },
  {
    id: 8,
    question: "If your friend group was a TV show genre, it would be:",
    options: ["Sitcom (laugh track included)", "Reality TV (drama guaranteed)", "Adventure series (weekly quests)", "Cooking show (food critics unite)"],
  },
  {
    id: 9,
    question: "You can instantly master one skill, but you have to perform it daily. Choose:",
    options: ["Mind reading (but can't turn it off)", "Teleportation (random locations only)", "Perfect memory (including embarrassing moments)", "Time freeze (but you age normally)"],
  },
  {
    id: 10,
    question: "Your friend is sad. Your go-to mood lifter is:",
    options: ["Surprise food delivery", "Spam them with memes", "Emergency karaoke session", "Show up with bubble tea"],
  },
  {
    id: 11,
    question: "If your personality was a bubble tea order, it would be:",
    options: ["Classic milk tea (reliable friend)", "Fruit tea (spontaneous soul)", "Brown sugar boba (trendsetter)", "Cheese foam (unique character)"],
  },
  {
    id: 12,
    question: "You've been given a billboard for a day. What's going up?",
    options: ["Your best meme creation", "Inspirational quote + selfie", "Inside joke only friends get", "Food recommendation list"],
  },
  {
    id: 13,
    question: "Your friend group decides to start a business. What is it?",
    options: ["Food truck (chaotic kitchen)", "Pet café (cuddles = profit)", "Tech startup (app that never launches)", "Travel agency (planning masters)"],
  },
  {
    id: 14,
    question: "You wake up with the ability to talk to...",
    options: ["Plants (gossip with succulents)", "Animals (pet conversations)", "Food (before eating it)", "Electronics (WiFi secrets)"],
  },
  {
    id: 15,
    question: "In group photos, you're always the one who:",
    options: ["Takes 50 versions (perfectionist)", "Makes weird faces (memory maker)", "Organizes everyone (the director)", "Is never ready (candid king/queen)"],
  },
  {
    id: 16,
    question: "Your life motto could be summed up as:",
    options: ["Sleep is for the weak", "Food is life", "Will do it tomorrow", "Adventure is out there"],
  }
];

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedAvatar, setGeneratedAvatar] = useState("");
  const [personalityData, setPersonalityData] = useState({
    PersonalityTraitDescription: "",
    CareerPath: "",
    Strengths: "",
    Weaknesses: "",
    traits: [
          "",
          "",
          ""
        ]
  });
  const [validationMessage, setValidationMessage] = useState(""); // Added validation message state
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [personalityLoaded, setPersonalityLoaded] = useState(false);

  // Add this array of fun loading messages
  const loadingMessages = [
    "🔮 Analyzing your quirky choices...",
    "🧩 Piecing together your personality puzzle...",
    "🎲 Rolling the dice of destiny...",
    "🎨 Painting your personality portrait...",
    "Fun fact: 75% of people change their personality test answers based on their mood!",
    "🤔 Did you know? Your personality type can influence your coffee order!",
    "🎮 Gaming fact: Your personality affects your gaming style!",
    "🌟 Fun fact: Your personality type might predict your favorite memes!",
    "🎵 Processing your vibes... Please hold for awesomeness!",
    "🔍 Searching for your spirit animal in our database..."
  ];

  useEffect(() => {
    let messageInterval;
    if (isLoading || (!imageLoaded && generatedAvatar) || !personalityLoaded) {
      let index = 0;
      setLoadingMessage(loadingMessages[0]);
      messageInterval = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[index]);
      }, 5000); // Change message every 3 seconds
    }
    return () => clearInterval(messageInterval);
  }, [isLoading, imageLoaded, personalityLoaded, generatedAvatar]);

  useEffect(() => {
    console.log('Loading states:', {
      isLoading,
      imageLoaded,
      personalityLoaded,
      hasAvatar: !!generatedAvatar
    });
  }, [isLoading, imageLoaded, personalityLoaded, generatedAvatar]);

  const handleAnswer = async (answer) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);
    setValidationMessage(""); // Clear validation message when an answer is selected

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
    // Remove the else block that was triggering results
  };

  const handleTextInput = (value) => {
    const newAnswers = { ...answers, [currentQuestion]: value };
    setAnswers(newAnswers);
    setValidationMessage(""); // Clear validation message when text is entered
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setValidationMessage("");
    }
  };

  const handleForward = async () => {
    // Validation: Check if answer exists and is not empty (for text input)
    const answer = answers[currentQuestion];
    if (!answer || (typeof answer === 'string' && answer.trim() === '')) {
      // Different validation messages for text input vs multiple choice
      const isTextInput = !questions[currentQuestion].options;
      const message = isTextInput 
        ? "Please enter your name before moving forward! ✍️" 
        : "Hold up! Pick an answer before moving forward! 🎯";
      setValidationMessage(message);
      return;
    }
    
    if (currentQuestion === questions.length - 1) {
      setIsLoading(true);
      setShowResults(true);
      setImageLoaded(false);
      setPersonalityLoaded(false);
      
      try {
        // Generate personality first
        const personalityResult = await fetch('api/openai/personality',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            answers,
            questions
          }),
        });

        if(!personalityResult.ok){
          throw new Error('Failed to generate personality');
        }
        const personalityData = await personalityResult.json();
        if (personalityData) {
          setPersonalityData(personalityData);
          setPersonalityLoaded(true);
        }

        // Then generate avatar
        const prompt = ImageGenerationPrompt(answers, questions);
        const response = await fetch('/api/openai/avatar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            prompt,
            size: "512x512", // Smaller size for faster generation and loading
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.data && data.data[0]?.url) {
          setGeneratedAvatar(data.data[0].url);
          // Image loading will be handled by the useEffect
        } else {
          throw new Error('Invalid response format from DALL-E API');
        }
      } catch (error) {
        console.error('Failed to generate results:', error);
        setPersonalityData(prev => ({
          ...prev,
          description: "Sorry, we encountered an error generating your results. Please try again."
        }));
        setPersonalityLoaded(true);
        setImageLoaded(true);
      } finally {
        setIsLoading(false);
      }
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setValidationMessage("");
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setIsLoading(false);
    setImageLoaded(false);
    setPersonalityLoaded(false);
    setGeneratedAvatar("");
    setPersonalityData({
      name: "",
      description: "",
      traits: []
    });
  };

  // Replace the useEffect for image loading with this:
  useEffect(() => {
    if (generatedAvatar) {
      const preloadImage = () => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = generatedAvatar;
        link.onload = () => {
          console.log("Image preloaded successfully");
          setImageLoaded(true);
        };
        link.onerror = () => {
          console.log("Image failed to preload");
          setImageLoaded(true); // Prevent infinite loading on error
        };
        document.head.appendChild(link);
      };

      preloadImage();
    }
  }, [generatedAvatar]);

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 p-8`}>
      <main className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mt-10">
        {!showResults ? (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-center mb-8">MZ Personality Test✨</h1>
            <div className="mb-8">
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {questions[currentQuestion].question}
              </h2>
              
              {/* Text Input for name question */}
              {!questions[currentQuestion].options ? (
                <div className="mb-6">
                  <input
                    type="text"
                    value={answers[currentQuestion] || ""}
                    onChange={(e) => handleTextInput(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full p-4 text-center rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:outline-none bg-white dark:bg-gray-700 dark:border-purple-700 dark:focus:border-purple-400 text-lg transition-all duration-200"
                  />
                </div>
              ) : (
                /* Multiple Choice Options */
                <div className="grid grid-cols-1 gap-4 mb-6">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      className={`p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                        answers[currentQuestion] === option 
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900' 
                          : 'border-purple-200 hover:border-purple-500 hover:bg-purple-50 dark:border-purple-700 dark:hover:border-purple-400 dark:hover:bg-purple-900'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {/* Validation Message */}
              {validationMessage && (
                <div className="text-red-500 dark:text-red-400 mb-4 animate-bounce">
                  {validationMessage}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 px-4 sm:px-0">
                <button
                  onClick={handleBack}
                  className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-full transition-colors text-sm sm:text-base font-medium min-w-[100px] ${
                    currentQuestion > 0
                      ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={currentQuestion === 0}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={2} 
                    stroke="currentColor" 
                    className="w-4 h-4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  Back
                </button>
                
                <span className="text-sm text-gray-500 hidden sm:block">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                
                <button
                  onClick={handleForward}
                  className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-full transition-colors text-sm sm:text-base font-medium min-w-[100px] ${
                    currentQuestion === questions.length - 1
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                  }`}
                >
                  {currentQuestion === questions.length - 1 ? 'See Results' : 'Next'}
                  {currentQuestion !== questions.length - 1 && (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={2} 
                      stroke="currentColor" 
                      className="w-4 h-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-8">
            {(isLoading || (!imageLoaded && generatedAvatar) || !personalityLoaded) && (
              // Loading state
              <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
                {/* Animated loading container */}
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 border-8 border-purple-200 rounded-full"></div>
                  <div className="absolute inset-0 border-8 border-t-purple-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-[25%] bg-purple-500 rounded-full animate-pulse"></div>
                </div>
                
                {/* Animated loading message */}
                <div className="max-w-md">
                  <p className="text-xl font-medium text-purple-600 dark:text-purple-300 transition-opacity duration-500">
                    {loadingMessage}
                  </p>
                </div>
              </div>
            )}
            {(!isLoading && imageLoaded && personalityLoaded) && (
              <>
                <h2 className="text-3xl font-bold mb-6">
                  {answers[0]}
                </h2>

                {/* Avatar Image */}
                <div className="max-w-md mx-auto mb-8">
                  {generatedAvatar && (
                    <div className="aspect-square relative rounded-2xl overflow-hidden shadow-xl border-4 border-purple-300 transition-transform hover:scale-[1.02]">
                      <Image
                        src={generatedAvatar}
                        alt="Personality Avatar"
                        width={512}
                        height={512}
                        className="object-cover"
                        priority
                        quality={75} // Slightly reduce quality for faster loading
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRseHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/2wBDARAVFhkeHRkgHR0dHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="  // Base64 blurred placeholder
                        onLoad={() => {
                          console.log("Image loaded in component");
                          setImageLoaded(true);
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Personality Trait Description */}
                <div className="bg-purple-50 dark:bg-purple-900 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-3 text-purple-800 dark:text-purple-200">
                    🎭 Your Personality
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                    {personalityData.PersonalityTraitDescription}
                  </p>
                </div>

               {/*  Career Path */}
                <div className="bg-purple-50 dark:bg-purple-900 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-3 text-purple-800 dark:text-purple-200">
                    💼 Career Path
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                    {personalityData.CareerPath}
                  </p>
                </div>

                {/* Strengths */}
                <div className="bg-purple-50 dark:bg-purple-900 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-3 text-purple-800 dark:text-purple-200">
                    ✨ Your Strengths
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                    {personalityData.Strengths}
                  </p>
                </div>

                {/* Weaknesses */}
                <div className="bg-purple-50 dark:bg-purple-900 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-3 text-purple-800 dark:text-purple-200">
                    🎯 Areas to Grow
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                    {personalityData.Weaknesses}
                  </p>
                </div>

                {/* Traits */}
                {personalityData.traits && personalityData.traits.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {personalityData.traits.map((trait, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-purple-200 dark:bg-purple-800 rounded-full text-sm font-medium"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                )}

                {/* Share Section */}
                <div className="mt-8 border-t pt-8">
                  <h3 className="text-xl font-semibold mb-4">Share your results!</h3>
                  <div className="flex justify-center gap-4">
                    <button className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                      <span>Share on Twitter</span>
                    </button>
                    <button className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600">
                      <span>Share on WhatsApp</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={resetQuiz}
                  className="mt-8 px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
                >
                  Take Quiz Again
                </button>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
