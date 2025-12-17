"use client";

const CTAButtonComponent = ({ comp, updateComponentConfig, removeComponent }) => {
  return (
    <div className="relative group">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/40 transition-all">
        <button
          onClick={() => removeComponent(comp.id)}
          className="absolute top-3 right-3 btn btn-xs btn-circle bg-red-500/80 hover:bg-red-500 border-0 text-white opacity-0 group-hover:opacity-100 transition-all z-10 shadow-lg"
        >
          ✕
        </button>

        <div className="p-8 text-center">
          <div className="space-y-4 max-w-md mx-auto">
            <div className="bg-gray-900/50 rounded-xl p-4 border border-purple-500/20">
              <label className="text-white/60 text-xs mb-2 block text-left">Button Text</label>
              <input
                type="text"
                className="input bg-transparent border-0 border-b border-purple-500/30 w-full text-center text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500"
                value={comp.config.buttonText}
                onChange={(e) => updateComponentConfig(comp.id, 'buttonText', e.target.value)}
                placeholder="Visit Our Website"
              />
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4 border border-purple-500/20">
              <label className="text-white/60 text-xs mb-2 block text-left">Button URL</label>
              <input
                type="url"
                className="input bg-transparent border-0 w-full text-center text-sm text-white/60 placeholder:text-white/30 focus:outline-none"
                value={comp.config.buttonUrl}
                onChange={(e) => updateComponentConfig(comp.id, 'buttonUrl', e.target.value)}
                placeholder="https://your-website.com"
              />
            </div>
            <div className="pt-4">
              <button className="btn bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-white btn-lg w-full shadow-lg hover:shadow-purple-500/50 transition-all">
                {comp.config.buttonText || 'Your CTA Button'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTAButtonComponent;

