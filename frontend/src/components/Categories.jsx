import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  Skeleton,
} from "@chakra-ui/react";

import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getCategoriesList } from "../services/apiCategories";

const Categories = () => {
  const { data, isLoading } = useQuery("categories", getCategoriesList);

  return (
    <Container maxW="6xl">
      <Box mb="50px">
        <Heading
          fontSize={{ base: "large", lg: "x-large" }}
          mb="30px"
          position="relative"
          display="inline-block"
        >
          تسوق حسب الفئات
          <Box
            position="absolute"
            bottom="-5px"
            left="50%"
            transform="translateX(-50%)"
            width="100%"
            height="3px"
            backgroundColor="purple.600"
          />
        </Heading>
        <Grid
          templateColumns={"repeat(auto-fill, minmax(150px, 1fr))"}
          gap={"6"}
        >
          {isLoading // Show loading skeleton while data is being fetched
            ? Array.from({ length: 16 }).map((_, index) => (
                <Box textAlign="center" key={index} rounded="lg">
                  <Skeleton p="10px" w="100%" />
                </Box>
              ))
            : data.data.categories.map((category) => (
                <motion.div whileHover={{ scale: 1.05 }} key={category.id}>
                  <Box
                    backgroundImage={`url(${category.thumbnail})`}
                    backgroundSize="cover"
                    backgroundPosition="center"
                    color="white"
                    boxShadow="md"
                    rounded="md"
                    h="150px"
                  >
                    <Button
                      to={`/products/categories/${category.title}`}
                      as={Link}
                      color="white"
                      background="none"
                      boxShadow="md"
                      p="10px"
                      w="100%"
                      h="100%"
                      fontSize="18px"
                      aria-label={category.title}
                    >
                      {category.title}
                    </Button>
                  </Box>
                </motion.div>
              ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Categories;
