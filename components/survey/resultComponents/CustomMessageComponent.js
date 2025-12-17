"use client";

const CustomMessageComponent = ({ comp, updateComponentConfig, removeComponent }) => {
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
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
            <span className="text-4xl">💬</span>
          </div>
          <textarea
            className="textarea bg-transparent border-2 border-purple-500/30 focus:border-purple-500 w-full text-center text-lg text-white placeholder:text-white/30 focus:outline-none resize-none"
            rows={3}
            value={comp.config.message}
            onChange={(e) => updateComponentConfig(comp.id, 'message', e.target.value)}
            placeholder="Thank you for completing our survey! Your feedback means a lot to us."
          />
        </div>
      </div>
    </div>
  );
};

export default CustomMessageComponent;

