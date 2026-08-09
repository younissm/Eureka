import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import ProductDetailsSkeleton from "../components/ProductDetailsSkeleton";
import { useDispatch } from "react-redux";
import { addItem } from "../app/features/cartSlice";
import { addItem as addItemToWishlist } from "../app/features/wishlistSlice";
import {
  HiOutlineArrowsRightLeft,
  HiOutlineExclamationTriangle,
  HiOutlineHeart,
  HiOutlineShoppingBag,
} from "react-icons/hi2";

import {
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  IconButton,
  Image,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import Reviews from "../components/Reviews";
import { useSelector } from "react-redux";
import { getCategoryProduct, getProduct } from "../services/apiProduct";
import { formatPrice } from "../utils";
import { addItemToCompare } from "../app/features/compareSlice";
import ProductCard from "../components/ProductCard";
import { BsStarFill } from "react-icons/bs";

function ProductDetailsPage() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const wishlist = useSelector((state) => state.wishlist);
  const compare = useSelector((state) => state.compare);

  const toast = useToast();

  const { isLoading, data } = useQuery(["product", id], () => getProduct(id));

  const category = data?.data.product.category;
  const { data: categoryData } = useQuery(["products", category], () =>
    getCategoryProduct(category)
  );
  const handleAddToCart = () => {
    const existingProduct = cart.cart.find(
      (item) => item.data.product.id === data.data.product.id
    );

    !existingProduct &&
      (dispatch(addItem(data)),
      toast({
        title: "المنتج تمت اضافته الى عربة التسوق بنجاح",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
        icon: <HiOutlineShoppingBag size={20} />,
      }));

    existingProduct &&
      toast({
        title: " المنتج موجود بالفعل في عربة التسوق",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
        icon: <HiOutlineExclamationTriangle size={20} />,
      });
  };

  const handleAddToWishlist = () => {
    const existingProduct = wishlist.wishlist.find(
      (item) => item.data.product.id === data.data.product.id
    );
    !existingProduct &&
      (dispatch(addItemToWishlist(data)),
      toast({
        title: " المنتج تمت اضافته الى قائمة الرغبات بنجاح",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
        icon: <HiOutlineHeart size={20} />,
      }));

    existingProduct &&
      toast({
        title: " المنتج موجود بالفعل في قائمة الرغبات ",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
        icon: <HiOutlineExclamationTriangle size={20} />,
      });
  };

  const handleAddToCompare = () => {
    const existingProduct = compare.compare.find(
      (item) => item.data.product.id === data.data.product.id
    );

    if (!existingProduct) {
      if (compare.compare.length < 3) {
        dispatch(addItemToCompare(data));
        toast({
          title: " المنتج تمت اضافته الى المقارنات بنجاح",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
          icon: <HiOutlineArrowsRightLeft size={20} />,
        });
      } else {
        toast({
          title: "لا يمكن اضافة المنتج، يمكنك المقارنة بين 3 منتجات فقط",
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "top-right",
          icon: <HiOutlineExclamationTriangle size={20} />,
        });
      }
    } else {
      toast({
        title: " المنتج موجود بالفعل في المقارنات ",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
        icon: <HiOutlineExclamationTriangle size={20} />,
      });
    }
  };

  if (isLoading) return <ProductDetailsSkeleton />;

  return (
    <Container maxW="6xl" my="20px">
      <Box>
        <Heading
          fontSize={{ base: "large", md: "xx-large" }}
          mb="20px"
          position="relative"
          display="inline-block"
        >
          {data?.data.product.title}
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
        <Box
          borderWidth="1px"
          borderRadius="md"
          borderColor={"purple.600"}
          rounded="lg"
          boxShadow="xl"
          mb="4"
        >
          <HStack
            justifyContent={"space-between"}
            flexDirection={{ base: "column", md: "row" }}
          >
            <Image
              src={data?.data.product.thumbnail}
              alt={data.data.product.title}
              // maxW="400px"
              w={{ base: "100%", md: "50%" }}
              aspectRatio="1/1"
              objectFit="cover"
              rounded={{ base: "none", md: "lg" }}
              roundedLeft={{ md: "none" }}
              roundedTop={{ base: "lg" }}
              flexBasis="50%"
            />
            <VStack
              align="center"
              justify="center"
              spacing="4"
              p="20px"
              flexBasis="50%"
            >
              <Box
                borderWidth="1px"
                borderRadius="lg"
                p={4}
                maxW="sm"
                boxShadow="md"
              >
                <Flex alignItems="center">
                  <BsStarFill color="gold" />
                  <Text fontSize="2xl" fontWeight="bold" mx={2}>
                    {data.data.product.ratingsAverage?.toFixed(1)}
                  </Text>
                  <Text fontSize="lg" color="gray.500" ml={2}>
                    / 5
                  </Text>
                </Flex>
                <Text fontSize="md" color="gray.500" mt={2}>
                  {data.data.product.ratingsQuantity}{" "}
                  {data.data.product.ratingsQuantity === 1
                    ? "review"
                    : "reviews"}
                </Text>
              </Box>

              <Text fontSize={{ base: "md", md: "lg" }} mt="2" color="gray.400">
                {data.data.product.description}
              </Text>

              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                gap="10px"
              >
                <Text
                  fontSize="large"
                  textDecoration={
                    data.data.product.discountPercentage
                      ? "line-through"
                      : "none"
                  }
                  fontWeight={
                    data.data.product.discountPercentage ? "thin" : "semibold"
                  }
                >
                  {formatPrice(data.data.product.price)}
                </Text>
                {data.data.product.discountPercentage > 0 ? (
                  <Text fontSize="large" fontWeight="semibold">
                    {formatPrice(
                      data.data.product.price -
                        data.data.product.price *
                          (data.data.product.discountPercentage / 100)
                    )}
                  </Text>
                ) : null}
              </Box>
              {data.data.product.discountPercentage > 0 ? (
                <Text fontSize="md">
                  تخفيض : {`${data.data.product.discountPercentage} %`}
                </Text>
              ) : null}
              <Text fontSize="md">
                عدد القطع المتوفرة :{data.data.product.stock}
              </Text>

              <HStack spacing="2" flexDirection="row" w="full">
                <IconButton
                  flexGrow="1"
                  backgroundColor="purple.600"
                  color="white"
                  size="lg"
                  _hover={{ backgroundColor: "purple.800" }}
                  onClick={handleAddToCart}
                  aria-label="اضافة الى العربة"
                  icon={<HiOutlineShoppingBag />}
                />
                <IconButton
                  variant="outline"
                  colorScheme="purple"
                  size="lg"
                  onClick={handleAddToWishlist}
                  aria-label="اضافة الى المفضلة"
                  icon={<HiOutlineHeart />}
                />
                <IconButton
                  variant="outline"
                  colorScheme="purple"
                  size="lg"
                  icon={<HiOutlineArrowsRightLeft size="20" />}
                  onClick={handleAddToCompare}
                />
              </HStack>
            </VStack>
          </HStack>
        </Box>
      </Box>

      <Reviews productId={id} />
      <Box mt="20px">
        <Heading
          fontSize={{ base: "large", md: "xx-large" }}
          mb="20px"
          position="relative"
          display="inline-block"
        >
          منتجات قد تعجبك
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
          templateColumns={"repeat(auto-fill, minmax(200px, 1fr))"}
          gap={"5"}
        >
          {categoryData?.data.products
            .slice(0, 5)
            .filter((el) => el.id !== id)
            .map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default ProductDetailsPage;
