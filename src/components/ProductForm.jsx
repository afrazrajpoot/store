"use client";
import React, { useState, useEffect } from "react";
import { useAddProductMutation } from "@/store/storeApi";
import { useGlobalContext } from "@/app/context/GlobalState";
import { formFields } from "@/data";
import { PlusCircle, X, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

const ProductForm = () => {
  const [addProduct, { isLoading, isError, error }] = useAddProductMutation();
  const { stocks, setStocks } = useGlobalContext();
  const [colors, setColors] = useState([""]);
  const [colorInput, setColorInput] = useState("");

  // New state for image previews
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [hoverImagesPreview, setHoverImagesPreview] = useState([]);

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
      gender: "",
    },
    discountPrice: "",
    tags: [],
  };

  const [formData, setFormData] = useState(initialFormState);
  const router = useRouter();

  // Initialize stocks if empty
  useEffect(() => {
    if (!stocks || stocks.length === 0) {
      setStocks([{ size: "S", color: "", quantity: "0" }]);
    }
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.user?.role != "admin") {
      router.push("/");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    // Handle specifications fields
    if (name.startsWith("specifications.")) {
      const [_, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [field]: value,
        },
      }));
      return;
    }

    // Handle number inputs
    if (type === "number") {
      const numberValue = value === "" ? "" : Number(value);
      setFormData((prev) => ({ ...prev, [name]: numberValue }));
      return;
    }

    // Handle regular inputs
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayInput = (e, field) => {
    const values = e.target.value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    setFormData((prev) => ({ ...prev, [field]: values }));
  };

  // Update image preview handling
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;

    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));

      // Create preview for main image
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (name === "hoverImages") {
      const filesArray = Array.from(files);
      setFormData((prev) => ({ ...prev, hoverImages: filesArray }));

      // Create previews for hover images
      const previews = [];
      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result);
          if (previews.length === filesArray.length) {
            setHoverImagesPreview(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Image preview removal functions
  const removeMainImagePreview = () => {
    setMainImagePreview(null);
    setFormData((prev) => ({ ...prev, image: null }));
    // Reset file input
    const input = document.querySelector('input[name="image"]');
    if (input) input.value = "";
  };

  const removeHoverImagePreview = (indexToRemove) => {
    const updatedPreviews = hoverImagesPreview.filter(
      (_, index) => index !== indexToRemove
    );
    const updatedHoverImages = formData.hoverImages.filter(
      (_, index) => index !== indexToRemove
    );

    setHoverImagesPreview(updatedPreviews);
    setFormData((prev) => ({ ...prev, hoverImages: updatedHoverImages }));
  };

  // Stock Management Functions
  const handleStockChange = (index, field, value) => {
    const updatedStocks = [...stocks];

    // If the field is color, convert comma-separated string to array
    if (field === "color") {
      const colorArray = value
        .split(",")
        .map((color) => color.trim())
        .filter((color) => color !== "");

      updatedStocks[index] = {
        ...updatedStocks[index],
        [field]: colorArray, // Store as array
      };
    } else {
      // Handle other fields normally
      updatedStocks[index] = {
        ...updatedStocks[index],
        [field]: value,
      };
    }

    setStocks(updatedStocks);
  };

  const addStock = () => {
    setStocks([...stocks, { size: "", color: "", quantity: "0" }]);
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
      setColorInput("");
      setFormData((prev) => ({ ...prev, colors: updatedColors }));
    }
  };

  const removeColor = (index) => {
    const updatedColors = colors.filter((_, i) => i !== index);
    setColors(updatedColors.length ? updatedColors : [""]);
    setFormData((prev) => ({ ...prev, colors: updatedColors }));
  };

  const validateForm = () => {
    const requiredFields = ["name", "price", "category"];
    const errors = [];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors.push(`${field} is required`);
      }
    });

    if (!formData.image) {
      errors.push("Main image is required");
    }

    if (
      !stocks ||
      stocks.length === 0 ||
      !stocks.some((stock) => stock?.size && stock?.quantity && stock?.color)
    ) {
      errors.push(
        "At least one valid stock item with size, quantity, and color is required"
      );
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      alert("Please fix the following errors:\n" + validationErrors.join("\n"));
      return;
    }

    const formDataToSend = new FormData();

    // Handle regular fields and nested objects
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "hoverImages") {
        Array.from(value).forEach((file) => {
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
        formDataToSend.append(key, value?.toString() || "");
      }
    });

    // Handle stocks with color
    const validStocks = stocks
      .filter(
        (stock) =>
          stock &&
          typeof stock === "object" &&
          stock.size &&
          stock.quantity &&
          stock.color
      )
      .map((stock) => ({
        size: stock.size,
        quantity: Number(stock.quantity),
        color: stock.color, // Include color
      }));
    formDataToSend.append("stock", JSON.stringify(validStocks));

    try {
      await addProduct(formDataToSend).unwrap();
      alert("Product added successfully!");

      // Reset form and stocks
      setFormData(initialFormState);
      setStocks([{ size: "S", color: "", quantity: "0" }]);
      setColors([""]);
      setColorInput("");
      setMainImagePreview(null);
      setHoverImagesPreview([]);

      // Reset file inputs
      document.querySelectorAll('input[type="file"]').forEach((input) => {
        input.value = "";
      });
    } catch (err) {
      console.error("Error adding product:", err);
      alert(
        "Failed to add product: " +
          (err.data?.message || err.message || "Unknown error occurred")
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
          <h2 className="text-3xl font-bold text-white">Create New Product</h2>
          <p className="text-blue-100 mt-2">
            Fill in the details to add a new product to your inventory
          </p>
        </div>

        <div className="p-8">
          {/* Main Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Basic Information
              </h3>
              {formFields.map((field, index) => (
                <div key={index} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    {field.label}{" "}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      value={
                        field.name.includes(".")
                          ? formData.specifications[field.name.split(".")[1]]
                          : formData[field.name] || ""
                      }
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required={field.required}
                      rows={4}
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={
                        field.name.includes(".")
                          ? formData.specifications[field.name.split(".")[1]]
                          : formData[field.name] || ""
                      }
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

              <div className="space-y-4">
                {/* Main Image Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  {mainImagePreview ? (
                    <div className="relative">
                      <img
                        src={mainImagePreview}
                        alt="Main Product Preview"
                        className="mx-auto max-h-64 object-contain rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeMainImagePreview}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <label className="block mt-2">
                        <span className="text-sm font-medium text-gray-700">
                          Main Image
                        </span>
                        <input
                          type="file"
                          name="image"
                          onChange={handleFileChange}
                          className="block w-full mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          accept="image/*"
                          required
                        />
                      </label>
                    </>
                  )}
                </div>

                {/* Hover Images Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  {hoverImagesPreview.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4">
                      {hoverImagesPreview.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Hover Image ${index + 1}`}
                            className="mx-auto max-h-32 object-contain rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeHoverImagePreview(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500">
                        <PlusCircle className="h-8 w-8 text-gray-400" />
                        <input
                          type="file"
                          name="hoverImages"
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*"
                          multiple
                        />
                      </label>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <label className="block mt-2">
                        <span className="text-sm font-medium text-gray-700">
                          Hover Images
                        </span>
                        <input
                          type="file"
                          name="hoverImages"
                          onChange={handleFileChange}
                          className="block w-full mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          accept="image/*"
                          multiple
                        />
                      </label>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stock Management */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Stock Management
            </h3>
            <div className="space-y-4">
              {stocks.map((stock, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-lg relative group"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Size
                      </label>
                      <select
                        value={stock.size}
                        onChange={(e) =>
                          handleStockChange(index, "size", e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Size</option>
                        {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={stock.quantity}
                        onChange={(e) =>
                          handleStockChange(index, "quantity", e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Colors
                      </label>
                      <input
                        type="text"
                        onChange={(e) =>
                          handleStockChange(index, "color", e.target.value)
                        }
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

          {/* Color Management */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Color Management
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter color name"
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Add Color
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full group hover:bg-gray-200 transition-colors"
                  >
                    <span className="text-gray-700">{color}</span>
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-12">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Creating Product..." : "Create Product"}
            </button>
          </div>

          {/* Error Message */}
          {isError && error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error?.data?.message ||
                "An error occurred while adding the product"}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
