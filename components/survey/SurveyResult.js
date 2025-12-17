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
        
        // Call avatar API to generate the image
        const avatarResponse = await axios.post('/api/openai/avatar', { prompt });
        const imageUrl = avatarResponse.data.data?.[0]?.url;
        
        // Call custom AI API to generate a creative name for the avatar
        const namePrompt = `Based on this avatar description: "${prompt}". Generate a creative and catchy 2-3 word name for this character. Only return the name, nothing else. Examples: "Glamorous Tiger", "Wise Owl", "Cheerful Sunflower". Keep it short and memorable.`;
        const nameResponse = await axios.post('/api/openai/custom', { 
          content: namePrompt 
        });
        
        // Extract the name from the response
        let avatarName = 'Your Avatar';
        try {
          const nameData = nameResponse.data;
          console.log('Avatar name response:', nameData);
          
          if (nameData && nameData.content) {
            avatarName = nameData.content.trim();
          } else if (typeof nameData === 'string') {
            avatarName = nameData.trim();
          }
        } catch (e) {
          console.error('Error parsing avatar name:', e);
        }
        
        setComponentData(prev => ({
          ...prev,
          [componentId]: {
            type: 'ai-avatar',
            imageUrl: imageUrl,
            avatarName: avatarName,
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
              <div className="w-64 h-64 rounded-3xl overflow-hidden shadow-2xl relative">
                <img 
                  src={data.imageUrl}
                  alt={data.avatarName || "AI Generated Avatar"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Avatar Name */}
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              {data.avatarName || 'Your Avatar'}
            </h3>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="loading loading-spinner loading-lg text-purple-500"></div>
            <p className="text-white/60">Preparing your avatar...</p>
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

    // Extract the AI-generated content from the response
    let aiGeneratedContent = '';
    if (data?.data) {
      try {
        console.log('AI Custom data:', data.data);
        
        // New format: direct content property
        if (data.data.content) {
          aiGeneratedContent = data.data.content;
        } else if (typeof data.data === 'string') {
          aiGeneratedContent = data.data;
        }
      } catch (e) {
        console.error('Error parsing AI custom content:', e);
      }
    }

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
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {title}
              </h3>
            </div>
            
            {/* Display AI-generated content */}
            {aiGeneratedContent ? (
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
                <div className="prose prose-invert max-w-none">
                  <p className="text-white/90 text-base leading-relaxed whitespace-pre-wrap">
                    {aiGeneratedContent}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
                <p className="text-white/60 text-sm text-center">
                  Generating your personalized insights...
                </p>
              </div>
            )}
            
            {/* Show sections if defined */}
            {data.sections && data.sections.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {data.sections.map((section, idx) => (
                  <div key={idx} className="bg-purple-500/20 px-3 py-1 rounded-full text-purple-300 text-xs font-medium">
                    {section}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="loading loading-spinner loading-lg text-purple-500"></div>
            <p className="text-white/60">Preparing your insights...</p>
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

