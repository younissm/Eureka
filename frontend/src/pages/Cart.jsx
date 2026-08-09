import { loadStripe } from "@stripe/stripe-js";

import { useDispatch, useSelector } from "react-redux";
import CartItem from "../components/CartItem";
import {
  clearCart,
  selectTotalDiscountedPrice,
  selectTotalPrice,
  selectTotalQuantity,
} from "../app/features/cartSlice";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils";
import { HiCreditCard, HiXMark } from "react-icons/hi2";
import { axiosInstance } from "../api/axios.config";
import CookieServices from "../services/CookieServices";

function CartPage() {
  const cart = useSelector((state) => state.cart);

  const totalPrice = useSelector(selectTotalPrice);
  const totalDiscountedPrice = useSelector(selectTotalDiscountedPrice);
  const totalQuantity = useSelector(selectTotalQuantity);

  const dispatch = useDispatch();

  const makePayment = async () => {
    try {
      const stripe = await loadStripe(
        "pk_test_51PTsIxI95CbFfi98yXkuEZxusbrcQWN53voALFtT67UvCRqjjRDZW9pGsKm4Yus8YD24cfxAFnJd4JGvvdraaAKk00mj1SeaNA"
      );

      const body = {
        products: cart.cart,
      };

      const response = await axiosInstance.post(
        "/payment/checkout-session",
        body,
        {
          headers: {
            Authorization: `Bearer ${CookieServices.get("jwt")}`,
          },
        }
      );

      const session = response.data;

      const result = await stripe.redirectToCheckout({
        sessionId: session.data.sessionId,
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <Box p="4">
      {cart.cart.length > 0 ? (
        <>
          <Heading
            fontSize={{ base: "large", lg: "xx-large" }}
            mb="20px"
            position="relative"
            display="inline-block"
          >
            عربة التسوق
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
          {cart.cart.map((item) => (
            <CartItem item={item} key={item.data.product.id} />
          ))}
          <Flex align={"center"} justify={"space-between"} gap="20px">
            <Box
              borderWidth="1px"
              borderRadius="md"
              borderColor={"purple.600"}
              boxShadow="md"
              p="8px"
              fontSize="medium"
            >
              <Text fontSize="lg" fontWeight="bold">
                الكمية: {totalQuantity}
              </Text>
              <Text fontSize="lg" fontWeight="bold">
                الاجمالي: {formatPrice(totalPrice)}
              </Text>
              {totalDiscountedPrice !== totalPrice ? (
                <Text fontSize="lg" fontWeight="bold">
                  الاجمالي بعد الخصم: {formatPrice(totalDiscountedPrice)}
                </Text>
              ) : null}
              <Button
                // as={Link}
                // to="/checkout"
                onClick={makePayment}
                mt="4"
                backgroundColor="purple.600"
                color="white"
                size="md"
                _hover={{ backgroundColor: "purple.800" }}
                rightIcon={<HiCreditCard size={24} />}
                aria-label="الدفع"
              >
                الدفع
              </Button>
            </Box>
            <Button
              bg={"red.600"}
              color="white"
              size="sm"
              _hover={{ backgroundColor: "red.800" }}
              onClick={() => dispatch(clearCart())}
              rightIcon={<HiXMark size={24} />}
              aria-label="مسح العربة"
            >
              مسح العربة
            </Button>
          </Flex>
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
            عربة التسوق فارغة
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

export default CartPage;
