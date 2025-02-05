import { useState } from 'react';

export const useStockManagement = () => {
  const [stocks, setStocks] = useState([{ size: 'S', color: '', quantity: '0' }]);

  const handleStockChange = (index, field, value) => {
    const updatedStocks = [...stocks];
    if (field === 'color') {
      const colorArray = value.split(',').map(color => color.trim()).filter(color => color !== '');
      updatedStocks[index] = { ...updatedStocks[index], [field]: colorArray };
    } else {
      updatedStocks[index] = { ...updatedStocks[index], [field]: value };
    }
    setStocks(updatedStocks);
  };

  const addStock = () => {
    setStocks([...stocks, { size: '', color: '', quantity: '0' }]);
  };

  const removeStock = (index) => {
    if (stocks.length > 1) {
      const updatedStocks = stocks.filter((_, i) => i !== index);
      setStocks(updatedStocks);
    }
  };

  return {
    stocks,
    handleStockChange,
    addStock,
    removeStock
  };
};