import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { clearWishlist } from "../app/features/wishlistSlice";
import WishlistItem from "../components/WishlistItem";
import { HiXMark } from "react-icons/hi2";
import { Link } from "react-router-dom";

function WishlistPage() {
  const wishlist = useSelector((state) => state.wishlist);

  const dispatch = useDispatch();

  return (
    <Box p="4">
      {wishlist.wishlist.length > 0 ? (
        <>
          <Heading
            fontSize={{ base: "large", lg: "xx-large" }}
            mb="20px"
            position="relative"
            display="inline-block"
          >
            قائمة الرغبات
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
          {wishlist.wishlist.map((item) => (
            <WishlistItem item={item} key={item.data.product.id} />
          ))}

          <Button
            backgroundColor={"red.600"}
            color="white"
            _hover={{ backgroundColor: "red.800" }}
            onClick={() => dispatch(clearWishlist())}
            rightIcon={<HiXMark size={24} />}
            aria-label="مسح قائمة الرغبات"
          >
            مسح قائمة الرغبات
          </Button>
        </>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap="20px"
        >
          <Text fontWeight={"bold"} fontSize={"xx-large"} textAlign={"center"}>
            قائمة الرغبات فارغة
          </Text>
          <Button
            as={Link}
            to="/"
            backgroundColor="purple.600"
            color="white"
            size="sm"
            py="20px"
            px="10px"
            _hover={{ backgroundColor: "purple.800" }}
            rounded="lg"
            aria-label="اذهب للتسوق"
          >
            اذهب للتسوق
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default WishlistPage;
