import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import ProductCardSkeleton from "../components/ProductCardSkeleton";

import {
  Stack,
  Text,
  Heading,
  Grid,
  Box,
  Container,
  // useColorMode,
} from "@chakra-ui/react";
import { getCategoryProduct } from "../services/apiProduct";
import FilterAndSortDrawer from "../components/FilterAndSortDrawer";
import useProductFilterAndSort from "../hooks/useProductFilterAndSort";
import ProductCard from "../components/ProductCard";

function ProductDetailsPage() {
  const { category } = useParams();

  const { isLoading, data } = useQuery(["products", category], () =>
    getCategoryProduct(category)
  );

  const { filteredProducts, ...filterAndSortProps } = useProductFilterAndSort(
    data?.data.products || []
  );

  if (isLoading) return <ProductCardSkeleton />;

  return (
    <>
      <Container maxW="6xl" my="20px">
        <Stack
          justifyContent="space-between"
          alignItems="center"
          flexDirection="row"
          my="40px"
        >
          <Heading
            fontSize={{ base: "large", lg: "xx-large" }}
            position="relative"
            display="inline-block"
          >
            {category}
            <Box
              position="absolute"
              bottom="-10px"
              left="50%"
              transform="translateX(-50%)"
              width="100%"
              height="3px"
              backgroundColor="purple.600"
            />
          </Heading>
          <FilterAndSortDrawer {...filterAndSortProps} />
        </Stack>
        {filteredProducts.length === 0 ? (
          <Text
            textAlign={"center"}
            fontWeight={"bolder"}
            fontSize={"xx-large"}
          >
            لا يوجد منتجات
          </Text>
        ) : (
          <Grid
            templateColumns={"repeat(auto-fill, minmax(300px, 1fr))"}
            gap={"5"}
            my="20px"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}

export default ProductDetailsPage;
