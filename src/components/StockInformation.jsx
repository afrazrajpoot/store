import { useGlobalContext } from "../app/context/GlobalState";
import React, { useEffect } from "react";

const StockInformation = () => {
  const { stocks, setStocks } = useGlobalContext();

  // Initialize stocks properly when component mounts
  useEffect(() => {
    if (!stocks || stocks.length === 0) {
      setStocks([{ size: "", quantity: "" }]);
    }
  }, [stocks, setStocks]);

  const handleInputChange = (index, field, value) => {
    const updatedStocks = [...stocks];
    updatedStocks[index] = {
      ...updatedStocks[index],
      [field]: value,
    };
    setStocks(updatedStocks);
  };

  const addStock = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setStocks([...stocks, { size: "", quantity: "" }]);
  };

  const removeStock = (index, e) => {
    e.stopPropagation();
    e.preventDefault();
    const updatedStocks = stocks.filter((_, i) => i !== index);
    if (updatedStocks.length === 0) {
      setStocks([{ size: "", quantity: "" }]);
    } else {
      setStocks(updatedStocks);
    }
  };

  if (!stocks) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Stock Information</h3>

      <div className="space-y-4">
        {stocks.map((stock, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3 relative"
          >
            <button
              type="button"
              onClick={(e) => removeStock(index, e)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              ×
            </button>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Size
              </label>
              <input
                type="text"
                value={stock.size || ""}
                onChange={(e) =>
                  handleInputChange(index, "size", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Enter size"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                value={stock.quantity || ""}
                onChange={(e) =>
                  handleInputChange(index, "quantity", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Enter quantity"
                min="0"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addStock}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        + Add Stock
      </button>
    </div>
  );
};

export default StockInformation;
