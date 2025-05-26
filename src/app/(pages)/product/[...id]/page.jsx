"use client";
import React, { useState, useEffect } from "react";
import { Image as AntImage } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCartIcon,
  HeartIcon,
  ShareIcon,
  Plus,
  PlusCircleIcon,
} from "lucide-react";
import {
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useGetProductsQuery,
} from "../../../../store/storeApi";
// import CommentSection from '@/components/CommentSection';
import Products from "../../../../components/Products";
import Link from "next/link";
import { useGlobalContext } from "../../../../app/context/GlobalState";

const ProductPage = ({ params }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [userRole, setUserRole] = useState();
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductByIdQuery(params?.id);
  const { count, setCount } = useGlobalContext();
  const { data, isError } = useGetProductsQuery();
  const [deleteProduct, { isLoading: isDeleting, isSuccess: deleteSuccess }] =
    useDeleteProductMutation();

  useEffect(() => {
    const savedCartItems = JSON.parse(
      localStorage.getItem("cartItems") || "[]"
    );
    setCartItems(savedCartItems);
  }, []);

  // Helper function to get stock quantity for a size
  const getStockQuantity = (size) => {
    const stockItem = product?.stock?.find((item) => item.size === size);
    return stockItem ? stockItem.quantity : 0;
  };

  const handleOrder = () => {
    if (!selectedSize || !selectedColor) return;

    const stockItem = product.stock.find((item) => item.size === selectedSize);

    if (!stockItem || stockItem.quantity === 0) {
      alert("Selected item is out of stock");
      return;
    }

    setCount((prev) => prev + 1);

    const orderDetails = {
      productId: product._id,
      name: product.name,
      size: selectedSize,
      color: selectedColor,
      price: product.price,
      image: product.image,
      quantity: 1,
      totalItemPrice: product.price,
    };

    const updatedCartItems = [...cartItems, orderDetails];
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
    alert("Item added to cart!");
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserRole(user?.user?.role);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-[1.1vw] font-bold text-gray-800">Loading...</h1>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-[1.1vw] font-bold text-gray-800">
          Product not found
        </h1>
      </div>
    );
  }
  if (deleteSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-[1.1vw] font-bold text-gray-800">
          Product deleted successfully
        </h1>
      </div>
    );
  }

  const allImages = [product.image, ...(product.hoverImages || [])];
  const uniqueSizes = product?.stock
    ? [...new Set(product.stock.map((item) => item.size))]
    : [];
  const allColors = product?.stock
    ? [...new Set(product.stock.flatMap((item) => item.color))]
    : [];

  // Animation variants for size selection
  const sizeButtonVariants = {
    idle: {
      scale: 1,
      boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)",
    },
    hover: {
      scale: 1,
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2, ease: "easeOut" },
    },
    selected: {
      scale: 1.1,
      boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.3, ease: "easeOut" },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  };

  // Animation variants for color selection
  const colorButtonVariants = {
    idle: {
      scale: 1,
      rotate: 0,
      boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)",
    },
    hover: {
      scale: 1,
      rotate: 0,
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.2, ease: "easeOut" },
    },
    selected: {
      scale: 1.2,
      rotate: 0,
      boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.3, ease: "easeOut" },
    },
    tap: {
      scale: 0.9,
      rotate: 0,
      transition: { duration: 0.1 },
    },
  };

  // Stagger animation for size buttons
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <>
      <motion.div
        initial={{
          opacity: 0,
          rotateX: 15,
          scale: 0.95,
          perspective: 1000,
        }}
        animate={{
          opacity: 1,
          rotateX: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.8,
          ease: [0.645, 0.045, 0.355, 1],
          staggerChildren: 0.1,
        }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-[7vw]">
          <div className="lg:space-y-3 order-2 lg:order-1 lg:sticky lg:top-0 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 lg:pr-12">
            <div className="space-y-8">
              {allImages.map((img, index) => (
                <div key={index} className="relative group w-[calc(100%-1rem)]">
                  <AntImage.PreviewGroup>
                    <div className="overflow-hidden bg-gray-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <AntImage
                        src={`/api/uploads?filename=${img}`}
                        alt={`${product.name} ${index + 1}`}
                        className="w-[900px] h-[900px] object-contain"
                        preview={{
                          mask: (
                            <div className="text-[1vw] font-semibold">
                              Click to zoom
                            </div>
                          ),
                        }}
                      />
                    </div>
                  </AntImage.PreviewGroup>
                  {index === 0 && product.label && (
                    <div className="absolute top-4 right-4 bg-black-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full font-semibold shadow-lg text-[1vw]">
                      {product.label}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:order-2 order-1 space-y-6 mt-[3vw]">
            <div className="space-y-4">
              <h1 className=" text-[5vw] lg:text-[1.3vw] text-gray-900">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4">
                <span className=" text-[3vw] lg:text-[0.8vw] font-bold text-black-600">
                  PKR {product.price}
                </span>
              </div>
            </div>

            <div className="space-y-2 mt-[14vw]">
              <h1 className=" text-[3vw] lg:text-[0.7vw] leading-[1.9] font-bold text-gray-900">
                Description
              </h1>
              <p className=" text-[2.5vw] lg:text-[0.7vw]">
                {product.description}
              </p>
            </div>

            <section>
              <div className="mt-[2vw]">
                {product.specifications && (
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div key={key} className="space-x-1 flex gap-[1vw]">
                          <h3 className="text-[3vw] lg:text-[0.8vw] text-gray-900 font-bold uppercase">
                            {key}
                          </h3>
                          <p className=" text-[2.5vw] lg:text-[0.7vw] text-gray-500">
                            {value}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {uniqueSizes.length > 0 && (
                <div className="flex items-center space-x-8 mt-[1vw]">
                  <h2 className="text-[3vw] lg:text-[0.8vw] font-bold">Size</h2>
                  <motion.div
                    className="flex flex-wrap gap-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {uniqueSizes.map((size) => {
                      const quantity = getStockQuantity(size);
                      const isSelected = selectedSize === size;
                      const isAvailable = quantity > 0;

                      return (
                        <motion.div
                          key={size}
                          className="flex flex-col items-center"
                          variants={itemVariants}
                        >
                          <motion.button
                            onClick={() => isAvailable && setSelectedSize(size)}
                            className={`px-2 py-1 rounded border font-medium transition-colors duration-200
                              text-[3vw] lg:text-[0.8vw]
                              ${
                                isSelected
                                  ? "bg-black text-white border-black"
                                  : isAvailable
                                  ? "bg-white text-black border-gray-300 hover:border-gray-400"
                                  : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              }`}
                            disabled={!isAvailable}
                            variants={sizeButtonVariants}
                            initial="idle"
                            animate={isSelected ? "selected" : "idle"}
                            whileHover={isAvailable ? "hover" : "idle"}
                            whileTap={isAvailable ? "tap" : "idle"}
                          >
                            {size}
                          </motion.button>
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.8 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="mt-1 text-[0.6vw] text-green-600 font-medium"
                              >
                                Selected ✓
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>
              )}

              <div className="flex items-center space-x-8 mt-4">
                <h2 className="text-[3vw] lg:text-[0.8vw] font-bold">Colors</h2>
                <motion.div
                  className="flex flex-wrap gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {allColors.map((color) => {
                    const isSelected = selectedColor === color;

                    return (
                      <motion.div
                        key={color}
                        className="relative"
                        variants={itemVariants}
                      >
                        <motion.button
                          onClick={() => setSelectedColor(color)}
                          className="relative group focus:outline-none"
                          aria-label={`Select ${color} color`}
                          variants={colorButtonVariants}
                          initial="idle"
                          animate={isSelected ? "selected" : "idle"}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <div
                            className={`w-8 h-8 rounded-full transition-all duration-200 border-2
                              ${
                                isSelected
                                  ? "border-blue-600"
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                            style={{
                              backgroundColor: color.toLowerCase(),
                              borderColor:
                                color.toLowerCase() === "white" && !isSelected
                                  ? "#e5e7eb"
                                  : isSelected
                                  ? "#2563eb"
                                  : "transparent",
                            }}
                          />

                          {/* Selection indicator */}
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="absolute inset-0 flex items-center justify-center"
                              >
                                <div className="w-3 h-3 bg-white rounded-full shadow-lg border border-gray-200" />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Color name tooltip */}
                          <div
                            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                                      opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                      text-[1.5vw] lg:text-[0.65vw] text-gray-600 whitespace-nowrap
                                      bg-white px-2 py-1 rounded shadow-lg border"
                          >
                            {color}
                          </div>
                        </motion.button>

                        {/* Selected label */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.8 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.8 }}
                              transition={{
                                duration: 0.3,
                                ease: "easeOut",
                                delay: 0.1,
                              }}
                              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2
                                        text-[0.6vw] text-green-600 font-medium whitespace-nowrap"
                            >
                              Selected ✓
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </section>

            <div className="space-y-4 mt-4">
              <button
                onClick={handleOrder}
                disabled={
                  !selectedSize ||
                  !selectedColor ||
                  getStockQuantity(selectedSize) === 0
                }
                className={`w-full py-2 px-9 text-[3vw] lg:text-[0.9vw] font-semibold border-[1px] border-black
                  flex items-center justify-center gap-2
                  ${
                    selectedSize &&
                    selectedColor &&
                    getStockQuantity(selectedSize) > 0
                      ? "bg-black text-white hover:bg-gray-800"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                  }`}
              >
                <ShoppingCartIcon size={20} />
                Add to cart
              </button>
              {userRole === "admin" && (
                <>
                  <Link href={`/update-product/${product._id}`}>
                    Update product
                  </Link>

                  <div className="flex justify-end p-4">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.preventDefault();
                        deleteProduct(product._id);
                      }}
                    >
                      Delete product
                    </button>
                  </div>
                </>
              )}
            </div>

            <div
              className="space-y-4 mt-4 pt-4 border-t"
              onClick={() => setShowCareerModal(!showCareerModal)}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-[3vw] lg:text-[0.8vw] font-semibold">
                  Care Instructions
                </h2>
                <button
                  className="text-black-600 hover:text-black-700 font-bold transition-colors"
                  aria-label="Show more care instructions"
                >
                  {showCareerModal ? "-" : "+"}
                </button>
              </div>
              {showCareerModal && (
                <motion.p
                  initial={{
                    opacity: 0,
                    rotateX: 15,
                    scale: 0.95,
                    perspective: 1000,
                  }}
                  animate={{
                    opacity: 1,
                    rotateX: 0,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.645, 0.045, 0.355, 1],
                    staggerChildren: 0.1,
                  }}
                  className="text-[3vw] lg:text-[0.7vw] text-gray-600 bg-gray-50 p-4 rounded-xl"
                >
                  {product.care}
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      <h1 className="w-full max-auto text-[5vw] lg:text-[1.5vw] font-bold text-center mt-[5vw]">
        Similar Products
      </h1>
      <div className="grid grid-cols-2 mt-[5vw] md:grid-cols-4 gap-1 p-[1vw]">
        <Products data={data} />
      </div>
    </>
  );
};

export default ProductPage;
