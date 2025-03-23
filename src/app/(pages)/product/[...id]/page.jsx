"use client";
import React, { useState, useEffect } from 'react';
import { Image as AntImage } from 'antd';
import { motion } from 'framer-motion';
import { ShoppingCartIcon, HeartIcon, ShareIcon, Plus, PlusCircleIcon } from 'lucide-react';
import { useDeleteProductMutation, useGetProductByIdQuery, useGetProductsQuery } from '@/store/storeApi';
import CommentSection from '@/components/CommentSection';
import Products from '@/components/Products';
import Link from 'next/link';
import { useGlobalContext } from '@/app/context/GlobalState';

const ProductPage = ({ params }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);
const [userRole,setUserRole] = useState()
  const { data: product, isLoading, error } = useGetProductByIdQuery(params?.id);
  const {count, setCount} = useGlobalContext();
  const {data,isError} = useGetProductsQuery();
  const [deleteProduct, { isLoading: isDeleting,isSuccess:deleteSuccess }] = useDeleteProductMutation();
  useEffect(() => {
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(savedCartItems);
  }, []);

  // Helper function to get stock quantity for a size
  const getStockQuantity = (size) => {
    const stockItem = product?.stock?.find(item => item.size === size);
    return stockItem ? stockItem.quantity : 0;
  };

  const handleOrder = () => {
    if (!selectedSize || !selectedColor) return;
    
    const stockItem = product.stock.find(
      item => item.size === selectedSize
    );

    if (!stockItem || stockItem.quantity === 0) {
      alert('Selected item is out of stock');
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
      totalItemPrice: product.price
    };

    const updatedCartItems = [...cartItems, orderDetails];
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
    alert('Item added to cart!');
  };

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem('user'));
    setUserRole(user?.user?.role)
    
  },[])

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
        <h1 className="text-[1.1vw] font-bold text-gray-800">Product not found</h1>
      </div>
    );
  }
  if(deleteSuccess){
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-[1.1vw] font-bold text-gray-800">Product deleted successfully</h1>
      </div>
    );
  }

  const allImages = [product.image, ...(product.hoverImages || [])];
  const uniqueSizes = product?.stock 
    ? [...new Set(product.stock.map(item => item.size))]
    : [];
  const allColors = product?.stock
    ? [...new Set(product.stock.flatMap(item => item.color))]
    : [];

  return (
    <>
      <motion.div    
        initial={{
          opacity: 0,
          rotateX: 15,
          scale: 0.95,
          perspective: 1000
        }}
        animate={{
          opacity: 1,
          rotateX: 0,
          scale: 1
        }}
        transition={{
          duration: 0.8,
          ease: [0.645, 0.045, 0.355, 1],
          staggerChildren: 0.1
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
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full object-contain"
                        preview={{
                          mask: (
                            <div className="text-[1vw] font-semibold">
                              Click to zoom
                            </div>
                          )
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
              <h1 className=" text-[5vw] lg:text-[1.3vw] text-gray-900">{product.name}</h1>
              <div className="flex items-center space-x-4">
                <span className=" text-[3vw] lg:text-[0.8vw] font-bold text-black-600">
                  PKR {product.price}
                </span>
                {product.discountPrice && (
                  <span className=" text-[3vw] lg:text-[0.8vw] text-gray-500 line-through">
                    PKR {product.discountPrice}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 mt-[14vw]">
              <h1 className=' text-[3vw] lg:text-[0.7vw] leading-[1.9] font-bold text-gray-900'>Description</h1>
              <p className=' text-[2.5vw] lg:text-[0.7vw]'>{product.description}</p>
            </div>

            <section>
              <div className='mt-[2vw]'>
                {product.specifications && (
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="space-x-1 flex gap-[1vw]">
                        <h3 className="text-[3vw] lg:text-[0.8vw] text-gray-900 font-bold uppercase">{key}</h3>
                        <p className=" text-[2.5vw] lg:text-[0.7vw] text-gray-500">{value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {uniqueSizes.length > 0 && (
                <div className="flex items-center space-x-8 mt-[1vw]">
                  <h2 className="text-[3vw] lg:text-[0.8vw] font-bold">Size</h2>
                  <div className="flex flex-wrap gap-3">
                    {uniqueSizes.map((size) => {
                      const quantity = getStockQuantity(size);
                      return (
                        <div key={size} className="flex flex-col items-center">
                          <button
                            onClick={() => quantity > 0 && setSelectedSize(size)}
                            className={`text-[2.5vw] lg:text-[0.7vw] 
                              ${selectedSize === size 
                                ? 'bg-black text-white' 
                                : quantity > 0 
                                  ? 'bg-white text-black hover:bg-gray-100'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                            disabled={quantity === 0}
                          >
                            {size}
                          </button>
                          <span className={`text-[0.6vw] 
                            ${quantity === 0 ? 'text-red-500' : 'text-gray-600'}`}>
                            {/* {quantity === 0 ? 'Out of Stock' : `${quantity} available`} */}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-8 mt-4">
                <h2 className="text-[3vw] lg:text-[0.8vw] font-bold">Colors</h2>
                <div className="flex flex-wrap gap-4">
                  {allColors.map((color) => (
                    <motion.button
                      key={color}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}color
                      onClick={() => setSelectedColor(color)}
                      className="relative group"
                      aria-label={`Select ${color} color`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full transition-all duration-200 
                          ${selectedColor === color 
                            ? 'ring-2 ring-blue-600 ring-offset-2' 
                            : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1'}`}
                        style={{
                          backgroundColor: color.toLowerCase(),
                          border: color.toLowerCase() === 'white' ? '1px solid #e5e7eb' : 'none'
                        }}
                      />
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 
                                    opacity-0 group-hover:opacity-100 transition-opacity
                                    text-[1.5vw] lg:text-[0.65vw] text-gray-600 whitespace-nowrap">
                        {color}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </section>

            <div className="space-y-4 mt-4">
              <button
                onClick={handleOrder}
                disabled={!selectedSize || !selectedColor || getStockQuantity(selectedSize) === 0}
                className={`w-full py-2 px-9 text-[3vw] lg:text-[0.9vw] font-semibold border-[1px] border-black
                  flex items-center justify-center gap-2
                  ${selectedSize && selectedColor && getStockQuantity(selectedSize) > 0
                    ? 'bg-black text-white hover:bg-gray-800' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'}`}
              >
                <ShoppingCartIcon size={20} />
                {!selectedSize 
                  ? 'Add to cart' 
                  : !selectedColor 
                    ? 'Add to cart'
                    : getStockQuantity(selectedSize) === 0
                      ? 'Add to cart'
                      : 'Add to cart'}
              </button>
              {
  userRole === 'admin' && (
    <>
      <Link href={`/update-product/${product._id}`}>
        Update product
      </Link>
  
                <div className="flex justify-end p-4">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent navigating to product page when clicking delete
                      deleteProduct(product._id);
                    }}
                  >
                    Delete product
                  </button>
                </div>
           
    </>
  )
}

            </div>

            {product.care && (
              <div className="space-y-4 mt-4 pt-4 border-t" onClick={() => setShowCareerModal(!showCareerModal)}>
                <div className="flex items-center justify-between">
                  <h2 className="text-[3vw] lg:text-[0.8vw] font-semibold">Care Instructions</h2>
                  <button 
                    className="text-black-600 hover:text-black-700 font-bold transition-colors"
                    aria-label="Show more care instructions"
                  >
                    {showCareerModal ? '-' : '+'}
                  </button>
                </div>
                {showCareerModal && (
                  <motion.p   
                    initial={{
                      opacity: 0,
                      rotateX: 15,
                      scale: 0.95,
                      perspective: 1000
                    }}
                    animate={{
                      opacity: 1,
                      rotateX: 0,
                      scale: 1
                    }}
                    transition={{
                      duration: 0.8,
                      ease: [0.645, 0.045, 0.355, 1],
                      staggerChildren: 0.1
                    }}   
                    className="text-[3vw] lg:text-[0.7vw] text-gray-600 bg-gray-50 p-4 rounded-xl"
                  >
                    {product.care}
                  </motion.p>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
      <h1 className='w-full max-auto text-[5vw] lg:text-[1.5vw] font-bold text-center mt-[5vw]'>Similar Products</h1>
      <div className="grid grid-cols-2 mt-[5vw] md:grid-cols-4 gap-1 p-[1vw]">
        <Products data={data} />
      </div>
    </>
  );
};

export default ProductPage;