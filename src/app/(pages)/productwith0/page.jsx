"use client";
import { motion } from "framer-motion";
import Products from "../../../components/Products";
import { useGetProduct0Query } from "../../../store/storeApi";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const ProductPage = () => {
  const { data, isLoading, isError } = useGetProduct0Query();
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.user?.role != "admin") {
      router.push("/");
    }
  }, []);
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="bg-gray-200 rounded-lg h-64"
        />
      ))}
    </div>
  );

  // Error or empty state component
  const EmptyState = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center px-4"
    >
      <div className="bg-gray-100 p-8 rounded-full mb-6">
        <svg
          className="w-16 h-16 text-gray-400"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M20 12H4M12 4v16" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        No Products Found
      </h3>
      <p className="text-gray-600">{message}</p>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState message="There was an error loading the products. Please try again later." />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState message="Currently there are no products available with quantity in stock." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <Products data={data} />
      </motion.div>
    </div>
  );
};

export default ProductPage;
