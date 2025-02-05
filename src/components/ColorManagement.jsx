const ColorManagement = ({ colors, colorInput, setColorInput, handleAddColor, removeColor }) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Color Management</h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              className="flex-1 p-2 border rounded-md"
              placeholder="Enter color name"
            />
            <button
              type="button"
              onClick={handleAddColor}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add Color
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((color, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                <span>{color}</span>
                <button
                  type="button"
                  onClick={() => removeColor(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default ColorManagement;