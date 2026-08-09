import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";

import { useQuery } from "react-query";
import { getProductList } from "../../services/apiProduct";
import { getUsersList } from "../../services/apiUsers";
import TinyBarChart from "./BarChart";
import { getReviewsList } from "../../services/apiReviews";
import {
  HiOutlineChartBar,
  HiOutlinePencilSquare,
  HiOutlineUser,
  HiOutlineViewColumns,
} from "react-icons/hi2";
import { getCategoriesList } from "../../services/apiCategories";

const DashboardStatistics = () => {
  const { data: productsList } = useQuery("products", getProductList);
  const { data: reviewsList } = useQuery("reviews", getReviewsList);
  const { data: usersList } = useQuery("users", getUsersList);
  const { data: categoriesList } = useQuery("categories", getCategoriesList);

  const productData = productsList?.data.products.map((product) => ({
    name: product?.title,
    value: product?.stock,
  }));

  const categoryCounts = {};

  productsList?.data.products?.forEach((product) => {
    const categoryName = product?.category.title;

    if (!categoryCounts[categoryName]) {
      categoryCounts[categoryName] = 1;
    } else {
      categoryCounts[categoryName]++;
    }
  });

  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <Flex flexDir="column" gap="100px">
      <Flex justify="center" gap="5px" flexWrap="wrap">
        <VStack
          spacing="4px"
          bg="purple.600"
          rounded="md"
          color="white"
          p="4px"
          _hover={{ bg: "purple.800" }}
          transition="0.3s"
        >
          <HiOutlineViewColumns size={24} />
          <Text fontSize="lg">عدد المنتجات</Text>
          <Text fontSize="2xl">{productsList?.data?.products?.length}</Text>
        </VStack>
        <VStack
          spacing="4px"
          bg="purple.600"
          rounded="md"
          color="white"
          p="4px"
          _hover={{ bg: "purple.800" }}
          transition="0.3s"
        >
          <HiOutlineChartBar size={24} />
          <Text fontSize="lg">عدد الفئات</Text>
          <Text fontSize="2xl">{categoriesList?.data?.categories?.length}</Text>
        </VStack>

        <VStack
          spacing="4px"
          bg="purple.600"
          rounded="md"
          color="white"
          p="4px"
          _hover={{ bg: "purple.800" }}
          transition="0.3s"
        >
          <HiOutlineUser size={24} />
          <Text fontSize="lg">عدد المستخدمين</Text>
          <Text fontSize="2xl">{usersList?.data?.users?.length}</Text>
        </VStack>
        <VStack
          spacing="4px"
          bg="purple.600"
          rounded="md"
          color="white"
          p="4px"
          _hover={{ bg: "purple.800" }}
          transition="0.3s"
        >
          <HiOutlinePencilSquare size={24} />
          <Text fontSize="lg">عدد المراجعات</Text>
          <Text fontSize="2xl">{reviewsList?.data?.reviews?.length}</Text>
        </VStack>
      </Flex>
      <Box w="100%" h="50vh">
        <Heading
          fontSize={{ base: "md", lg: "x-large" }}
          mb="40px"
          position="relative"
          display="inline-block"
        >
          عدد القطع المتوفرة من كل منتج
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

        <TinyBarChart data={productData} />
      </Box>
      <Box w="100%" h="50vh">
        <Heading
          fontSize={{ base: "md", lg: "x-large" }}
          mb="40px"
          position="relative"
          display="inline-block"
        >
          عدد المنتجات في كل فئة
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
        <TinyBarChart data={categoryData} />
      </Box>
    </Flex>
  );
};

export default DashboardStatistics;
