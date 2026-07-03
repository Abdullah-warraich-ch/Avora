import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
// Import the product data from our separate data file
import { bagsData } from '../data/bagsData';
// Import extracted sidebars
import MenuSidebar from './MenuSidebar';
import CartSidebar from './CartSidebar';
import SuccessPage from './SuccessPage';

export default function BagShowcase() {
  // 1. STATE & VARIABLES
  const keys = useMemo(() => Object.keys(bagsData), []);

  // Single source of truth for product order. index 0 is always the activeKey.
  const [productKeys, setProductKeys] = useState(keys);

  const activeKey = productKeys[0];
  const activeBag = bagsData[activeKey];

  // Derived explore keys (all keys except the active one)
  const exploreKeys = useMemo(() => productKeys.slice(1), [productKeys]);

  // searchQuery: Tracks the user's typed search query
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered explore keys for rendering based on search query
  const filteredExploreKeys = useMemo(() => {
    if (!searchQuery) return exploreKeys;
    const query = searchQuery.toLowerCase();
    return exploreKeys.filter((key) => {
      const bag = bagsData[key];
      return (
        bag.name.toLowerCase().includes(query) ||
        bag.description.toLowerCase().includes(query)
      );
    });
  }, [exploreKeys, searchQuery]);

  // cartItems: Array of objects representing items in the shopping cart
  const [cartItems, setCartItems] = useState([]);

  // isCartPulsing: Triggers a scale pulse animation on the cart icon when clicked
  const [isCartPulsing, setIsCartPulsing] = useState(false);

  // showToast: Controls the visibility of the "Added to Cart" toast banner
  const [showToast, setShowToast] = useState(false);

  // Sidebars open/close states
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Success page overlay state
  const [showSuccessPage, setShowSuccessPage] = useState(false);

  // isTransitioning: True when layout transition is in progress, false otherwise
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Derived cart count from items array
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Dynamic Favicon Update: Sets the browser tab's favicon dynamically to the selected product's image
  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = activeBag.path;
  }, [activeBag.path]);

  // handleBagSelect: Atomic reordering using functional updates to avoid stale state & race conditions.
  const handleBagSelect = useCallback((selectedKey) => {
    if (selectedKey === activeKey) return;
    
    setIsTransitioning(true);
    setProductKeys((prevKeys) => {
      const currentActive = prevKeys[0];
      if (currentActive === selectedKey) return prevKeys;
      const remaining = prevKeys.slice(1).filter((k) => k !== selectedKey);
      return [selectedKey, currentActive, ...remaining];
    });
  }, [activeKey]);

  // handleLayoutAnimationComplete: Resets transition state when layout animation completes
  const handleLayoutAnimationComplete = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  // handleAddToCart: Appends active bag to cart items list or increments quantity
  const handleAddToCart = useCallback(() => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === activeKey);
      if (existing) {
        return prev.map((item) =>
          item.id === activeKey ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: activeKey, quantity: 1, ...activeBag }];
    });

    setIsCartPulsing(true);
    setShowToast(true);

    // Reset animations
    setTimeout(() => setIsCartPulsing(false), 300);
  }, [activeKey, activeBag]);

  // Auto-hide toast timer using useEffect to prevent memory leaks or multiple timers
  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(timer);
  }, [showToast]);

  // handleUpdateQty: Modifies the quantity of a specific cart item
  const handleUpdateQty = useCallback((itemId, amount) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + amount;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  }, []);

  // handleRemoveItem: Removes an item entirely from the cart
  const handleRemoveItem = useCallback((itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  // handleCheckout: Shows success page overlay and closes cart sidebar
  const handleCheckout = useCallback(() => {
    setIsCartOpen(false);
    setShowSuccessPage(true);
  }, []);

  // handleCloseSuccessPage: Hides success page and clears all items in shopping cart
  const handleCloseSuccessPage = useCallback(() => {
    setShowSuccessPage(false);
    setCartItems([]);
  }, []);

  return (
    // ROOT WRAPPER: Single viewport dashboard
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none font-sans">
      
      {/* ====================================================
          BACKDROP OVERLAY (For both Menu and Cart sidebars)
          ==================================================== */}
      <AnimatePresence>
        {(isMenuOpen || isCartOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsMenuOpen(false);
              setIsCartOpen(false);
            }}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 cursor-pointer"
          />
        )}
      </AnimatePresence>

      {/* ====================================================
          MENU SIDEBAR (Slides from Left)
          ==================================================== */}
      <AnimatePresence>
        {isMenuOpen && (
          <MenuSidebar 
            isOpen={isMenuOpen} 
            onClose={() => setIsMenuOpen(false)} 
            activeBag={activeBag} 
          />
        )}
      </AnimatePresence>

      {/* ====================================================
          CART SIDEBAR (Slides from Right)
          ==================================================== */}
      <AnimatePresence>
        {isCartOpen && (
          <CartSidebar 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)} 
            cartItems={cartItems} 
            handleUpdateQty={handleUpdateQty} 
            handleRemoveItem={handleRemoveItem} 
            onCheckout={handleCheckout}
          />
        )}
      </AnimatePresence>

      {/* ====================================================
          SUCCESS CONFIRMATION PAGE (Fullscreen Overlay Modal)
          ==================================================== */}
      <AnimatePresence>
        {showSuccessPage && (
          <SuccessPage onClose={handleCloseSuccessPage} />
        )}
      </AnimatePresence>

      {/* ====================================================
          TOAST FEEDBACK BANNER (Slide-in feedback)
          ==================================================== */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -60, scale: 0.95, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: -20, scale: 0.95, x: "-50%" }}
            className="fixed top-6 left-1/2 z-50 bg-[#fbf9f6]/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-white/50 flex items-center gap-3 w-[90%] max-w-sm"
          >
            <div className="w-8.5 h-8.5 rounded-xl bg-amber-800/10 text-amber-900 flex items-center justify-center shrink-0">
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[11px] font-black text-gray-900 leading-tight">Added to Cart</span>
              <span className="text-[9px] font-semibold text-gray-500 leading-tight mt-0.5 truncate">{activeBag.name}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================
          HERO SECTION
          ==================================================== */}
      <LayoutGroup id="bag-showcase">
        <section className="w-screen h-screen flex flex-col md:flex-row relative overflow-hidden">

          {/* LEFT PANEL (55% height on mobile, 65% width on desktop) */}
          <div className="w-full md:w-[65%] h-[55%] md:h-full p-6 sm:p-8 md:p-12 flex flex-col justify-between text-white relative overflow-hidden">
            
            {/* BACKGROUND LAYER: Cross-fades between gradients on selection change */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <AnimatePresence initial={false}>
                <motion.div
                  key={activeKey}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${activeBag.gradientStart} 0%, ${activeBag.gradientEnd} 100%)`
                  }}
                />
              </AnimatePresence>
            </div>

            {/* Left Section Header */}
            <div className="flex justify-between items-center z-10 gap-4">
              <div className="flex items-center gap-3 md:gap-6">
                <button 
                  onClick={() => setIsMenuOpen(true)}
                  className="group flex flex-col gap-1.5 justify-center items-start text-white hover:opacity-85 cursor-pointer bg-transparent border-0 p-1.5 outline-none w-8 h-8 shrink-0"
                >
                  <span className="w-5 h-[2px] bg-white rounded-full transition-all duration-300 group-hover:w-6" />
                  <span className="w-7 h-[2px] bg-white rounded-full transition-all duration-300 group-hover:w-5" />
                  <span className="w-3.5 h-[2px] bg-white rounded-full transition-all duration-300 group-hover:w-6" />
                </button>
                <h2 className="text-xs md:text-sm font-black tracking-widest uppercase font-display">Avora</h2>
              </div>

              {/* Typeable Search Bar */}
              <div className="flex items-center gap-2 bg-white/10 hover:bg-white/15 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/5 transition-all focus-within:bg-white/20 focus-within:border-white/20 focus-within:ring-2 focus-within:ring-white/10 w-32 sm:w-44 md:w-56">
                <svg className="w-3.5 h-3.5 text-white/70 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search store..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-[10px] md:text-xs text-white placeholder-white/40 w-full"
                />
              </div>
            </div>

            {/* Left Section Content: Animated text details container */}
            <div className="my-auto pr-0 md:pr-[20%] z-10 mt-4 sm:mt-6 md:mt-auto min-h-[170px] sm:min-h-[220px] md:min-h-[260px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeKey}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="flex flex-col gap-2 md:gap-4"
                >
                  {/* Product Price */}
                  <div>
                    <div className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight mt-1">
                      {activeBag.price}
                    </div>
                  </div>

                  {/* Product Name */}
                  <h1 className="text-lg sm:text-2xl md:text-4xl font-extrabold leading-snug tracking-tight font-display text-white drop-shadow-sm">
                    {activeBag.name}
                  </h1>

                  {/* Description */}
                  <p className="text-[11px] sm:text-xs md:text-sm text-white/80 leading-relaxed max-w-md font-normal tracking-wide">
                    {activeBag.description}
                  </p>

                  {/* Call to Action Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="self-start mt-2 md:mt-3"
                  >
                    <button
                      onClick={handleAddToCart}
                      className="group relative px-6 py-2.5 sm:px-8 sm:py-4 bg-white rounded-xl font-bold text-xs sm:text-sm shadow-[0_10px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_15px_25px_rgba(0,0,0,0.18)] transition-all duration-300 cursor-pointer flex items-center gap-2 overflow-hidden border-0 outline-none"
                    >
                      {/* Expanding Dot Background */}
                      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gray-950 rounded-full scale-0 group-hover:scale-[7] transition-transform duration-500 ease-out origin-center pointer-events-none" />

                      {/* Button Content (Z-indexed above expanding background) */}
                      <span className="relative z-10 flex items-center gap-2 text-gray-950 group-hover:text-white transition-colors duration-300">
                        <span>Add to Cart</span>
                        <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </button>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ====================================================
              RIGHT PANEL (45% height on mobile, 35% width on desktop)
              ==================================================== */}
          <div className="w-full md:w-[35%] h-[45%] md:h-full bg-[#fbf9f6] p-6 sm:p-8 md:p-12 flex flex-col justify-between text-gray-800 relative">
            
            {/* Right Section Header */}
            <div className="flex justify-between items-center z-10">
              
              {/* Simple, Beautiful Profile Card */}
              <div className="flex items-center gap-2.5 cursor-pointer group transition-all duration-300">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center border border-gray-200 bg-white shadow-sm transform group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] md:text-xs font-bold text-gray-800 leading-none group-hover:text-amber-900 transition-colors duration-300">Abdullah</span>
                  <span className="text-[8px] text-gray-400 font-bold tracking-widest mt-1 uppercase leading-none">GOLD MEMBER</span>
                </div>
              </div>

              {/* Simple, Beautiful Cart Icon (Desktop version, hidden on mobile) */}
              <motion.div
                animate={isCartPulsing ? { scale: [1, 1.25, 1] } : {}}
                transition={{ duration: 0.3 }}
                onClick={() => setIsCartOpen(true)}
                className="relative cursor-pointer group hidden md:block"
              >
                <div className="w-9 h-9 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-amber-800 border-2 border-[#fbf9f6] text-[8px] font-black text-white rounded-full flex items-center justify-center shadow-sm"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.div>
            </div>

            {/* Right Section Explorer List: Horizontal on mobile, vertical on desktop */}
            <div className="flex flex-row md:flex-col gap-4 self-center md:self-end pr-0 md:pr-4 my-auto z-10 w-full md:w-auto items-center md:items-end justify-center">
              <div className="flex flex-row md:flex-col gap-4 md:gap-6 justify-center w-full md:w-auto">
                {filteredExploreKeys.map((key) => {
                  const item = bagsData[key];
                  return (
                    <motion.button
                      layout
                      key={key}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                      onClick={() => handleBagSelect(key)}
                      className="group relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-transparent border-0 cursor-pointer shrink-0 outline-none"
                    >
                      {/* Ring highlight border on hover */}
                      <div className="absolute inset-0 rounded-full group-hover:scale-110 transition-all duration-300 pointer-events-none" />

                      {/* Thumbnail Image */}
                      <motion.img
                        layoutId={`bag-img-${key}`}
                        src={item.path}
                        alt={item.name}
                        className="w-[80%] h-[80%] object-contain z-10"
                        animate={{ opacity: 0.7, scale: 1 }}
                        whileHover={{ scale: 1.08, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                      />
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Cart Icon (Mobile version, positioned at bottom right, hidden on desktop) */}
            <div className="flex md:hidden justify-end items-center z-10 w-full mt-auto">
              <motion.div
                animate={isCartPulsing ? { scale: [1, 1.25, 1] } : {}}
                transition={{ duration: 0.3 }}
                onClick={() => setIsCartOpen(true)}
                className="relative cursor-pointer group"
              >
                <div className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-amber-800 border-2 border-[#fbf9f6] text-[8px] font-black text-white rounded-full flex items-center justify-center shadow-sm"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.div>
            </div>
          </div>

          {/* ====================================================
              OVERLAPPING SHOWN BAG IMAGE (Center overlay, inside hero)
              ==================================================== */}
          <div className="absolute top-[48%] md:top-1/2 left-1/2 md:left-[65%] -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-none w-full md:w-[60%] flex items-center justify-center">
            <motion.img
              key={activeKey}
              layoutId={`bag-img-${activeKey}`}
              src={activeBag.path}
              alt={activeBag.name}
              onLayoutAnimationComplete={handleLayoutAnimationComplete}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="absolute w-[180px] sm:w-[240px] md:w-[380px] h-auto object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.25)]"
            />
          </div>

        </section>
      </LayoutGroup>

    </div>
  );
}
