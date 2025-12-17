"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ImageGenerationPrompt } from "@/libs/helpers/prompt";

const SurveyResult = ({ survey, questions, answers }) => {
  const [loadingComponents, setLoadingComponents] = useState({});
  const [componentData, setComponentData] = useState({});
  const [errors, setErrors] = useState({});

  // Sort components by order
  const sortedComponents = survey.resultExperience?.components
    ? [...survey.resultExperience.components].sort((a, b) => (a.order || 0) - (b.order || 0))
    : [];

  useEffect(() => {
    // Process each component that needs AI generation
    const processComponents = async () => {
      for (const component of sortedComponents) {
        if (component.type === 'ai-avatar' || component.type === 'ai-custom') {
          await generateComponentData(component);
        }
      }
    };

    if (sortedComponents.length > 0 && questions && answers) {
      processComponents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateComponentData = async (component) => {
    const componentId = component.id;
    
    setLoadingComponents(prev => ({ ...prev, [componentId]: true }));
    setErrors(prev => ({ ...prev, [componentId]: null }));

    try {
      if (component.type === 'ai-avatar') {
        // Get AI instructions from component config
        const aiInstructions = component.config?.aiInstructions || 
          'Create a unique character based on their survey responses. The avatar should reflect their personality traits, communication style, and behavioral patterns.';
        
        // Format prompt using helper - answers is an object with index keys
        const prompt = ImageGenerationPrompt(aiInstructions, answers, questions);
        
        // Call avatar API
        const response = await axios.post('/api/openai/avatar', { prompt });
        
        setComponentData(prev => ({
          ...prev,
          [componentId]: {
            type: 'ai-avatar',
            imageUrl: response.data.data?.[0]?.url,
            prompt: prompt
          }
        }));
      } else if (component.type === 'ai-custom') {
        // Get custom AI instructions from component config
        const customPrompt = component.config?.prompt || '';
        const title = component.config?.title || 'Your Personalized Insights';
        const sections = component.config?.sections || [];
        
        // Format the content with questions, answers, and instructions
        // answers is an object like {0: "answer1", 1: "answer2"}
        const qaPairs = questions.map((q, index) => {
          const answer = answers[index] || answers[q._id] || 'No answer';
          return `Q: ${q.title}\nA: ${answer}`;
        }).join('\n\n');
        
        const formattedContent = `${customPrompt}\n\nBased on these survey responses:\n${qaPairs}`;
        
        // Call custom AI API
        const response = await axios.post('/api/openai/custom', { 
          content: formattedContent 
        });
        
        setComponentData(prev => ({
          ...prev,
          [componentId]: {
            type: 'ai-custom',
            title: title,
            sections: sections,
            data: response.data
          }
        }));
      }
    } catch (error) {
      console.error(`Error generating ${component.type}:`, error);
      setErrors(prev => ({
        ...prev,
        [componentId]: error.response?.data?.error || error.message || 'Failed to generate content'
      }));
    } finally {
      setLoadingComponents(prev => ({ ...prev, [componentId]: false }));
    }
  };

  // Render AI Avatar Component
  const renderAIAvatar = (component) => {
    const componentId = component.id;
    const isLoading = loadingComponents[componentId];
    const data = componentData[componentId];
    const error = errors[componentId];

    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-purple-500/20">
        {isLoading ? (
          <div className="flex flex-col items-center gap-6">
            <div className="loading loading-spinner loading-lg text-purple-500"></div>
            <p className="text-white/60">Generating your unique avatar...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-400">
            <p>⚠️ {error}</p>
          </div>
        ) : data?.imageUrl ? (
          <div className="flex flex-col items-center gap-6">
            {/* Avatar Image */}
            <div className="relative">
              <div className="w-56 h-56 rounded-3xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-purple-500/20 border-4 border-purple-500/40 overflow-hidden shadow-2xl relative flex items-center justify-center">
                <img 
                  src={data.imageUrl}
                  alt="AI Generated Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-2 -left-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2 shadow-lg">
                <span className="text-xl">✨</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-2 shadow-lg">
                <span className="text-xl">🌟</span>
              </div>
            </div>
            
            {/* Personality Info */}
            <div className="text-center space-y-3 w-full">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Your Unique Avatar
              </h3>
              <p className="text-white/60 text-sm font-medium">AI-generated based on your responses</p>
            </div>
            
            {/* Personality Description */}
            <div className="w-full bg-gradient-to-br from-purple-900/50 via-pink-900/40 to-purple-900/50 border-2 border-purple-500/40 rounded-2xl p-8 backdrop-blur-sm shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">💭</span>
                  <h4 className="text-white/90 font-semibold text-lg">Personality Insights</h4>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">
                  Your personalized avatar has been generated based on your survey responses. This unique character reflects your personality traits and behavioral patterns.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-white/60">
            <p>No avatar generated</p>
          </div>
        )}
      </div>
    );
  };

  // Render AI Custom Component
  const renderAICustom = (component) => {
    const componentId = component.id;
    const isLoading = loadingComponents[componentId];
    const data = componentData[componentId];
    const error = errors[componentId];
    const title = component.config?.title || 'Your Personalized Insights';

    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-purple-500/20">
        {isLoading ? (
          <div className="flex flex-col items-center gap-6">
            <div className="loading loading-spinner loading-lg text-purple-500"></div>
            <p className="text-white/60">Generating personalized insights...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-400">
            <p>⚠️ {error}</p>
          </div>
        ) : data ? (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {title}
              </h3>
            </div>
            
            {/* Render sections if available */}
            {data.sections && data.sections.length > 0 ? (
              <div className="space-y-4">
                {data.sections.map((section, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-xl p-5 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-500/20 rounded-lg p-2 mt-1">
                        <span className="text-lg">💡</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-purple-300 mb-2 text-lg">{section}</h4>
                        <p className="text-white/60 text-sm leading-relaxed">
                          AI-generated content for {section.toLowerCase()} based on your responses...
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-xl p-5 backdrop-blur-sm">
                <p className="text-white/80 text-sm leading-relaxed">
                  {data.data ? JSON.stringify(data.data, null, 2) : 'AI-generated content will appear here...'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-white/60">
            <p>No content generated</p>
          </div>
        )}
      </div>
    );
  };

  // Render other component types (placeholder for now)
  const renderComponent = (component) => {
    switch (component.type) {
      case 'ai-avatar':
        return renderAIAvatar(component);
      case 'ai-custom':
        return renderAICustom(component);
      case 'custom-message':
        return (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-purple-500/20 text-center">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
              <span className="text-4xl">💬</span>
            </div>
            <p className="text-white text-lg">{component.config?.message || 'Thank you for completing our survey!'}</p>
          </div>
        );
      case 'discount-code':
        return (
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-2xl p-8 border-t-4 border-green-500/50 text-center">
            <div className="bg-green-500/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto border border-green-500/30 mb-4">
              <span className="text-4xl">🎁</span>
            </div>
            <h4 className="font-bold text-2xl text-green-400 mb-4">Special Reward!</h4>
            <div className="bg-gray-900/50 rounded-xl p-6 border border-green-500/30 backdrop-blur-sm max-w-md mx-auto">
              <div className="text-2xl font-mono font-bold text-green-400 mb-3">
                {component.config?.code || 'SURVEY20'}
              </div>
              <p className="text-white/80">{component.config?.message || 'Get 20% off your next purchase!'}</p>
            </div>
          </div>
        );
      case 'cta-button':
        return (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-purple-500/20 text-center">
            <a
              href={component.config?.buttonUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-white btn-lg shadow-lg hover:shadow-purple-500/50 transition-all inline-block"
            >
              {component.config?.buttonText || 'Visit Website'}
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  if (!survey.resultExperience?.enabled || sortedComponents.length === 0) {
    return (
      <div className="text-center space-y-8 py-12">
        <div className="text-7xl md:text-9xl mb-6">🎉</div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Thank You!</h2>
        <p className="text-xl md:text-2xl text-gray-300 mb-8">
          Your response has been recorded successfully.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Result Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          Your Results
        </h2>
        <p className="text-white/50 text-sm">Personalized just for you</p>
      </div>

      {/* Render Components in Order */}
      {sortedComponents.map((component) => (
        <div key={component.id}>
          {renderComponent(component)}
        </div>
      ))}
    </div>
  );
};

export default SurveyResult;

