'use client'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import NewsLetter from '@/components/NewsLetter'
import Products from '@/components/Products'
import { category, shopData } from '@/data'
import {  useGetImagesQuery, useGetProductsQuery } from '@/store/storeApi'
import { motion } from 'framer-motion'
// import 'antd/dist/antd.css';
import { useEffect, useState } from 'react'

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('trending')
  const {isLoading,data,isError,error} = useGetProductsQuery()
  const {data:images,isLoading:imageLoading} = useGetImagesQuery()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }
 
  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">

      {/* Hero Section */}
     <HeroSection images={images?.heroImages || []}  />

    

      {/* Featured Products Tabs */}
      <section className="container  mx-auto px-4 py-16  bg-white w-full max-w-[100vw]">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800">
          Explore Our Collections
        </h2>
        <div className="flex justify-center mb-8">
          {['trending', 'new', 'bestsellers'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 mx-2 rounded-full font-semibold transition-all 
                ${activeTab === tab 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
        <Products data={data} />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800">
          Why Shop With Us
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {shopData.map((feature, index) => (
            <motion.div 
              key={index}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
              }}
              className={`${feature.bg} flex items-center space-x-6 
                p-6 rounded-2xl transform transition-all 
                duration-300 hover:rotate-2 cursor-pointer`}
            >
              {feature.icon}
              <div>
                <h3 className="font-bold text-xl text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
  {/* <NewsLetter /> */}

      {/* Footer */}
 
    </div>
  )
}

export default LandingPage