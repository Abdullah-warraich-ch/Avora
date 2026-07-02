import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SuccessPage({ onClose }) {
  // Simple seconds timer state
  const [seconds, setSeconds] = useState(59);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 59));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-[#fbf9f6] flex flex-col items-center justify-center p-6 text-center select-none"
    >
      <div className="max-w-md w-full flex flex-col items-center">
        {/* Simple, thin-stroke checkmark circle */}
        <motion.div 
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.15 }}
          className="w-12 h-12 rounded-full border border-emerald-500 flex items-center justify-center mb-8 text-emerald-500"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <motion.path 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.45 }}
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </motion.div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold font-sans text-gray-900 tracking-tight mb-4">
          Order Confirmed
        </h1>

        {/* Short, direct message */}
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-10 max-w-xs font-normal">
          Your order has been processed. Delivery is expected in the next 2 million years.
        </p>

        {/* Ultra-minimalist Countdown */}
        <div className="flex flex-col items-center mb-12 gap-1">
          <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Time Remaining</span>
          <span className="font-mono text-gray-950 text-sm font-bold tracking-wider">
            1,999,999 Y : 364 D : 23 H : 59 M : <span className="inline-block w-6 text-left">{String(seconds).padStart(2, '0')}</span> S
          </span>
        </div>

        {/* Plain Black CTA Button */}
        <button
          onClick={onClose}
          className="px-8 py-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer border-0 outline-none"
        >
          Continue Shopping
        </button>
      </div>
    </motion.div>
  );
}
