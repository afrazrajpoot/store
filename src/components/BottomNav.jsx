"use client";
import React, { useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useGlobalContext } from "../app/context/GlobalState";
import Link from "next/link";
import { motion } from "framer-motion";

const BottomNav = () => {
  const { count, setCount } = useGlobalContext();

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setCount(products.length);
  }, []);

  return (
    <nav className="fixed bottom-0 right-0 w-full md:w-auto md:max-w-[60px] bg-white md:bg-transparent shadow-lg z-50">
      <div className="flex justify-end items-center p-4">
        <Link
          href="/cart"
          className="relative p-2 md:p-0 hover:bg-gray-100 md:hover:bg-transparent rounded-full transition-colors"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="relative"
          >
            <ShoppingCart size={24} className="text-gray-700 cursor-pointer" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </motion.div>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
