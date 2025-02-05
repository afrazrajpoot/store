import React from 'react'
import { motion } from 'framer-motion'
const NewsLetter = () => {
  return (
    <>
        <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-white
        text-black py-20 overflow-hidden"
      >
        <div className="container mx-auto px-4 text-center relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 10 
            }}
          >
            <h2 className="text-4xl font-extrabold mb-6">
              Stay Updated, Stay Stylish
            </h2>
            <p className="mb-8 text-xl opacity-80">
              Subscribe for exclusive deals, new arrivals, and style tips!
            </p>
            <div className="max-w-md mx-auto flex shadow-2xl">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow px-6 py-4 rounded-l-full 
                  text-black outline-none
                  "
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-500 text-black px-8 py-4 
                  rounded-r-full hover:bg-yellow-600 
                  transition-colors font-bold"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </>
  )
}

export default NewsLetter