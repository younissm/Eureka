import { Box, Flex, Heading, IconButton, Image, Text } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import {
  decressItem,
  deleteItem,
  incressItem,
} from "../app/features/cartSlice";
import { HiTrash } from "react-icons/hi2";
import { motion } from "framer-motion";
import { formatPrice } from "../utils";
import { HiMinus, HiPlus } from "react-icons/hi";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Flex
        key={item.data.product.id}
        alignItems="center"
        justify={"space-between"}
        borderWidth="1px"
        borderRadius="md"
        borderColor={"purple.600"}
        p="2"
        mb="4"
        gap={2}
        boxShadow="md"
        flexDirection={{ base: "column", md: "row" }}
        w="100%"
      >
        <Flex
          gap="20px"
          flexDirection={{ base: "column", md: "row" }}
          alignItems={{ base: "start", md: "center" }}
          w="100%"
        >
          <Box w="100%">
            <Image
              src={item.data.product.thumbnail}
              alt={item.data.product.title}
              boxSize="200px"
              objectFit="cover"
              rounded="md"
              w="100%"
            />
          </Box>
          <Box w="100%">
            <Heading fontSize="larger" mb="10px">
              {item.data.product.title}
            </Heading>
            {item.data.product.discountPercentage > 0 && (
              <Text
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="bold"
                mb="2"
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
              color={item.data.product.discountPercentage > 0 ? "gray.500" : ""}
              fontWeight={
                item.data.product.discountPercentage > 0 ? "normal" : "bold"
              }
            >
              {formatPrice(item.data.product.price)}
            </Text>
            <Flex align={"center"} justify={"flex-start"} gap={4} mt={4}>
              <IconButton
                backgroundColor="purple.600"
                color="white"
                size="sm"
                _hover={{ backgroundColor: "purple.800" }}
                onClick={() => dispatch(incressItem(item.data.product.id))}
                icon={<HiPlus />}
              />
              <Text color="purple.600" fontWeight="bold">
                {item.quantity}
              </Text>
              <IconButton
                backgroundColor="purple.600"
                color="white"
                size="sm"
                _hover={{ backgroundColor: "purple.800" }}
                onClick={() => dispatch(decressItem(item.data.product.id))}
                icon={<HiMinus />}
              />
            </Flex>
          </Box>
        </Flex>
        <Flex
          flexDirection={{ base: "row", md: "column" }}
          gap="10px"
          justifyContent="space-between"
          alignItems="flex-end"
          w="100%"
        >
          <Box>
            <Text fontWeight="bold">
              <Text> السعر الكلي</Text>
              {item.data.product.discountPercentage > 0
                ? formatPrice(
                    (item.data.product.price -
                      item.data.product.price *
                        (item.data.product.discountPercentage / 100)) *
                      item.quantity
                  )
                : formatPrice(item.data.product.price * item.quantity)}
            </Text>
          </Box>
          <IconButton
            backgroundColor="red.600"
            color="white"
            maxW={"120px"}
            _hover={{ backgroundColor: "red.800" }}
            onClick={() => dispatch(deleteItem(item.data.product.id))}
            icon={<HiTrash />}
          />
        </Flex>
      </Flex>
    </motion.div>
  );
};

export default CartItem;
