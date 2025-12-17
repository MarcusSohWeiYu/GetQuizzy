"use client";

const DiscountCodeComponent = ({ comp, updateComponentConfig, removeComponent }) => {
  return (
    <div className="relative group">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/40 transition-all">
        <button
          onClick={() => removeComponent(comp.id)}
          className="absolute top-3 right-3 btn btn-xs btn-circle bg-red-500/80 hover:bg-red-500 border-0 text-white opacity-0 group-hover:opacity-100 transition-all z-10 shadow-lg"
        >
          ✕
        </button>

        <div className="p-8 bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-t-4 border-green-500/50">
          <div className="text-center space-y-4">
            <div className="bg-green-500/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto border border-green-500/30">
              <span className="text-4xl">🎁</span>
            </div>
            <h4 className="font-bold text-2xl text-green-400">Special Reward!</h4>
            <div className="bg-gray-900/50 rounded-xl p-6 border border-green-500/30 backdrop-blur-sm max-w-md mx-auto">
              <input
                type="text"
                className="input bg-green-500/10 border-2 border-green-500/30 w-full text-center font-mono text-2xl font-bold mb-3 text-green-400 placeholder:text-green-400/30 focus:outline-none focus:border-green-500"
                value={comp.config.code}
                onChange={(e) => updateComponentConfig(comp.id, 'code', e.target.value)}
                placeholder="DISCOUNT20"
              />
              <input
                type="text"
                className="input bg-transparent border-0 w-full text-center text-white/80 placeholder:text-white/30 focus:outline-none"
                value={comp.config.message}
                onChange={(e) => updateComponentConfig(comp.id, 'message', e.target.value)}
                placeholder="Get 20% off your next purchase!"
              />
            </div>
            <p className="text-xs text-green-400/60">✨ Expires in {comp.config.expiryDays} days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountCodeComponent;

