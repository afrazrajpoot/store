import { useState } from 'react';

export const useColorManagement = () => {
  const [colors, setColors] = useState(['']);
  const [colorInput, setColorInput] = useState('');

  const handleAddColor = () => {
    if (colorInput && !colors.includes(colorInput)) {
      const updatedColors = [...colors, colorInput];
      setColors(updatedColors);
      setColorInput('');
    }
  };

  const removeColor = (index) => {
    const updatedColors = colors.filter((_, i) => i !== index);
    setColors(updatedColors.length ? updatedColors : ['']);
  };

  return {
    colors,
    colorInput,
    setColorInput,
    handleAddColor,
    removeColor
  };
};