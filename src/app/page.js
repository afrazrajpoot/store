'use client'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import NewsLetter from '@/components/NewsLetter'
import Products from '@/components/Products'
import { shopData } from '@/data'
import { useGetImagesQuery, useGetProductsQuery } from '@/store/storeApi'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('trending')
  const [filteredProducts, setFilteredProducts] = useState([])
  const { isLoading, data: products, isError, error } = useGetProductsQuery()
  const { data: images, isLoading: imageLoading } = useGetImagesQuery()

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6
      }
    }
  }

  // Get unique categories from products
  const categories = products ? [...new Set(products.map(product => product.category))] : []

  useEffect(() => {
    if (products) {
      const filtered = activeTab === 'trending'
        ? products
        : products.filter(product => product.category.toLowerCase() === activeTab.toLowerCase())
      setFilteredProducts(filtered)
    }
  }, [activeTab, products])

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="flex justify-center items-center min-h-screen">Loading...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-white min-h-screen">
        <div className="flex justify-center items-center min-h-screen">Error: {error.message}</div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <HeroSection images={images?.heroImages || []} />

      {/* Brand Story Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="container mx-auto px-4 py-24 bg-gray-50"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            variants={fadeInUp}
            className="text-4xl font-extrabold mb-8 text-gray-800"
          >
            Our Story
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-lg text-gray-600 mb-12 leading-relaxed"
          >
            Roshni
I started Roshni with a simple yet powerful idea: to bring high-quality fabric to people at an affordable price—the kind of quality you see in big brands but at a price everyone can afford.

From the very beginning, our goal has been to break the myth that premium quality comes with a premium price. We focus on top-tier fabrics, modern designs, and attention to detail, ensuring that every piece reflects comfort, style, and durability.

Today, Roshni stands for more than just clothing—it’s a movement to redefine everyday fashion without compromise.

Join us in bringing quality and affordability together. Welcome to Roshni—where fashion meets fairness.
          </motion.p>
          <motion.div 
            variants={staggerChildren}
            className="grid md:grid-cols-3 gap-8"
          >
            {['Quality First', 'Sustainable Choice', 'Customer Focus'].map((title, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="p-6 bg-white rounded-lg shadow-sm"
              >
                <h3 className="font-bold text-xl mb-4 text-gray-800">{title}</h3>
                <p className="text-gray-600">
                  {title === 'Quality First' && 'Every product in our collection is carefully selected and quality-tested.'}
                  {title === "Sustainable Choice' && 'We're committed to reducing our environmental impact through eco-friendly practices."}
                  {title === 'Customer Focus' && 'Your satisfaction is our priority, with dedicated support and hassle-free returns.'}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Products Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="container mx-auto px-4 py-16 bg-white w-full max-w-[100vw]"
      >
        <motion.h2 
          variants={fadeInUp}
          className="text-4xl font-extrabold text-center mb-12 text-gray-800"
        >
          Explore Our Collections
        </motion.h2>
        
        <motion.div 
          variants={staggerChildren}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <Products data={filteredProducts} />
        </motion.div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="container mx-auto px-4 py-16 bg-gray-50"
      >
        <motion.h2 
          variants={fadeInUp}
          className="text-4xl font-extrabold text-center mb-12 text-gray-800"
        >
          Why Shop With Us
        </motion.h2>
        <motion.div 
          variants={staggerChildren}
          className="grid md:grid-cols-3 gap-8"
        >
          {shopData.map((feature, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
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
        </motion.div>
      </motion.section>

      {/* Values Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="container mx-auto px-4 py-24 bg-white"
      >
     
      </motion.section>

      <NewsLetter />
    </div>
  )
}

export default LandingPage