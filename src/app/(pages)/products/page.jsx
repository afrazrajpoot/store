"use client";
import Products from "@/components/Products";
import { useGetProductsQuery } from "@/store/storeApi";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Package2,
  Filter,
  X,
  ChevronDown,
  Grid,
  Sliders,
} from "lucide-react";

const AllProductsPageContent = () => {
  const searchParams = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [currentRange, setCurrentRange] = useState({ min: 0, max: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [view, setView] = useState("grid");
  const { isLoading, data, isError, error } = useGetProductsQuery();

  useEffect(() => {
    if (data) {
      const prices = data.map((product) => product.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange({ min: minPrice, max: maxPrice });
      setCurrentRange({ min: minPrice, max: maxPrice });
      setFilteredProducts(data); // Initially show all products
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      let filtered = [...data];
      filtered = filtered.filter(
        (product) =>
          product.price >= currentRange.min && product.price <= currentRange.max
      );
      if (searchQuery) {
        filtered = filtered.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      switch (sortOption) {
        case "price-low":
          filtered = [...filtered].sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          filtered = [...filtered].sort((a, b) => b.price - a.price);
          break;
        case "popular":
          filtered = [...filtered].sort(
            (a, b) => (b.rating || 0) - (a.rating || 0)
          );
          break;
        case "newest":
        default:
          break;
      }

      setFilteredProducts(filtered);
    }
  }, [data, currentRange, searchQuery, sortOption]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
            }}
            className="h-16 w-16 border-4 border-black rounded-full border-t-transparent mb-6 mx-auto"
          />
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-gray-800 text-lg font-medium"
          >
            Loading all products...
          </motion.p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 p-8 rounded-lg shadow-lg max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-gray-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6"
          >
            <X className="text-gray-800" size={32} />
          </motion.div>
          <h2 className="text-gray-900 text-xl font-semibold mb-3 text-center">
            Unable to Load Products
          </h2>
          <p className="text-gray-600 text-center mb-6">{error.message}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 w-full bg-black hover:bg-gray-900 text-white py-4 rounded-md font-medium transition-colors duration-200"
            onClick={() => window.location.reload()}
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full bg-gray-100 mb-4"
      >
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            All Products
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl">
            Explore our entire collection of premium products designed for every
            style and occasion.
          </p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block w-64 flex-shrink-0"
          >
            <div className="sticky top-4">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Price Range
                </h2>
                <div className="space-y-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-900">
                      {formatPrice(currentRange.min)}
                    </span>
                    <span className="text-gray-900">
                      {formatPrice(currentRange.max)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-4">
                    <input
                      type="range"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={currentRange.min}
                      onChange={(e) =>
                        setCurrentRange({
                          ...currentRange,
                          min: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                    />
                    <input
                      type="range"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={currentRange.max}
                      onChange={(e) =>
                        setCurrentRange({
                          ...currentRange,
                          max: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Sort By
                </h2>
                <ul className="space-y-3">
                  {[
                    { id: "newest", label: "Newest" },
                    { id: "popular", label: "Most Popular" },
                    { id: "price-low", label: "Price: Low to High" },
                    { id: "price-high", label: "Price: High to Low" },
                  ].map((option) => (
                    <li key={option.id}>
                      <button
                        onClick={() => setSortOption(option.id)}
                        className={`text-gray-600 hover:text-black transition-colors flex items-center gap-2 ${
                          sortOption === option.id
                            ? "font-medium text-black"
                            : ""
                        }`}
                      >
                        {sortOption === option.id && (
                          <motion.span
                            layoutId="activeSortIndicator"
                            className="w-1 h-4 bg-black"
                          />
                        )}
                        <span>{option.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filters */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:hidden mb-6"
            >
              <div className="flex items-center gap-4 justify-between">
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="flex items-center gap-2 font-medium text-gray-900"
                >
                  <Sliders size={20} />
                  <span>Filters</span>
                </button>

                <div className="relative group">
                  <button className="flex items-center gap-2 font-medium text-gray-900">
                    <span>
                      Sort:{" "}
                      {sortOption
                        .replace("-", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                    <ChevronDown size={16} />
                  </button>
                  <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md w-48 py-2 z-10 hidden group-hover:block">
                    {[
                      { id: "newest", label: "Newest" },
                      { id: "popular", label: "Most Popular" },
                      { id: "price-low", label: "Price: Low to High" },
                      { id: "price-high", label: "Price: High to Low" },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSortOption(option.id)}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                          sortOption === option.id ? "font-medium" : ""
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {filtersOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-4 bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Price Range
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>{formatPrice(currentRange.min)}</span>
                          <span>{formatPrice(currentRange.max)}</span>
                        </div>
                        <input
                          type="range"
                          min={priceRange.min}
                          max={priceRange.max}
                          value={currentRange.min}
                          onChange={(e) =>
                            setCurrentRange({
                              ...currentRange,
                              min: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                        />
                        <input
                          type="range"
                          min={priceRange.min}
                          max={priceRange.max}
                          value={currentRange.max}
                          onChange={(e) =>
                            setCurrentRange({
                              ...currentRange,
                              max: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => setFiltersOpen(false)}
                        className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-900 transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="relative max-w-xl mx-auto">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent text-gray-700 placeholder-gray-400 shadow-sm"
                  placeholder="Search all products..."
                />
              </div>
            </motion.div>

            {/* Products Count and View Toggle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between mb-6"
            >
              <div className="flex items-center gap-2 text-gray-600">
                <Package2 size={18} className="text-gray-900" />
                <span className="font-medium">{filteredProducts.length}</span>
                <span>
                  {filteredProducts.length === 1 ? "product" : "products"} found
                </span>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView("grid")}
                  className={`p-2 rounded-md ${
                    view === "grid" ? "bg-gray-200" : "bg-white"
                  }`}
                >
                  <Grid
                    size={20}
                    className={
                      view === "grid" ? "text-gray-900" : "text-gray-500"
                    }
                  />
                </motion.button>
                {/* Add list view button if implementing list view */}
              </div>
            </motion.div>

            {/* Products Grid */}
            <AnimatePresence mode="wait">
              {filteredProducts.length > 0 ? (
                <motion.div
                  key="products"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  <Products data={filteredProducts} />
                </motion.div>
              ) : (
                <motion.div
                  key="no-products"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Package2
                      className="mx-auto mb-6 text-gray-400"
                      size={48}
                    />
                  </motion.div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    No Products Found
                  </h2>
                  <p className="text-gray-600">
                    Try adjusting your filters or search terms
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const AllProductsPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="text-gray-900 text-xl font-semibold"
          >
            Loading...
          </motion.div>
        </div>
      }
    >
      <AllProductsPageContent />
    </Suspense>
  );
};

export default AllProductsPage;
