import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "./ProductCard";
import { useQuery } from "react-query";
import { getProductList } from "../services/apiProduct";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Skeleton,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { HiOutlineTag } from "react-icons/hi2";

const DiscountsCarousel = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 3, // Adjust as needed
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    rtl: true,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3, // Adjust as needed
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  const { data, isLoading } = useQuery("products", getProductList);

  const discountedProducts = data?.data.products.filter(
    (product) => product.discountPercentage > 0
  );

  return (
    discountedProducts?.length > 0 && (
      <Box mb="50px">
        <Container maxW="6xl">
          <Flex justify={"space-between"} align={"center"}>
            <Heading
              fontSize={{ base: "large", lg: "x-large" }}
              position="relative"
              display="inline-block"
            >
              الخصومات
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
            <Button
              as={Link}
              to={"/products/offers/discounts"}
              backgroundColor="purple.600"
              color="white"
              _hover={{ backgroundColor: "purple.800" }}
              size="sm"
              py="20px"
              px="10px"
              rightIcon={<HiOutlineTag size={20} />}
            >
              اظهر كل الخصومات
            </Button>
          </Flex>
          {isLoading ? (
            // Show loading skeleton while data is being fetched
            <Slider {...settings} arrows={false}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Box key={index} p={1} height="100%" pb="30px" rounded="lg">
                  <Skeleton height="300px" />
                </Box>
              ))}
            </Slider>
          ) : (
            <Slider {...settings} arrows={false}>
              {discountedProducts.map((product) => (
                <Box
                  key={product.id}
                  pt="30px"
                  pb="15px"
                  px="10px"
                  height="100%"
                >
                  <ProductCard {...product} />
                </Box>
              ))}
            </Slider>
          )}
        </Container>
      </Box>
    )
  );
};

export default DiscountsCarousel;
