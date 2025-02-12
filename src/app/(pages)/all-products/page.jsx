'use client'
import Products from '@/components/Products'
import { useGetProductsQuery } from '@/store/storeApi'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Package2 } from 'lucide-react'

const CategoryPageContent = () => {
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  const [filteredProducts, setFilteredProducts] = useState([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 })
  const [searchQuery, setSearchQuery] = useState('')
  const { isLoading, data, isError, error } = useGetProductsQuery()

  useEffect(() => {
    if (data) {
      const relevantProducts = category
        ? data.filter(product => product.category.toLowerCase() === category.toLowerCase())
        : data
      if (relevantProducts.length > 0) {
        const prices = relevantProducts.map(product => product.price)
        setPriceRange({ min: Math.min(...prices), max: Math.max(...prices) })
      }
    }
  }, [data, category])

  useEffect(() => {
    if (data) {
      let filtered = data
      if (category) {
        filtered = filtered.filter(product => 
          product.category.toLowerCase() === category.toLowerCase()
        )
      }
      filtered = filtered.filter(product => 
        product.price >= priceRange.min && product.price <= priceRange.max
      )
      if (searchQuery) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      setFilteredProducts(filtered)
    }
  }, [data, category, priceRange, searchQuery])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"
        />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-l-4 border-red-500 p-6 rounded-xl shadow-lg max-w-md w-full"
        >
          <h2 className="text-red-700 text-lg font-semibold mb-2">Error Loading Products</h2>
          <p className="text-red-600">{error.message}</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className=" mx-auto py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Search Section */}
          <div className="relative max-w-2xl mx-auto">
            <motion.div 
              className="flex items-center bg-white rounded-full shadow-lg overflow-hidden"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Search className="ml-4 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-4 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                placeholder="Search amazing products..."
              />
            </motion.div>
          </div>

          {/* Products Count Badge */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md text-gray-600">
              <Package2 size={16} className="text-blue-500" />
              <span>{filteredProducts.length}</span>
              <span className="text-gray-400">
                {filteredProducts.length === 1 ? 'product' : 'products'}
              </span>
            </span>
          </motion.div>

          {/* Products Grid */}
          <AnimatePresence mode="wait">
            {filteredProducts.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-1"
              >
                <Products data={filteredProducts} />
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md mx-auto"
              >
                <Package2 className="mx-auto mb-4 text-blue-500" size={32} />
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  No products found
                </h2>
                <p className="text-gray-500">
                  Try adjusting your search criteria
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

const CategoryPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryPageContent />
    </Suspense>
  )
}

export default CategoryPage
