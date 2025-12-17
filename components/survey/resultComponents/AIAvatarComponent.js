"use client";

const AIAvatarComponent = ({ comp, updateComponentConfig, removeComponent }) => {
  return (
    <div className="relative group">
      {/* Component Preview */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/40 transition-all">
        {/* Remove Button */}
        <button
          onClick={() => removeComponent(comp.id)}
          className="absolute top-3 right-3 btn btn-xs btn-circle bg-red-500/80 hover:bg-red-500 border-0 text-white opacity-0 group-hover:opacity-100 transition-all z-10 shadow-lg"
        >
          ✕
        </button>

        <div className="p-8">
          {/* AI Instructions Input Section */}
          <div className="mb-8 bg-gray-900/50 rounded-xl p-6 border border-purple-500/20">
            <label className="text-white/80 text-sm font-semibold mb-3 block flex items-center gap-2">
              <span className="text-lg">🤖</span>
              AI Avatar Instructions
            </label>
            <textarea
              className="textarea bg-gray-800/50 border-2 border-purple-500/30 focus:border-purple-500 w-full text-white placeholder:text-white/30 focus:outline-none resize-none min-h-[120px]"
              rows={4}
              value={comp.config.aiInstructions || ""}
              onChange={(e) => updateComponentConfig(comp.id, 'aiInstructions', e.target.value)}
              placeholder="Describe how the AI should generate the avatar and personality. For example: 'Create a unique character based on their creative and analytical traits. The avatar should reflect their leadership style and communication preferences.'"
            />
            <p className="text-white/40 text-xs mt-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              These instructions guide the AI in generating a personalized avatar and personality
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            {/* Avatar Emoji - Enhanced */}
            <div className="relative">
              <div className="w-56 h-56 rounded-3xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-purple-500/20 border-4 border-purple-500/40 overflow-hidden shadow-2xl relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-pink-600/30 animate-pulse"></div>
                {/* Large emoji avatar */}
                <span className="text-9xl relative z-10 filter drop-shadow-lg">🤖</span>
                {/* Animated glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/20 to-purple-500/0 opacity-50"></div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-2 -left-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2 shadow-lg animate-bounce" style={{ animationDuration: '2s' }}>
                <span className="text-xl">✨</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-2 shadow-lg animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
                <span className="text-xl">🌟</span>
              </div>
              
              {/* Floating particles effect */}
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            </div>
            
            {/* Personality Info - Enhanced */}
            <div className="text-center space-y-3 w-full">
              <div className="relative">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  The Creative Visionary
                </h3>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-20 animate-pulse"></div>
              </div>
              <p className="text-white/60 text-sm font-medium">Your unique AI-generated personality</p>
            </div>
            
            {/* Personality Description - Enhanced */}
            <div className="w-full bg-gradient-to-br from-purple-900/50 via-pink-900/40 to-purple-900/50 border-2 border-purple-500/40 rounded-2xl p-8 backdrop-blur-sm shadow-xl relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.4),transparent_50%)]"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">💭</span>
                  <h4 className="text-white/90 font-semibold text-lg">Personality Insights</h4>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">
                  A dynamic AI-generated personality description will appear here based on the user&apos;s survey responses and your instructions. This section adapts to show unique insights about their character, traits, and behavioral patterns.
                </p>
              </div>
            </div>
            
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAvatarComponent;

