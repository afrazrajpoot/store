"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import { useRouter } from "next/navigation";

const HeroImageUpload = () => {
  const [images, setImages] = useState([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const handleFileChange = (e) => {
    const files = [...e.target.files].filter((file) =>
      file.type.startsWith("image/")
    );

    // Only store the files, don't upload yet
    setImages((prev) => [...prev, ...files].slice(0, 3));
    setError(null);
    setSuccess(false); // Reset success state when new files are added
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setError(null);
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (images.length === 0) {
      setError("Please select at least one image");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Create FormData and append images with specific keys
      const formData = new FormData();
      images.forEach((image, index) => {
        // Use specific keys for each image position
        formData.append(`image${index + 1}`, image);
      });

      const response = await fetch("/api/uploadHeroImages", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setSuccess(true);
      setError(null);
      // Optionally clear images after successful upload
      setImages([]);
    } catch (err) {
      setError(err.message || "Error uploading images");
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.user?.role != "admin") {
      router.push("/");
    }
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Upload Hero Images
          </h2>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                disabled={images.length >= 3}
              />

              <label
                htmlFor="file-upload"
                className={`flex flex-col items-center justify-center cursor-pointer ${
                  images.length >= 3 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <motion.div
                  whileHover={{ scale: images.length >= 3 ? 1 : 1.05 }}
                  whileTap={{ scale: images.length >= 3 ? 1 : 0.95 }}
                  className="p-4 rounded-full bg-blue-50 mb-4"
                >
                  <Upload className="w-8 h-8 text-blue-500" />
                </motion.div>
                <p className="text-lg font-medium text-gray-700">
                  {images.length >= 3
                    ? "Maximum 3 images selected"
                    : "Click to select hero images"}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {`${3 - images.length} slots remaining`}
                </p>
              </label>
            </div>

            {/* Image Preview Grid */}
            <div className="grid grid-cols-3 gap-4">
              <AnimatePresence>
                {images.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative aspect-video rounded-lg overflow-hidden group"
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Hero Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </motion.button>
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                      Image {index + 1}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Status Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center space-x-2 p-4 bg-red-50 rounded-lg"
                >
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700">{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center space-x-2 p-4 bg-green-50 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-700">
                    Hero images uploaded successfully!
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Upload Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpload}
              disabled={isLoading || images.length === 0}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white 
                ${
                  isLoading || images.length === 0
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }
                transition-colors duration-200 flex items-center justify-center space-x-2`}
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Upload Hero Images</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroImageUpload;
