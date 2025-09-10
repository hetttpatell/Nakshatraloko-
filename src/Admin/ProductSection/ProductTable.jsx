import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";

const ProductTable = ({ products, onView, onEdit, onDelete }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No products found matching your criteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50">
            {["Product",  "Price", "Stock", "Status", "Actions"].map(
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
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              product.stock > 0
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.stock} in stock
          </span>
        </td>

        {/* Status */}
        <td className="p-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              product.isActive
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
              onClick={() => onEdit(product)}
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
