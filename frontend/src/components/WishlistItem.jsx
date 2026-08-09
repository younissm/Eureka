import { Box, Flex, Heading, IconButton, Image, Text } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { deleteItem } from "../app/features/wishlistSlice";
import { HiEye, HiTrash } from "react-icons/hi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatPrice } from "../utils";
import { BsStarFill } from "react-icons/bs";

const WishlistItem = ({ item }) => {
  const dispatch = useDispatch();

  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Flex
        alignItems="center"
        borderWidth="1px"
        borderRadius="md"
        borderColor={"purple.600"}
        p="2"
        mb="4"
        justify={"space-between"}
        boxShadow="md"
        flexDirection={{ base: "column", md: "row" }}
        gap="20px"
      >
        <Flex
          gap="20px"
          flexDirection={{ base: "column", md: "row" }}
          alignItems={{ base: "start", md: "center" }}
          w="100%"
        >
          <Box w={{ base: "100%", md: "25%" }} h="100%">
            <Image
              src={item.data.product.thumbnail}
              alt={item.data.product.title}
              objectFit="cover"
              rounded="md"
              w="100%"
              h="100%"
            />
          </Box>
          <Box flexBasis="75%">
            <Heading
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="bold"
              mb="8px"
            >
              {item.data.product.title}
            </Heading>

            <Text
              fontSize={{ base: "md", md: "lg" }}
              mb="16px"
              color="gray.400"
            >
              {item.data.product.description}
            </Text>
            <Box
              borderWidth="1px"
              borderRadius="lg"
              p={2}
              w="88px"
              boxShadow="md"
              mb="8px"
            >
              <Flex alignItems="center" gap="4px">
                <BsStarFill color="gold" />
                <Text fontSize="xl" fontWeight="bold">
                  {item.data.product.ratingsAverage.toFixed(1)}
                </Text>
                <Text fontSize="md" color="gray.500">
                  / 5
                </Text>
              </Flex>
              <Text fontSize="sm" color="gray.500">
                {item.data.product.ratingsQuantity}{" "}
                {item.data.product.ratingsQuantity === 1 ? "review" : "reviews"}
              </Text>
            </Box>
            {item.data.product.discountPercentage > 0 && (
              <Text
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="bold"
                mb="4px"
              >
                {formatPrice(
                  item.data.product.price -
                    item.data.product.price *
                      (item.data.product.discountPercentage / 100)
                )}
              </Text>
            )}
            <Text
              fontSize={{ base: "md", md: "lg" }}
              textDecoration={
                item.data.product.discountPercentage > 0
                  ? "line-through"
                  : "none"
              }
              color={
                item.data.product.discountPercentage > 0 ? "gray.500" : "white"
              }
              fontWeight={
                item.data.product.discountPercentage > 0 ? "normal" : "bold"
              }
            >
              {formatPrice(item.data.product.price)}
            </Text>
          </Box>
        </Flex>
        <Flex gap={1} my="20px">
          <IconButton
            backgroundColor={"purple.600"}
            color="white"
            _hover={{ backgroundColor: "purple.800" }}
            as={Link}
            to={`/products/${item.data.product.id}`}
            icon={<HiEye />}
          />

          <IconButton
            backgroundColor={"red.600"}
            color="white"
            _hover={{ backgroundColor: "red.800" }}
            onClick={() => dispatch(deleteItem(item.data.product.id))}
            icon={<HiTrash />}
          />
        </Flex>
      </Flex>
    </motion.div>
  );
};

export default WishlistItem;
