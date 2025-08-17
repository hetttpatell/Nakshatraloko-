import React from 'react';

function Input({ 
  type = "text", 
  label, 
  value, 
  onChange, 
  className = "", 
  ...props 
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-2 font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`border p-2 rounded w-full ${className}`}
        {...props}
      />
    </div>
  );
}

export default Input;
