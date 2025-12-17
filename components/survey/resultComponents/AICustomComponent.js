"use client";

const AICustomComponent = ({ comp, updateComponentConfig, removeComponent }) => {
  const addSection = () => {
    const currentSections = comp.config.sections || [];
    const newSections = [...currentSections, `Section ${currentSections.length + 1}`];
    updateComponentConfig(comp.id, 'sections', newSections);
  };

  const removeSection = (index) => {
    const currentSections = comp.config.sections || [];
    if (currentSections.length > 1) {
      const newSections = currentSections.filter((_, i) => i !== index);
      updateComponentConfig(comp.id, 'sections', newSections);
    }
  };

  const updateSection = (index, value) => {
    const currentSections = [...(comp.config.sections || [])];
    currentSections[index] = value;
    updateComponentConfig(comp.id, 'sections', currentSections);
  };

  return (
    <div className="relative group">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/40 transition-all">
        <button
          onClick={() => removeComponent(comp.id)}
          className="absolute top-3 right-3 btn btn-xs btn-circle bg-red-500/80 hover:bg-red-500 border-0 text-white opacity-0 group-hover:opacity-100 transition-all z-10 shadow-lg"
        >
          ✕
        </button>

        <div className="p-8">
          <div className="space-y-6">
            
            {/* Header with explanation */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl">✨</span>
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Custom AI Section
                </h3>
              </div>
              <p className="text-white/60 text-sm max-w-2xl mx-auto">
                Create personalized AI-generated content based on your instructions and the user&apos;s survey responses
              </p>
            </div>

            {/* How it works explanation */}
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-5 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="bg-purple-500/20 rounded-lg p-2 mt-0.5">
                  <span className="text-xl">ℹ️</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-purple-300 mb-2">How it works</h4>
                  <p className="text-white/70 text-sm leading-relaxed space-y-1">
                    <span className="block">• The AI will analyze the user&apos;s <strong>questions and answers</strong> from your survey</span>
                    <span className="block">• It will use your <strong>custom instructions</strong> below to generate personalized content</span>
                    <span className="block">• The generated content will appear in the sections you define</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Section Title */}
            <div className="bg-gray-900/50 rounded-lg p-4 border border-purple-500/20">
              <label className="text-white/70 text-xs font-semibold mb-2 block flex items-center gap-2">
                <span>📝</span>
                Section Title
              </label>
              <input
                type="text"
                className="input w-full bg-transparent border-0 border-b-2 border-purple-500/30 focus:border-purple-500 text-white text-xl font-bold placeholder:text-white/30 focus:outline-none"
                value={comp.config.title || ''}
                onChange={(e) => updateComponentConfig(comp.id, 'title', e.target.value)}
                placeholder="e.g., Your Career Insights, Personality Analysis, Product Recommendations..."
              />
            </div>
            
            {/* AI Instructions */}
            <div className="bg-gray-900/50 rounded-lg p-4 border border-purple-500/20">
              <label className="text-white/70 text-xs font-semibold mb-2 block flex items-center gap-2">
                <span>🤖</span>
                AI Instructions (What to generate)
              </label>
              <textarea
                className="textarea bg-transparent border-0 w-full text-white/80 text-sm focus:outline-none placeholder:text-white/30 resize-none min-h-[100px]"
                rows={4}
                value={comp.config.prompt || ''}
                onChange={(e) => updateComponentConfig(comp.id, 'prompt', e.target.value)}
                placeholder="Describe what you want the AI to generate. For example: 'Analyze the user's responses and provide personalized career advice based on their interests and personality traits. Include specific recommendations for career paths that align with their answers.'"
              />
              <p className="text-white/40 text-xs mt-2 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Be specific! The AI will use these instructions along with the users&apos; survey answers to generate personalized content.
              </p>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICustomComponent;

