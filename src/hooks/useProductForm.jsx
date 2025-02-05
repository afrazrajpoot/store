// hooks/useProductForm.js
import { useState } from 'react';

export const useProductForm = () => {
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

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

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

    if (type === 'number') {
      const numberValue = value === '' ? '' : Number(value);
      setFormData(prev => ({ ...prev, [name]: numberValue }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayInput = (e, field) => {
    const values = e.target.value.split(',').map(item => item.trim()).filter(item => item !== '');
    setFormData(prev => ({ ...prev, [field]: values }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;

    if (name === "image") {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else if (name === "hoverImages") {
      setFormData(prev => ({ ...prev, hoverImages: Array.from(files) }));
    }
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleArrayInput,
    handleFileChange
  };
};

// hooks/useStockManagement.js


// hooks/useColorManagement.js
