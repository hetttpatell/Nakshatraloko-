import React from 'react';

function Input({
    type = "text",
    label,
    placeholder,
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
                placeholder={`${placeholder}`}
                value={value}
                onChange={onChange}
                className={`border-2 p-2 rounded  ${className}`}
                {...props}   // now placeholder works fine
            />

        </div>
    );
}

export default Input;
