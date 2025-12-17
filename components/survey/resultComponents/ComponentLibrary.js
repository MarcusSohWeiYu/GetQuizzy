"use client";

// Export available components for use in other files (e.g., limit checking)
export const availableComponents = [
  {
    type: 'ai-avatar',
    icon: '🤖',
    title: 'AI Avatar & Personality',
    description: 'Generate a unique character based on survey answers',
    badge: 'Popular',
    limit: 1
  },
  {
    type: 'ai-custom',
    icon: '✨',
    title: 'Custom AI Section',
    description: 'Generate any AI-powered content: personality traits, career advice, product recommendations, learning paths, etc.',
    limit: null
  },
  {
    type: 'custom-message',
    icon: '💬',
    title: 'Custom Message',
    description: 'Display a personalized thank you message',
    limit: null
  },
  {
    type: 'discount-code',
    icon: '🎁',
    title: 'Discount Code',
    description: 'Reward respondents with a discount or promo code',
    limit: null
  },
  {
    type: 'cta-button',
    icon: '🔗',
    title: 'Call-to-Action Button',
    description: 'Direct users to your website or product',
    limit: null
  },
];

const ComponentLibrary = ({ resultComponents, onAddComponent }) => {
  return (
    <div className="lg:col-span-2">
      <h3 className="font-semibold text-base-content mb-3 flex items-center gap-2">
        <span>🎨</span>
        Component Library
      </h3>
      <div className="space-y-3">
        {availableComponents.map((comp) => {
          const existingCount = resultComponents.filter(c => c.type === comp.type).length;
          const canAdd = !comp.limit || existingCount < comp.limit;
          
          return (
            <div
              key={comp.type}
              className={`bg-base-100 rounded-xl p-4 border-2 transition-all ${
                canAdd 
                  ? 'border-dashed border-base-300 hover:border-primary cursor-pointer hover:shadow-lg' 
                  : 'border-base-200 opacity-50 cursor-not-allowed'
              }`}
              onClick={() => canAdd && onAddComponent(comp.type)}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{comp.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{comp.title}</h4>
                    {comp.badge && (
                      <span className={`badge badge-xs ${
                        comp.badge === 'Popular' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {comp.badge}
                      </span>
                    )}
                    {comp.limit && (
                      <span className="badge badge-xs badge-ghost">
                        {existingCount}/{comp.limit}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-base-content/60">{comp.description}</p>
                </div>
                <button className="btn btn-xs btn-ghost btn-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComponentLibrary;

