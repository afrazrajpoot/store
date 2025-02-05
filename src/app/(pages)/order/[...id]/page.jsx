'use client'
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
  Package2, 
  User, 
  Mail, 
  Phone, 
  Home, 
  CreditCard, 
  Calendar,
  Lock,
  ShoppingBag,
  Palette,
  Ruler,
  Hash,
  X
} from 'lucide-react';
import { useCreateOrderMutation, useGetProductByIdQuery } from '@/store/storeApi';
import OrderSuccessPopup from '@/components/OrderSuccessPopup';
import {toast} from 'sonner'
const OrderForm = ({params}) => {
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [createOrder,{isLoading:orderLoading,isError,error:orderError,data,isSuccess:orderSuccess}] = useCreateOrderMutation()
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const { data: product, isLoading, error } = useGetProductByIdQuery(params.id);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  React.useEffect(() => {
    if (product) {
      setValue('productName', product.name);
    }
  }, [product, setValue]);

  const onSubmit = (data) => {
    if(selectedColors.length <=0 || selectedSizes <=0){
      toast.error('Please select colors and sizes',{
        duration: 3000,
        position: 'top-center'
      })
      // alert('Please select colors and sizes')
      return
    }
    createOrder({
      mainImage: product?.image,
      productId: params.id,
      ...data, 
      price:product?.price,
      colors: selectedColors,
      sizes: selectedSizes
    })

  };

  const handleColorSelect = (color) => {
    setSelectedColors(prev => {
      if (prev.includes(color)) {
        return prev.filter(c => c !== color);
      } else {
        return [...prev, color];
      }
    });
  };

  const handleSizeSelect = (size) => {
    setSelectedSizes(prev => {
      if (prev.includes(size)) {
        return prev.filter(s => s !== size);
      } else {
        return [...prev, size];
      }
    });
  };

  const removeColor = (colorToRemove) => {
    setSelectedColors(prev => prev.filter(color => color !== colorToRemove));
  };

  const removeSize = (sizeToRemove) => {
    setSelectedSizes(prev => prev.filter(size => size !== sizeToRemove));
  };

  const formFields = {
    productInfo: [
      { 
        name: 'productName', 
        label: 'Product Name', 
        type: 'text', 
        required: true,
        readOnly: true 
      },
      { 
        name: 'quantity', 
        label: 'Quantity', 
        type: 'number', 
        required: true, 
        min: 1, 
        max: 10 
      }
    ],
    personalInfo: [
      { name: 'fullName', label: 'Full Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'tel', required: true }
    ],
    addressInfo: [
      { name: 'address', label: 'Street Address', type: 'text', required: true },
      { name: 'city', label: 'City', type: 'text', required: true },
      { name: 'postalCode', label: 'Postal Code', type: 'text', required: true },
      { name: 'country', label: 'Country', type: 'text', required: true }
    ],
    paymentInfo: [
      { name: 'cardNumber', label: 'Card Number', type: 'text', required: true },
      { name: 'expiryDate', label: 'Expiry Date', type: 'text', required: true },
      { name: 'cvv', label: 'CVV', type: 'text', required: true }
    ]
  };

  const getIcon = (fieldName) => {
    const icons = {
      productName: <ShoppingBag className="w-5 h-5" />,
      size: <Ruler className="w-5 h-5" />,
      quantity: <Hash className="w-5 h-5" />,
      fullName: <User className="w-5 h-5" />,
      email: <Mail className="w-5 h-5" />,
      phone: <Phone className="w-5 h-5" />,
      address: <Home className="w-5 h-5" />,
      cardNumber: <CreditCard className="w-5 h-5" />,
      expiryDate: <Calendar className="w-5 h-5" />,
      cvv: <Lock className="w-5 h-5" />
    };
    return icons[fieldName];
  };
useEffect(()=>{
  if(orderSuccess){
    setShowSuccessPopup(true);
  }
  if(orderError){
    toast.error('SOmething wrong please try again',{
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
},[orderSuccess])
  const renderField = (field) => {
    const icon = getIcon(field.name);

    return (
      <div key={field.name} className="w-full">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required ? `${field.label} is required` : false }}
            render={({ field: controllerField }) => (
              <input
                {...controllerField}
                type={field.type}
                className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  icon ? 'pl-12' : 'pl-4'
                }`}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                min={field.min}
                max={field.max}
                readOnly={field.readOnly}
              />
            )}
          />
        </div>
        {errors[field.name] && (
          <p className="text-red-500 text-sm mt-1">{errors[field.name].message}</p>
        )}
      </div>
    );
  };

  const renderSizeSelection = () => (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2 text-gray-700">
        Sizes
        <span className="text-red-500 ml-1">*</span>
      </label>
      <div className="flex flex-wrap gap-3">
        {product?.stock?.map((sizeOption) => (
          <button
            key={sizeOption.size}
            type="button"
            onClick={() => handleSizeSelect(sizeOption.size)}
            className={`px-4 py-2 border rounded-lg transition-all duration-200 
              ${selectedSizes.includes(sizeOption.size)
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
              }`}
          >
            {sizeOption.size}
          </button>
        ))}
      </div>
      
      {selectedSizes.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Selected sizes:</p>
          <div className="flex flex-wrap gap-2">
            {selectedSizes.map((size) => (
              <div
                key={size}
                className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
              >
                <span className="text-sm text-gray-700">{size}</span>
                <button
                  type="button"
                  onClick={() => removeSize(size)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedSizes.length === 0 && (
        <p className="text-sm text-gray-500 mt-2">
          Please select at least one size
        </p>
      )}
    </div>
  );

  if (isLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error loading product details</div>;
  }

  return (
    <div className="min-h-screen mx-auto bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6">
    <div className=" mx-auto max-w-[90vw] space-y-6">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Checkout</h1>
        <p className="mt-2 text-gray-600 text-lg">Complete your purchase securely</p>
      </div>
      
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
        {/* Header Banner */}
       
  
        {/* Form Content */}
        <div className="p-8">
          <form className="space-y-8 grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit(onSubmit)}>
            {/* Product Section */}
         <section className=''>
         <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3 pb-4 border-b border-gray-100">
                <ShoppingBag className="w-7 h-7 text-blue-600" />
                Product Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {formFields.productInfo.map(renderField)}
                {renderSizeSelection()}
              </div>
  
              {/* Color Selection */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <label className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-4">
                  <Palette className="w-5 h-5 text-blue-600" />
                  Select Colors
                  <span className="text-red-500 ml-1">*</span>
                </label>
                
                <div className="flex flex-wrap gap-4">
                  {product?.colors?.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      className={`w-14 h-14 rounded-2xl border-2 transform hover:scale-110 transition-all duration-300 ${
                        selectedColors.includes(color)
                          ? 'ring-4 ring-blue-500 ring-offset-4'
                          : color === '#FFFFFF'
                            ? 'border-gray-300'
                            : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
  
                {selectedColors.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Selected colors:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedColors.map((color) => (
                        <div
                          key={color}
                          className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100"
                        >
                          <div
                            className="w-4 h-4 rounded-lg"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-sm text-gray-700 font-medium">{color}</span>
                          <button
                            type="button"
                            onClick={() => removeColor(color)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
  
                {selectedColors.length === 0 && (
                  <p className="text-sm text-gray-500 mt-3 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                    Please select at least one color
                  </p>
                )}
              </div>
            </div>
  
            {/* Personal Information */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3 pb-4 border-b border-gray-100">
                <User className="w-7 h-7 text-blue-600" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {formFields.personalInfo.map(renderField)}
              </div>
            </div>

              {/* Shipping Address */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3 pb-4 border-b border-gray-100">
                <Home className="w-7 h-7 text-blue-600" />
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {formFields.addressInfo.map(renderField)}
              </div>
            </div>
         </section>
  
          
  
          <section>
              {/* Payment Information */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3 pb-4 border-b border-gray-100">
                <CreditCard className="w-7 h-7 text-blue-600" />
                Payment Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {formFields.paymentInfo.map(renderField)}
              </div>
            </div>
  
            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-5 px-8 rounded-2xl text-lg font-bold hover:from-blue-700 hover:via-blue-800 hover:to-indigo-900 transform hover:scale-[1.01] transition-all duration-300 focus:ring-4 focus:ring-blue-500/20 focus:outline-none shadow-xl flex items-center justify-center gap-3 group"
              >
                <ShoppingBag className="w-6 h-6 group-hover:animate-bounce" />
                {orderLoading ? "Processing..." : "Place Order"}
              </button>
              {isError && (
                <p className='mt-4 text-red-500 text-center bg-red-50 py-3 px-4 rounded-xl border border-red-100 animate-pulse'>
                  {orderError?.data?.message}
                </p>
              )}
            </div>
          </section>
          </form>
        </div>
      </div>
    </div>
    <OrderSuccessPopup
      isOpen={showSuccessPopup}
      onClose={() => setShowSuccessPopup(false)}
      customerName={watch('fullName')}
    />
  </div>
  );
};

export default OrderForm;