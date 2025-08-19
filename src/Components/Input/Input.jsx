import React from 'react';

function Input({
    type = "text",
    label,
    placeholder,
    value,
    onChange,
    className = "",
    options = [],
    listId,
    ...props
}) {
    return (
        <div className="mb-4">
            {label && (
                <label className="block mb-2 font-medium text-gray-700">
                    {label}
                </label>
            )}

            {type === "select" ? (
                <select
                    value={value}
                    onChange={onChange}
                    className={`border-2 p-2 rounded ${className}`}
                    {...props}
                >
                    <option value="">{placeholder || "Select an option"}</option>
                    {options.map((opt, index) => (
                        <option key={index} value={opt}>{opt}</option>
                    ))}
                </select>
            ) : type === "datalist" ? (
                <>
                    <input
                        list={listId}
                        onChange={onChange}
                        value={value}
                        placeholder={placeholder}
                        className={`border-2 p-2 rounded ${className}`}
                        {...props}
                    />
                    <datalist id={listId}>
                        {options.map((opt, index) => (
                            <option key={index} value={opt} />
                        ))}
                    </datalist>
                </>
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`border-2 p-2 rounded ${className}`}
                    {...props}
                />
            )}
        </div>
    );
}

export default Input;
