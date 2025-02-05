// components/FormField.js
const FormField = ({ field, formData, handleInputChange }) => {
    const { name, label, type, required } = field;
  
    return (
      <div className="space-y-4">
        <label className="block text-sm font-medium mb-1">
          {label} {required && '*'}
        </label>
        {type === 'textarea' ? (
          <textarea
            name={name}
            value={formData[name] || ''}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            required={required}
            rows={4}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name] || ''}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            required={required}
          />
        )}
      </div>
    );
  };
  
  export default FormField;
  

