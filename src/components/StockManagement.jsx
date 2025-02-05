
const StockManagement = ({ stocks, handleStockChange, addStock, removeStock }) => {
    return (
      <div className="bg-white p-4 w-full rounded-lg shadow-sm mt-[15vw]">
        <h3 className="text-lg font-semibold mb-4">Stock Management</h3>
        <div className="space-y-4">
          {stocks.map((stock, index) => (
            <div key={index} className="flex gap-4 items-end border p-4 rounded-md relative">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Size</label>
                <select
                  value={stock.size}
                  onChange={(e) => handleStockChange(index, 'size', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Size</option>
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  value={stock.quantity}
                  onChange={(e) => handleStockChange(index, 'quantity', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  min="0"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Colors</label>
                <input
                  type="text"
                  onChange={(e) => handleStockChange(index, 'color', e.target.value)}
                  placeholder="Enter colors separated by commas (e.g. Red, Blue, Green)"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              {stocks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStock(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addStock}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Size/Stock
        </button>
      </div>
    );
  };
  
  export default StockManagement;