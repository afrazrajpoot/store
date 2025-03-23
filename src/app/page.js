"use client";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import NewsLetter from "@/components/NewsLetter";
import Products from "@/components/Products";
import { shopData } from "@/data";
import { useGetImagesQuery, useGetProductsQuery } from "@/store/storeApi";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState("trending");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { isLoading, data: products, isError, error } = useGetProductsQuery();
  const { data: images, isLoading: imageLoading } = useGetImagesQuery();

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };

  const categories = products
    ? [...new Set(products.map((product) => product.category))]
    : [];

  useEffect(() => {
    if (products) {
      const filtered =
        activeTab === "trending"
          ? products
          : products.filter(
              (product) =>
                product.category.toLowerCase() === activeTab.toLowerCase()
            );
      setFilteredProducts(filtered);
    }
  }, [activeTab, products]);

  if (isLoading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="flex justify-center items-center min-h-screen text-red-600 font-medium">
          Error: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <HeroSection images={images?.heroImages || []} />

      {/* Categories Navigation */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <button
            onClick={() => setActiveTab("trending")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === "trending"
                ? "bg-gray-600 text-white shadow-md"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }`}
          >
            Trending
          </button>
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === category
                  ? "bg-gray-600 text-white shadow-md"
                  : "bg-gray-300 text-gray-800 hover:bg-gray-400"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Featured Products Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="container mx-auto px-4 py-16 bg-gray-100 w-full max-w-[100vw]"
      >
        <motion.h2
          variants={fadeInUp}
          className="text-4xl font-extrabold text-center mb-4 text-gray-800"
        >
          Explore Our Collections
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="text-gray-500 text-center mb-12 max-w-2xl mx-auto"
        >
          Discover our latest arrivals and bestsellers, designed for comfort and
          style.
        </motion.p>
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
        className="container mx-auto px-4 py-20 bg-gradient-to-b from-gray-100 to-gray-200"
      >
        <motion.h2
          variants={fadeInUp}
          className="text-4xl font-extrabold text-center mb-4 text-gray-800"
        >
          Why Shop With Us
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="text-gray-500 text-center mb-12 max-w-2xl mx-auto"
        >
          We’re committed to delivering an exceptional shopping experience with
          quality products and outstanding service.
        </motion.p>
        <motion.div
          variants={staggerChildren}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            {
              title: "Affordable Luxury",
              description:
                "Premium quality fabrics and designs at prices that won’t break the bank.",
              icon: "💎",
            },
            {
              title: "Fast Shipping",
              description:
                "Get your orders delivered quickly with our reliable shipping partners.",
              icon: "🚚",
            },
            {
              title: "Easy Returns",
              description:
                "Hassle-free returns within 30 days if you’re not completely satisfied.",
              icon: "🔄",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-gray-600 text-center"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-bold text-xl mb-4 text-gray-800">
                {item.title}
              </h3>
              <p className="text-gray-500">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </div>
  );
};

export default LandingPage;
