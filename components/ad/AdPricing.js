"use client";

import { useState } from "react";

export default function AdPricing() {
  const [selectedPlan, setSelectedPlan] = useState("yearly");
  const [formData, setFormData] = useState({
    businessName: "",
    website: "",
    adTitle: "",
    adDescription: "",
    targetUrl: "",
    plan: "yearly"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission - will need backend integration
    console.log("Application submitted:", { ...formData, plan: selectedPlan });
    alert("Application submitted! We'll review and get back to you within 24 hours.");
  };

  return (
    <div className="p-8 pb-24">
      <section className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-purple-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
            <span className="text-purple-300 font-semibold text-sm">Reach Thousands of Survey Creators</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            Advertise on GetQuizzy
          </h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
            Get your product in front of engaged users actively creating and sharing surveys. 
            Every ad is seen by real people taking surveys.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mb-2">
              10K+
            </div>
            <div className="text-gray-400 text-sm">Monthly Survey Views</div>
          </div>
          <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30 text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text mb-2">
              85%
            </div>
            <div className="text-gray-400 text-sm">Engagement Rate</div>
          </div>
          <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30 text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text mb-2">
              24h
            </div>
            <div className="text-gray-400 text-sm">Approval Time</div>
          </div>
        </div>

        {/* Pricing Toggle */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-gray-800/80 backdrop-blur-xl rounded-full p-1.5 border border-gray-700">
            <button
              onClick={() => setSelectedPlan("monthly")}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                selectedPlan === "monthly"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPlan("yearly")}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 relative ${
                selectedPlan === "yearly"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full animate-pulse">
                Save 40%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Standard Plan */}
          <div className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Standard</h3>
              <p className="text-gray-400">Perfect for small businesses</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-white">
                  ${selectedPlan === "monthly" ? "49" : "29"}
                </span>
                <span className="text-gray-400 text-lg">/month</span>
              </div>
              {selectedPlan === "yearly" && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-gray-500 line-through text-sm">$588/year</span>
                  <span className="text-green-400 font-semibold text-sm">Save $240/year!</span>
                </div>
              )}
              {selectedPlan === "monthly" && (
                <div className="mt-2 text-gray-500 text-sm">Billed monthly</div>
              )}
              {selectedPlan === "yearly" && (
                <div className="mt-2 text-purple-400 text-sm font-semibold">Billed $348/year</div>
              )}
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "2 ad spaces (left + right sidebar)",
                "10K impressions/month",
                "Basic analytics dashboard",
                "Standard support",
                "Monthly performance reports",
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                setFormData({ ...formData, plan: `standard-${selectedPlan}` });
                document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105"
            >
              Apply for Standard
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl rounded-3xl p-8 border-2 border-purple-500 relative hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-full">
              ⭐ MOST POPULAR
            </div>

            <div className="mb-6 mt-2">
              <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
              <p className="text-purple-200">Maximum visibility & growth</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                  ${selectedPlan === "monthly" ? "99" : "59"}
                </span>
                <span className="text-purple-200 text-lg">/month</span>
              </div>
              {selectedPlan === "yearly" && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-purple-300 line-through text-sm">$1,188/year</span>
                  <span className="text-green-400 font-bold text-sm">🔥 Save $480/year!</span>
                </div>
              )}
              {selectedPlan === "monthly" && (
                <div className="mt-2 text-purple-300 text-sm">Billed monthly</div>
              )}
              {selectedPlan === "yearly" && (
                <div className="mt-2 text-pink-400 text-sm font-bold">💎 Billed $708/year (Best Value!)</div>
              )}
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "5 ad spaces (prime positions)",
                "50K impressions/month",
                "Advanced analytics + A/B testing",
                "Priority support (24/7)",
                "Weekly performance reports",
                "Custom ad creative assistance",
                "Featured in mobile carousel",
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-pink-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-purple-100 font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                setFormData({ ...formData, plan: `premium-${selectedPlan}` });
                document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/50"
            >
              Apply for Premium ⚡
            </button>
          </div>
        </div>

        {/* Application Form */}
        <div id="application-form" className="max-w-3xl mx-auto bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">Apply for Ad Space</h2>
            <p className="text-gray-400">Fill out the form below and we&apos;ll review your application within 24 hours</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Business/Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-all"
                placeholder="e.g., Acme Corp"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Website/URL *
              </label>
              <input
                type="url"
                required
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-all"
                placeholder="https://your-website.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Ad Title (max 30 characters) *
              </label>
              <input
                type="text"
                required
                maxLength={30}
                value={formData.adTitle}
                onChange={(e) => setFormData({ ...formData, adTitle: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-all"
                placeholder="e.g., Best AI Tool 2026"
              />
              <div className="text-xs text-gray-500 mt-1">{formData.adTitle.length}/30 characters</div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Ad Description (max 60 characters) *
              </label>
              <textarea
                required
                maxLength={60}
                rows={2}
                value={formData.adDescription}
                onChange={(e) => setFormData({ ...formData, adDescription: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-all resize-none"
                placeholder="e.g., Automate your workflow with AI"
              />
              <div className="text-xs text-gray-500 mt-1">{formData.adDescription.length}/60 characters</div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Target URL (where should the ad link to?) *
              </label>
              <input
                type="url"
                required
                value={formData.targetUrl}
                onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-all"
                placeholder="https://your-landing-page.com"
              />
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-purple-200">
                  <strong className="text-purple-100">Manual Approval Process:</strong> All ads are reviewed to ensure quality and relevance. 
                  We&apos;ll send you a confirmation email within 24 hours once approved. Rejected applications will receive feedback.
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/50 text-lg"
            >
              Submit Application 🚀
            </button>
          </form>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "How long does approval take?",
                a: "We review all applications within 24 hours. You'll receive an email with your approval status or feedback."
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes! You can cancel your subscription anytime. No long-term commitment required."
              },
              {
                q: "What happens if my ad gets rejected?",
                a: "We'll provide specific feedback on why your ad was rejected and give you a chance to revise and resubmit."
              },
              {
                q: "Do I get a refund if I switch from monthly to yearly?",
                a: "Yes! We'll pro-rate your monthly payments and apply them to the yearly plan."
              },
            ].map((faq, index) => (
              <details key={index} className="bg-gray-800/80 backdrop-blur-xl rounded-xl p-6 border border-gray-700 group">
                <summary className="font-semibold text-white cursor-pointer flex items-center justify-between">
                  {faq.q}
                  <svg className="w-5 h-5 text-purple-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-4 text-gray-400">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
