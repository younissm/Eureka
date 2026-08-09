import { useState } from "react";

const useProductFilterAndSort = (products) => {
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [priceFilters, setPriceFilters] = useState([]);
  const [categoryFilters, setCategoryFilters] = useState([]);

  let filteredProducts = products;

  const filterAndSortProducts = () => {
    // Filter by price
    if (priceFilters.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        if (product.discountPercentage > 0) {
          const price =
            product.price - product.price * (product.discountPercentage / 100);
          return priceFilters.some((range) => {
            const [min, max] = range.split("-");
            if (max) {
              return price >= parseInt(min) && price <= parseInt(max);
            } else {
              return price >= parseInt(min);
            }
          });
        } else {
          const price = product.price;
          return priceFilters.some((range) => {
            const [min, max] = range.split("-");
            if (max) {
              return price >= parseInt(min) && price <= parseInt(max);
            } else {
              return price >= parseInt(min);
            }
          });
        }
      });
    }

    // Filter by category
    if (categoryFilters.length > 0) {
      const uniqueCategoryFilters = new Set(categoryFilters);
      filteredProducts = filteredProducts.filter((product) =>
        uniqueCategoryFilters.has(product.category.title)
      );
    }
    // Sort products
    filteredProducts.sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === "price") {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
      }
      return 0;
    });

    return filteredProducts;
  };

  return {
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    priceFilters,
    setPriceFilters,
    categoryFilters,
    setCategoryFilters,
    filteredProducts: filterAndSortProducts(),
  };
};

export default useProductFilterAndSort;
