import { Box, Button, Grid, Heading } from "@chakra-ui/react";

import { useQuery } from "react-query";
import { getProductList } from "../services/apiProduct";
import { Link } from "react-router-dom";

const BrowseByCategory = () => {
  const { data } = useQuery("products", getProductList);
  return (
    <Box p={30} borderTop="1px solid" borderBottom="1px solid">
      <Heading fontSize={"x-large"}>استكشف التصنيفات</Heading>
      <Grid
        my={"30"}
        templateColumns={"repeat(auto-fill, minmax(110px, 1fr))"}
        gap={"3"}
      >
        {data?.data?.map((product) => {
          return (
            <Link
              key={product.id}
              to={`/${product?.attributes?.category.data[0].attributes?.title}`}
              // to={`/category/${product.attributes.category.data[0].attributes.title}`}
            >
              <Button boxSize={"110px"}>
                {product?.attributes?.category.data.map(
                  (item) => item.attributes.title
                )}
              </Button>
            </Link>
          );
        })}
      </Grid>
    </Box>
  );
};

export default BrowseByCategory;
