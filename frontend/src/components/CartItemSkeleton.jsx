import React from "react";
import { Box, Skeleton, Flex, Heading, Text, Button } from "@chakra-ui/react";
import { HiTrash } from "react-icons/hi2";

const CartItemSkeleton = () => {
  return (
    <Flex
      alignItems="center"
      justify={"space-between"}
      borderWidth="1px"
      borderRadius="md"
      borderColor={"purple.600"}
      p="2"
      mb="2"
      gap={2}
      boxShadow="md"
    >
      <Flex gap="20px" flexDirection={{ base: "column", lg: "row" }}>
        <Skeleton width="100px" height="100px" rounded={"sm"} />
        <Box>
          <Heading fontSize="large">
            <Skeleton height="20px" width="80%" />
          </Heading>
          <Text fontSize="large" fontWeight="bold">
            <Skeleton height="20px" width="40%" />
          </Text>
          <Flex align={"center"} justify={"flex-start"} gap={4} mt={4}>
            <Button
              backgroundColor="purple.600"
              color="white"
              p="5"
              _hover={{ backgroundColor: "purple.800" }}
              disabled
            >
              +
            </Button>
            <Text>
              <Skeleton height="20px" width="20px" />
            </Text>
            <Button
              backgroundColor="purple.600"
              color="white"
              p="5"
              _hover={{ backgroundColor: "purple.800" }}
              disabled
            >
              -
            </Button>
          </Flex>
        </Box>
      </Flex>
      <Flex flexDirection={"column"} gap="10px" alignItems={"center"}>
        <Button
          backgroundColor="red.600"
          color="white"
          maxW={"120px"}
          _hover={{ backgroundColor: "red.800" }}
          disabled
        >
          <HiTrash />
        </Button>
        <Box ml="auto">
          <Text fontWeight="bold">
            <Skeleton height="20px" width="80%" />
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default CartItemSkeleton;
