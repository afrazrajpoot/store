'use client'
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';

const OrderSuccessPopup = ({ 
  isOpen, 
  onClose, 
  orderNumber = "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
  customerName = "" 
}) => {
  const [progress, setProgress] = useState(100);
  
  // Auto-close countdown effect
  useEffect(() => {
    if (isOpen && progress > 0) {
      const timer = setInterval(() => {
        setProgress((prev) => Math.max(prev - 0.5, 0));
      }, 50);
      
      return () => clearInterval(timer);
    }
  }, [isOpen, progress]);

  // Auto-close when progress reaches 0
  useEffect(() => {
    if (progress === 0) {
      onClose();
    }
  }, [progress, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Progress bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-green-500"
              />
            </div>

            <div className="p-6 pt-8">
              {/* Success animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20 
                }}
                className="w-16 h-16 mx-auto mb-4"
              >
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute inset-0"
                  >
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Order Placed Successfully!
                </h2>
                <p className="text-gray-600 mb-6">
                  Thank you{customerName && `, ${customerName}`}! Your order has been confirmed.
                </p>

                {/* Order details */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 text-gray-800 font-medium">
                    <ShoppingBag className="w-5 h-5 text-green-500" />
                    <span>Order Number: {orderNumber}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {/* Handle view order details */}}
                    className="flex-1 px-6 py-3 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
                  >
                    View Order
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderSuccessPopup;