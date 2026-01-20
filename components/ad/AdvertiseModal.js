"use client";

import { useEffect } from "react";
import ButtonAdvertiseCheckout from "./ButtonAdvertiseCheckout";
import ButtonCheckout from "@/components/ButtonCheckout";

export default function AdvertiseModal({ isOpen, onClose }) {
  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-md bg-gray-900 rounded-lg shadow-2xl border border-gray-700">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Header */}
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mb-1">
              Advertise on GetQuizzy (Test)
            </h2>
            <p className="text-gray-400 text-xs">
              Reach thousands of engaged users daily
            </p>
          </div>

          {/* How it works */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">How it works</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
            Your ad appears in rotating sponsor slots on desktop sidebars and mobile banners across all GetQuizzy surveys. Sponsors rotate every 3 seconds to ensure fair visibility.
            </p>
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white">Availability</h3>
            
            <div className="space-y-1 text-gray-300 text-xs">
              <div className="flex items-center gap-2">
                <span>Max spots:</span>
                <span className="font-semibold text-white">20</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span>Status:</span>
                <span className="font-semibold text-green-400">All available</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span>Next slot:</span>
                <span className="font-semibold text-gray-300">Open now!</span>
              </div>
            </div>
          </div>

          {/* Lock in your spot */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 space-y-2">
            <h3 className="text-sm font-bold text-white">Lock in your spot</h3>
            
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-gray-400">Monthly:</span>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                $49/mo
              </span>
              <span className="text-[10px] text-gray-500">(adjusted based on traffic)</span>
            </div>
          </div>

          {/* CTA Button */}
          <ButtonAdvertiseCheckout />

          {/* Additional Info */}
          <p className="text-[10px] text-gray-500 text-center pt-2 border-t border-gray-800">
            All ads are subject to approval • 24-48 hour review
          </p>
        </div>
      </div>
    </div>
  );
}
