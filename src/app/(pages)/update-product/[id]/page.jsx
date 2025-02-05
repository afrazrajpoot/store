'use client'
import React, { useState, useEffect } from 'react';
import { useUpdateProductMutation, useGetProductByIdQuery } from "@/store/storeApi";
import { useGlobalContext } from '@/app/context/GlobalState';
import { formFields } from '@/data';
import { PlusCircle, X, Upload } from 'lucide-react';
import { useParams } from 'next/navigation';

const UpdateProductForm = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const { data: product, isLoading: isProductLoading, isError: isProductError } = useGetProductByIdQuery(id);
  const [updateProduct, { isLoading, isError, error }] = useUpdateProductMutation();
  const { stocks, setStocks } = useGlobalContext();
  const [colors, setColors] = useState(['']);
  const [colorInput, setColorInput] = useState('');

  const initialFormState = {
    name: "",
    price: "",
    image: null,
    hoverImages: [],
    label: "",
    description: "",
    category: "",
    colors: [],
    sizes: [],
    material: "",
    features: [],
    care: "",
    rating: "",
    reviews: "",
    specifications: {
      fit: "",
      gender: ''
    },
    discountPrice: "",
    tags: []
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState(null); // For main image preview
  const [hoverImagesPreview, setHoverImagesPreview] = useState([]); // For hover images preview

  // Fetch product data and set form data
  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        image: null, // Reset image to null to avoid file input issues
        hoverImages: [], // Reset hoverImages to empty array
      });

      // Ensure color is an array in each stock item
      const initialStocks = product.stock || [{ size: 'S', color: [''], quantity: '0' }];
      const formattedStocks = initialStocks.map(stock => ({
        ...stock,
        color: Array.isArray(stock.color) ? stock.color : [stock.color || '']
      }));

      setStocks(formattedStocks);
      setColors(product.colors || ['']);

      // Set image previews
      if (product.image) {
        setImagePreview(product.image); // Assuming product.image is a URL
      }
      if (product.hoverImages && product.hoverImages.length > 0) {
        setHoverImagesPreview(product.hoverImages); // Assuming product.hoverImages is an array of URLs
      }
    }
  }, [product]);

  // Handle input changes for text, number, and textarea fields
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    // Handle specifications fields
    if (name.startsWith('specifications.')) {
      const [_, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [field]: value
        }
      }));
      return;
    }

    // Handle number inputs
    if (type === 'number') {
      const numberValue = value === '' ? '' : Number(value);
      setFormData(prev => ({ ...prev, [name]: numberValue }));
      return;
    }

    // Handle regular inputs
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file input change for main image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file)); // Create a preview URL for the uploaded file
    }
  };

  // Handle file input change for hover images
  const handleHoverImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, hoverImages: files }));
      const previews = files.map(file => URL.createObjectURL(file));
      setHoverImagesPreview(previews);
    }
  };

  // Stock Management Functions
  const handleStockChange = (index, field, value) => {
    const updatedStocks = [...stocks];

    // If the field is color, convert comma-separated string to array
    if (field === 'color') {
      const colorArray = value
        .split(',')
        .map(color => color.trim())
        .filter(color => color !== '');

      updatedStocks[index] = {
        ...updatedStocks[index],
        [field]: colorArray // Store as array
      };
    } else {
      // Handle other fields normally
      updatedStocks[index] = {
        ...updatedStocks[index],
        [field]: value
      };
    }

    setStocks(updatedStocks);
  };

  const addStock = () => {
    setStocks([...stocks, { size: '', color: [''], quantity: '0' }]);
  };

  const removeStock = (index) => {
    if (stocks.length > 1) {
      const updatedStocks = stocks.filter((_, i) => i !== index);
      setStocks(updatedStocks);
    }
  };

  // Color Management Functions
  const handleAddColor = () => {
    if (colorInput && !colors.includes(colorInput)) {
      const updatedColors = [...colors, colorInput];
      setColors(updatedColors);
      setColorInput('');
      setFormData(prev => ({ ...prev, colors: updatedColors }));
    }
  };

  const removeColor = (index) => {
    const updatedColors = colors.filter((_, i) => i !== index);
    setColors(updatedColors.length ? updatedColors : ['']);
    setFormData(prev => ({ ...prev, colors: updatedColors }));
  };

  // Validate form before submission
  const validateForm = () => {
    const requiredFields = ['name', 'price', 'category'];
    const errors = [];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors.push(`${field} is required`);
      }
    });

    if (!formData.image && !product?.image) {
      errors.push('Main image is required');
    }

    if (!stocks || stocks.length === 0 || !stocks.some(stock => stock?.size && stock?.quantity && stock?.color)) {
      errors.push('At least one valid stock item with size, quantity, and color is required');
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
        alert('Please fix the following errors:\n' + validationErrors.join('\n'));
        return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('id', id);

    // Handle regular fields and nested objects
    Object.entries(formData).forEach(([key, value]) => {
        // Skip the stock field since we'll handle it separately
        if (key === 'stock') return;

        if (key === "hoverImages") {
            Array.from(value).forEach(file => {
                formDataToSend.append("hoverImages", file);
            });
        } else if (key === "image") {
            if (value) {
                formDataToSend.append("image", value);
            }
        } else if (key === "specifications") {
            formDataToSend.append(key, JSON.stringify(value));
        } else if (Array.isArray(value)) {
            formDataToSend.append(key, JSON.stringify(value));
        } else {
            formDataToSend.append(key, value?.toString() || '');
        }
    });

    // Handle stocks with color
    const validStocks = stocks
        .filter(stock => stock && typeof stock === 'object' && stock.size && stock.quantity && stock.color)
        .map(stock => ({
            size: stock.size,
            quantity: Number(stock.quantity),
            color: stock.color // Include color
        }));
    formDataToSend.append("stock", JSON.stringify(validStocks));

    try {
        await updateProduct(formDataToSend).unwrap();
        alert("Product updated successfully!");

        // Reset form and stocks
        setFormData(initialFormState);
        setStocks([{ size: 'S', color: [''], quantity: '0' }]);
        setColors(['']);
        setColorInput('');

        // Reset file inputs
        document.querySelectorAll('input[type="file"]').forEach(input => {
            input.value = '';
        });
    } catch (err) {
        console.error("Error updating product:", err);
        alert("Failed to update product: " + (err.data?.message || err.message || 'Unknown error occurred'));
    }
};

  if (isProductLoading) return <div>Loading...</div>;
  if (isProductError) return <div>Error loading product data</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
          <h2 className="text-3xl font-bold text-white">Update Product</h2>
          <p className="text-blue-100 mt-2">Update the details of the product</p>
        </div>

        <div className="p-8">
          {/* Main Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">Basic Information</h3>
              {formFields.map((field, index) => (
                <div key={index} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      value={field.name.includes('.') ? formData.specifications[field.name.split('.')[1]] : formData[field.name] || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required={field.required}
                      rows={4}
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={field.name.includes('.') ? formData.specifications[field.name.split('.')[1]] : formData[field.name] || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Media Upload Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">Media</h3>

              {/* Main Image Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <label className="block mt-2">
                  <span className="text-sm font-medium text-gray-700">Main Image</span>
                  <input
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    className="block w-full mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept="image/*"
                  />
                </label>
                {imagePreview && (
                  <div className="mt-4">
                    <img src={imagePreview} alt="Main Image Preview" className="w-32 h-32 object-cover rounded-lg" />
                  </div>
                )}
              </div>

              {/* Hover Images Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <label className="block mt-2">
                  <span className="text-sm font-medium text-gray-700">Hover Images</span>
                  <input
                    type="file"
                    name="hoverImages"
                    onChange={handleHoverImagesChange}
                    className="block w-full mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept="image/*"
                    multiple
                  />
                </label>
                {hoverImagesPreview.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {hoverImagesPreview.map((preview, index) => (
                      <img key={index} src={preview} alt={`Hover Image Preview ${index + 1}`} className="w-16 h-16 object-cover rounded-lg" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stock Management */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Stock Management</h3>
            <div className="space-y-4">
              {stocks.map((stock, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg relative group">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">Size</label>
                      <select
                        value={stock.size}
                        onChange={(e) => handleStockChange(index, 'size', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Size</option>
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">Quantity</label>
                      <input
                        type="number"
                        value={stock?.quantity}
                        onChange={(e) => handleStockChange(index, 'quantity', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">Colors</label>
                      <input
                        type="text"
                        value={stock?.color?.join(', ') || ''}
                        onChange={(e) => handleStockChange(index, 'color', e.target.value)}
                        placeholder="Red, Blue, Green"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {stocks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStock(index)}
                      className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addStock}
                className="flex items-center justify-center w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add Size/Stock
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-12">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Updating Product..." : "Update Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateProductForm;