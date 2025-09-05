import React from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

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
            {["Product", "Brand", "Price", "Stock", "Rating", "Actions"].map(header => (
              <th key={header} className="p-3 font-semibold text-gray-700">
                {header}
              </th>
            ))}
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

const TableRow = React.memo(({ product, onView, onEdit, onDelete }) => (
  <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
    <td className="p-3">
      <div className="flex items-center">
        <img 
          src={product.mainImage} 
          alt={product.name} 
          className="w-12 h-12 object-cover rounded mr-3"
        />
        <div>
          <p className="font-medium text-gray-800">{product.name}</p>
          <p className="text-sm text-gray-500">ID: {product.id}</p>
        </div>
      </div>
    </td>
    <td className="p-3">{product.brand}</td>
    <td className="p-3 font-medium">${product.price}</td>
    <td className="p-3">
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}>
        {product.inStock ? "In Stock" : "Out of Stock"}
      </span>
    </td>
    <td className="p-3">
      <div className="flex items-center">
        <span className="text-yellow-500">★</span>
        <span className="ml-1">{product.rating}</span>
        <span className="text-gray-500 text-sm ml-1">({product.reviews})</span>
      </div>
    </td>
    <td className="p-3">
      <div className="flex gap-2">
        <ActionButton icon={FaEye} color="blue" onClick={() => onView(product)} title="View details" />
        <ActionButton icon={FaEdit} color="green" onClick={() => onEdit(product)} title="Edit product" />
        <ActionButton icon={FaTrash} color="red" onClick={() => onDelete(product.id, product.name)} title="Delete product" />
      </div>
    </td>
  </tr>
));

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