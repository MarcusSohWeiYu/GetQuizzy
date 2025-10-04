"use client";
import Image from "next/image";
import { GeistSans, GeistMono } from 'geist/font';
import { useState } from "react";

// Replace the font initialization with direct usage of GeistSans and GeistMono
const geistSans = GeistSans;
const geistMono = GeistMono;

const questions = [
  {
    id: 1,
    question: "If you were a superhero, what would your power be?",
    options: ["Invisibility (ninja mode activated)", "Flying (bye bye traffic)", "Mind Reading (no more awkward convos)", "Time Control (eternal weekend!)"],
  },
  {
    id: 2,
    question: "You've been given a time machine for a day. Where are you headed?",
    options: ["Future (flying cars please)", "Dinosaur era (just to pet one)", "90s/80s (vintage vibes)", "Stay put (2025 is wild enough)"],
  },
  {
    id: 3,
    question: "Your phone battery is at 1% and you can only keep one app. Which one?",
    options: ["WhatsApp (gotta stay connected)", "Spotify (silence is scary)", "Instagram (FOMO is real)", "Food delivery app (survival first)"],
  },
  {
    id: 4,
    question: "If your life had a theme song, it would be:",
    options: ["Epic movie soundtrack", "Chill lofi beats", "High-energy pop hits", "Dramatic K-drama OST"],
  },
  {
    id: 5,
    question: "You're stuck on a desert island, you can magically summon one restaurant chain:",
    options: ["McDonald's (McNuggets forever)", "Starbucks (caffeinated survival)", "Subway (healthy-ish option)", "Pizza Hut (pizza never gets old)"],
  },
  {
    id: 6,
    question: "Your perfect hideout spot during a zombie apocalypse would be:",
    options: ["Shopping mall (resources + roof access)", "Library (quiet + knowledge)", "Gym (strong survivor vibes)", "IKEA (endless maze + meatballs)"],
  },
  {
    id: 7,
    question: "If your friend group was a TV show genre, it would be:",
    options: ["Sitcom (laugh track included)", "Reality TV (drama guaranteed)", "Adventure series (weekly quests)", "Cooking show (food critics unite)"],
  },
  {
    id: 8,
    question: "You can instantly master one skill, but you have to perform it daily. Choose:",
    options: ["Mind reading (but can't turn it off)", "Teleportation (random locations only)", "Perfect memory (including embarrassing moments)", "Time freeze (but you age normally)"],
  },
  {
    id: 9,
    question: "Your friend is sad. Your go-to mood lifter is:",
    options: ["Surprise food delivery", "Spam them with memes", "Emergency karaoke session", "Show up with bubble tea"],
  },
  {
    id: 10,
    question: "If your personality was a bubble tea order, it would be:",
    options: ["Classic milk tea (reliable friend)", "Fruit tea (spontaneous soul)", "Brown sugar boba (trendsetter)", "Cheese foam (unique character)"],
  },
  {
    id: 11,
    question: "You've been given a billboard for a day. What's going up?",
    options: ["Your best meme creation", "Inspirational quote + selfie", "Inside joke only friends get", "Food recommendation list"],
  },
  {
    id: 12,
    question: "Your friend group decides to start a business. What is it?",
    options: ["Food truck (chaotic kitchen)", "Pet café (cuddles = profit)", "Tech startup (app that never launches)", "Travel agency (planning masters)"],
  },
  {
    id: 13,
    question: "You wake up with the ability to talk to...",
    options: ["Plants (gossip with succulents)", "Animals (pet conversations)", "Food (before eating it)", "Electronics (WiFi secrets)"],
  },
  {
    id: 14,
    question: "In group photos, you're always the one who:",
    options: ["Takes 50 versions (perfectionist)", "Makes weird faces (memory maker)", "Organizes everyone (the director)", "Is never ready (candid king/queen)"],
  },
  {
    id: 15,
    question: "Your life motto could be summed up as:",
    options: ["Sleep is for the weak", "Food is life", "Will do it tomorrow", "Adventure is out there"],
  }
];

// Add this function after the questions array
const generatePromptFromAnswers = (answers) => {
  const answersList = Object.entries(answers)
    .map(([index, answer]) => `${questions[index].question}: ${answer}`)
    .join('. ');

  return `Create a fun, friendly avatar based on these personality traits: ${answersList}. Make it colorful, modern, and suitable for a profile picture. Style: digital art, friendly and approachable.`;
};

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedAvatar, setGeneratedAvatar] = useState(""); // Add this line

  // Hardcoded personality types - you can modify these
  const personalityTypes = {
    type1: {
      title: "The Creative Explorer",
      image: "/images/avatar1.png", // Add your avatar image to public/images folder
      description: "You're a vibrant soul who thrives on new experiences! Your quick wit and adaptability make you the friend everyone turns to for fresh perspectives. While you might occasionally get lost in your own thoughts (especially during those Netflix marathons), your creative energy is contagious. You're basically a walking generator of fun ideas, with a dash of chaos and a sprinkle of genius!",
      traits: ["Imaginative", "Adventurous", "Spontaneous", "Friendly"],
      emoji: "✨🎨🌟"
    }
  };

  const handleAnswer = async (answer) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsLoading(true);
      setShowResults(true);
      
      try {
        const prompt = generatePromptFromAnswers(newAnswers);
        
        const response = await fetch('/api/openaiImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });

        const data = await response.json();
        
        // Store the generated image URL
        if (data.data && data.data[0]?.url) {
          setGeneratedAvatar(data.data[0].url);
        }
      } catch (error) {
        console.error('Failed to generate avatar:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

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
              <div className="grid grid-cols-1 gap-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="p-4 text-left rounded-lg border-2 border-purple-200 hover:border-purple-500 hover:bg-purple-50 dark:border-purple-700 dark:hover:border-purple-400 dark:hover:bg-purple-900 transition-all duration-200"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                {/* Larger spinner */}
                <div className="w-24 h-24 border-8 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
                
                {/* Loading text with animation */}
                <div className="flex items-center space-x-2">
                  <p className="text-xl font-medium text-purple-600 dark:text-purple-300">
                    Analyzing your personality
                  </p>
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-6">
                  {personalityTypes.type1.title} {personalityTypes.type1.emoji}
                </h2>

                {/* Avatar Image */}
                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden shadow-lg border-4 border-purple-300">
                  <Image
                    src={generatedAvatar || personalityTypes.type1.image}
                    alt="Personality Avatar"
                    width={192}
                    height={192}
                    className="object-cover"
                  />
                </div>

                {/* Description */}
                <div className="bg-purple-50 dark:bg-purple-900 p-6 rounded-xl">
                  <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                    {personalityTypes.type1.description}
                  </p>
                </div>

                {/* Traits */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {personalityTypes.type1.traits.map((trait, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-purple-200 dark:bg-purple-800 rounded-full text-sm font-medium"
                    >
                      {trait}
                    </span>
                  ))}
                </div>

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
