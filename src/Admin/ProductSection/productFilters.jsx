// utils/productFilters.js
/**
 * Filters products based on search term and various filters
 * @param {Array} products - Array of product objects
 * @param {string} searchTerm - Search term to filter by name, brand, or description
 * @param {string} brandFilter - Brand to filter by (or "all" for no brand filter)
 * @param {string} statusFilter - Status to filter by ("all", "inStock", or "outOfStock")
 * @returns {Array} Filtered array of products
 */
export const filterProducts = (products, searchTerm, brandFilter, statusFilter) => {
  if (!products || !Array.isArray(products)) return [];
  
  return products.filter(product => {
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        (product.name && product.name.toLowerCase().includes(term)) ||
        (product.brand && product.brand.toLowerCase().includes(term)) ||
        (product.description && product.description.toLowerCase().includes(term));
      
      if (!matchesSearch) return false;
    }
    
    // Filter by brand
    if (brandFilter && brandFilter !== "all") {
      if (!product.brand || product.brand !== brandFilter) return false;
    }
    
    // Filter by status
    if (statusFilter && statusFilter !== "all") {
      const inStockFilter = statusFilter === "inStock";
      if (product.inStock !== inStockFilter) return false;
    }
    
    return true;
  });
};

/**
 * Sorts products by various criteria
 * @param {Array} products - Array of product objects
 * @param {string} sortBy - Field to sort by ("name", "brand", "price", "rating")
 * @param {string} sortOrder - Sort order ("asc" or "desc")
 * @returns {Array} Sorted array of products
 */
export const sortProducts = (products, sortBy = "name", sortOrder = "asc") => {
  if (!products || !Array.isArray(products)) return [];
  
  return [...products].sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case "name":
        valueA = a.name || "";
        valueB = b.name || "";
        break;
      case "brand":
        valueA = a.brand || "";
        valueB = b.brand || "";
        break;
      case "price":
        valueA = a.price || 0;
        valueB = b.price || 0;
        break;
      case "rating":
        valueA = a.rating || 0;
        valueB = b.rating || 0;
        break;
      default:
        valueA = a.name || "";
        valueB = b.name || "";
    }
    
    if (typeof valueA === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }
    
    if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
    if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
};

/**
 * Combines filtering and sorting in one function
 * @param {Array} products - Array of product objects
 * @param {Object} filters - Filter criteria
 * @param {Object} sort - Sort criteria
 * @returns {Array} Filtered and sorted array of products
 */
export const processProducts = (products, filters, sort) => {
  const filtered = filterProducts(
    products, 
    filters.searchTerm, 
    filters.brandFilter, 
    filters.statusFilter
  );
  
  return sortProducts(filtered, sort.sortBy, sort.sortOrder);
};