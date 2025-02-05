'use client'
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';


const Products = ({ data,userRole,deleteProduct }) => {
 


 

  return (
    <>
      {data?.map((product) => {
        const [currentImageIndex, setCurrentImageIndex] = useState(0);
        const [isHovering, setIsHovering] = useState(false);

        // Define paths with default fallback
        const mainImagePath = product.image
          ? `${process.env.NEXT_PUBLIC_BASE_URL}${product.image}`
          : '/uploads/1737204160962-Screenshotfrom2024-09-1315-46-37.png';

        const hoverImagePath = product.hoverImages?.length
          ? product.hoverImages.map((img) => `${process.env.NEXT_PUBLIC_BASE_URL}${img}`)
          : [`/uploads/1737204160962-Screenshotfrom2024-09-1315-46-37.png`];

        return (
          <Link href={`/products/${product._id}`} key={product._id}>
            <motion.div
              key={product._id}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
              }}
              className="bg-gray-50 overflow-hidden
                     transform transition-all duration-300
                     hover:rotate-1 hover:border-blue-200
                     border-2 border-transparent"
            >
              <div
                className="relative overflow-hidden"
                onMouseEnter={() => {
                  setIsHovering(true);
                  setCurrentImageIndex(1); // Show the first hover image
                }}
                onMouseLeave={() => {
                  setIsHovering(false);
                  setCurrentImageIndex(0); // Reset to main image
                }}
              >
                <motion.img
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={isHovering ? hoverImagePath[currentImageIndex] : mainImagePath}
                  alt={product.name}
                  className="w-full object-cover transition-transform duration-300
                         transform hover:scale-110"
                />
                {product.label && (
                  <div
                    className="absolute top-4 right-4
                              bg-red-500 text-white px-3 py-1 rounded-full
                              text-sm font-bold"
                  >
                    {product.label}
                  </div>
                )}
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
              {/* Render delete button for admin */}
            
            </motion.div>
          </Link>
        );
      })}
    </>
  );
};

export default Products;
