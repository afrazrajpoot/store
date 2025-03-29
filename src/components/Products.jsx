"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const Products = ({ data, userRole, deleteProduct }) => {
  // Manage hover state for each product
  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <>
      {data?.map((product, index) => {
        // Define paths with default fallback
        const mainImagePath = product.image
          ? `/api/uploads?filename=${product.image}`
          : "";

        const hoverImagePath = product.hoverImages?.length
          ? product.hoverImages.map((img) => `/api/uploads?filename=${img}`)
          : [``];

        return (
          <Link href={`/product/${product._id}`} key={product._id}>
            <motion.div
              key={product._id}
              className="bg-gray-50 overflow-hidden 
                     transform transition-all duration-300 
                     hover:border-black 
                     border-2 border-transparent relative"
            >
              <div
                className="relative overflow-hidden"
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <motion.img
                  key={hoverIndex === index ? 1 : 0}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={hoverIndex === index ? hoverImagePath[0] : mainImagePath}
                  alt={product.name}
                  className="w-full object-cover transition-transform duration-300"
                />

                {/* Product Labels Container */}
                <div className="absolute top-4 right-4 space-y-2">
                  {product.label && (
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {product.label}
                    </div>
                  )}

                  {/* Free Home Delivery Tag */}
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Free Home Delivery
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-xl mb-2 text-gray-800">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-black">
                    PKR {product.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        );
      })}
    </>
  );
};

export default Products;
