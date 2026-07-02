import React from 'react';
import { motion } from 'framer-motion';

export default function MenuSidebar({ isOpen, onClose, activeBag }) {
  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute top-0 left-0 h-full w-[280px] sm:w-[320px] text-white z-50 p-8 shadow-[10px_0_30px_rgba(0,0,0,0.3)] border-r border-white/5 flex flex-col justify-between"
      style={{
        background: `linear-gradient(135deg, ${activeBag.gradientStart} 0%, ${activeBag.gradientEnd} 100%)`
      }}
    >
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <span className="text-sm font-black tracking-widest uppercase font-display">AVORA</span>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 cursor-pointer transition-colors duration-300 bg-black/10 outline-none"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Links List */}
        <nav className="flex flex-col gap-6">
          {['Collections', 'Lookbook', 'Sustainability', 'Journal', 'Our Story'].map((link, idx) => (
            <motion.a
              key={link}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08, type: "spring", stiffness: 150 }}
              href="#"
              className="text-lg font-extrabold tracking-wide hover:text-white/80 transition-colors duration-300"
            >
              {link}
            </motion.a>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-4 text-white/60 text-[10px] tracking-wide border-t border-white/10 pt-6">
        <span>© {new Date().getFullYear()} AVORA INC.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">Pinterest</a>
        </div>
      </div>
    </motion.div>
  );
}
