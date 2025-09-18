import axios from "axios";
import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";

import { ToastContainer } from "react-toastify";

const ProductTable = ({ products, onView, onEdit, onDelete }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No products found matching your criteria.
      </div>
    );
  }
  // const handleEdit = async (product) => {
  //   try {
  //     const response = await axios.get(`http://localhost:8001/api/getProductById/${product.id}`);
  //     if (response.data.success) {
  //       setSelectedProduct(response.data.data);
  //       setIsModalOpen(true);
  //     }
  //   } catch (err) {
  //     console.error("Failed to fetch product:", err);
  //   }
  // };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50">
            {["Product", "Price", "Stock", , "Featured", "Status", "Actions"].map(
              (header) => (
                <th key={header} className="p-3 font-semibold text-gray-700">
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <TableRow
              key={product.id}
              product={product}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TableRow = React.memo(({ product, onView, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [isFeatured, setIsFeatured] = useState(product.isFeatured || false);

  const handleToggle = async () => {
    const newValue = !isFeatured;
    setIsFeatured(newValue); // immediate feedback

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `http://localhost:8001/api/toggleFeaturedProduct/${product.id}/feature`,
        {},
        { headers: { Authorization: `${token}` } }
      );
      if (!response.data.success) setIsFeatured(!newValue); // rollback
    } catch (err) {
      setIsFeatured(!newValue); // rollback
    }
  };
  return (
    <>
      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
        {/* Product */}
        <td className="p-3">
          <div>
            <p className="font-medium text-gray-800">{product.name}</p>
            <p className="text-sm text-gray-500">ID: {product.id}</p>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-blue-500 mt-1 flex items-center"
            >
              {expanded ? (
                <>
                  <FaChevronUp className="mr-1" /> Less details
                </>
              ) : (
                <>
                  <FaChevronDown className="mr-1" /> More details
                </>
              )}
            </button>
          </div>
        </td>

        {/* Category */}
        {/* <td className="p-3">{product.categoryId}</td> */}

        {/* Price */}
        <td className="p-3 font-medium">
          {product.dummyPrice ? (
            <>
              <span className="line-through mr-2">₹{product.dummyPrice}</span>
              <span className="text-green-600">₹{product.price}</span>
            </> 
          ) : (
            `₹${product.price}`
          )}
        </td>

        {/* Stock */}
        <td className="p-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 0
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
              }`}
          >
            {product.stock} in stock
          </span>
        </td>

        {/* Featured Toggle */}
        <td className="p-3">
          <label className="inline-flex relative items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isFeatured}
              onChange={handleToggle}
            // disabled={loading} // prevent spamming
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 relative 
                          after:content-[''] after:absolute after:top-0.5 after:left-0.5
                          after:bg-white after:border-gray-300 after:border after:rounded-full 
                          after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full">
            </div>
          </label>
        </td>




        {/* Status */}
        <td className="p-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${product.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
              }`}
          >
            {product.isActive ? "Active" : "Inactive"}
          </span>
        </td>

        {/* Actions */}
        <td className="p-3">
          <div className="flex gap-2">
            <ActionButton
              icon={FaEye}
              color="blue"
              onClick={() => onView(product)}
              title="View details"
            />
            <ActionButton
              icon={FaEdit}
              color="green"
              onClick={() => onEdit(product.id)}
              title="Edit product"
            />

            <ActionButton
              icon={FaTrash}
              color="red"
              onClick={() => onDelete(product.id, product.name)}
              title="Delete product"
            />
          </div>
        </td>
      </tr>

      {/* Expanded Row for More Details */}
      {expanded && (
        <tr className="bg-gray-50">
          <td colSpan="6" className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-gray-700">{product.description}</p>

                <h4 className="font-semibold mt-4 mb-2">Advantages</h4>
                <p className="text-sm text-gray-700">{product.advantages}</p>

                <h4 className="font-semibold mt-4 mb-2">How to Wear</h4>
                <p className="text-sm text-gray-700">{product.howToWear}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
});

const ActionButton = ({ icon: Icon, color, onClick, title }) => (
  <button
    className={`p-2 text-${color}-500 hover:bg-${color}-50 rounded transition-colors`}
    onClick={onClick}
    title={title}
  >
    <Icon />
  </button>
);

export default ProductTable;