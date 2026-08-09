import { useState } from "react";
import { Box, Container, Grid, Text } from "@chakra-ui/react";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import FilterAndSortDrawer from "../components/FilterAndSortDrawer";
import { useQuery } from "react-query";
import { getProductList } from "../services/apiProduct";
import Pagination from "../components/Pagination";
import useProductFilterAndSort from "../hooks/useProductFilterAndSort";

const DiscountedProducts = () => {
  const { isLoading, data } = useQuery("products", getProductList);

  const { filteredProducts, ...filterAndSortProps } = useProductFilterAndSort(
    data?.data.products || []
  );

  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) {
    return (
      <Grid
        m={"30"}
        templateColumns={"repeat(auto-fill, minmax(300px, 1fr))"}
        gap={"6"}
      >
        {Array.from({ length: 20 }, (_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </Grid>
    );
  }

  const discountedProducts = filteredProducts.filter(
    (product) => product.discountPercentage > 0
  );

  const itemsPerPage = 6;
  const totalPages = Math.ceil(discountedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    <>
      <Container maxW="6xl">
        <Box>
          <FilterAndSortDrawer data={data.data} {...filterAndSortProps} />
        </Box>
        {discountedProducts.length === 0 ? (
          <Text
            textAlign={"center"}
            fontWeight={"bolder"}
            fontSize={"xx-large"}
          >
            لا يوجد منتجات
          </Text>
        ) : (
          <>
            <Grid
              templateColumns={"repeat(auto-fill, minmax(300px, 1fr))"}
              gap={"5"}
              my="20px"
            >
              {discountedProducts.slice(startIndex, endIndex).map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </Grid>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </Container>
    </>
  );
};

export default DiscountedProducts;
