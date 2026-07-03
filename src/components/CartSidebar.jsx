import React from 'react';
import { motion } from 'framer-motion';

export default function CartSidebar({ isOpen, onClose, cartItems, handleUpdateQty, handleRemoveItem, onCheckout }) {
  const [isCheckoutLoading, setIsCheckoutLoading] = React.useState(false);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity), 0);

  const handleCheckoutClick = () => {
    setIsCheckoutLoading(true);
    setTimeout(() => {
      setIsCheckoutLoading(false);
      onCheckout();
    }, 1000);
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-[320px] sm:w-[380px] bg-[#fbf9f6] text-gray-900 z-50 p-6 sm:p-8 shadow-[-10px_0_30px_rgba(0,0,0,0.15)] border-l border-gray-200 flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <span className="text-xs font-black tracking-widest uppercase font-display">YOUR CART ({cartCount})</span>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-500 cursor-pointer transition-colors duration-300 outline-none"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items List */}
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] pr-2">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400 gap-3">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="text-xs font-bold uppercase tracking-wider">Your cart is empty</span>
            </div>
          ) : (
            cartItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-200/60 shadow-xs"
              >
                <img src={item.path} alt={item.name} className="w-14 h-14 object-contain" />
                <div className="flex-1 flex flex-col min-w-0">
                  <span className="text-xs font-extrabold text-gray-900 truncate leading-snug">{item.name}</span>
                  <span className="text-[10px] font-bold text-gray-500 mt-0.5">{item.price}</span>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleUpdateQty(item.id, -1)}
                      className="w-5 h-5 rounded-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold text-xs cursor-pointer outline-none"
                    >
                      -
                    </button>
                    <span className="text-xs font-black text-gray-900 w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQty(item.id, 1)}
                      className="w-5 h-5 rounded-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold text-xs cursor-pointer outline-none"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-gray-400 hover:text-red-500 cursor-pointer p-1 outline-none border-none bg-transparent"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Checkout Section */}
      {cartItems.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subtotal</span>
            <span className="text-sm font-black text-gray-900">
              ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <button 
            onClick={handleCheckoutClick}
            disabled={isCheckoutLoading}
            className="w-full py-3.5 bg-gray-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors shadow-md cursor-pointer border-0 outline-none flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-wait"
          >
            {isCheckoutLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <span>Checkout</span>
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
}
