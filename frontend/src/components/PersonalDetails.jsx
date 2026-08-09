import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Box,
  Container,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { HiCreditCard } from "react-icons/hi2";

import { loadStripe } from "@stripe/stripe-js";
import { axiosInstance } from "../api/axios.config";
import CookieServices from "../services/CookieServices";
import { useSelector } from "react-redux";

const PersonalDetails = () => {
  const { register, handleSubmit } = useForm();
  const cart = useSelector((state) => state.cart);

  function onSubmit(data) {
    const body = {
      products: cart.cart,

      email: data.email,
      name: data.name,
      phone: data.phone,
      address: data.address,
    };
    makePayment(body);
  }

  const makePayment = async (body) => {
    try {
      const stripe = await loadStripe(
        "pk_test_51PTsIxI95CbFfi98yXkuEZxusbrcQWN53voALFtT67UvCRqjjRDZW9pGsKm4Yus8YD24cfxAFnJd4JGvvdraaAKk00mj1SeaNA"
      );

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
    <Container maxW="6xl" my="30px">
      <Box as="form" onSubmit={handleSubmit(onSubmit)} maxW="md">
        <VStack spacing="4">
          <FormControl id="name">
            <FormLabel>الاسم</FormLabel>
            <Input
              type="text"
              name="name"
              {...register("name", {
                required: "This field is required",
              })}
            />
          </FormControl>

          <FormControl id="email">
            <FormLabel>البريد الالكتروني</FormLabel>
            <Input
              type="email"
              name="email"
              {...register("email", {
                required: "This field is required",
              })}
            />
          </FormControl>
          <FormControl id="phone">
            <FormLabel>رقم الهاتف</FormLabel>
            <Input type="tel" name="phone" {...register("phone")} />
          </FormControl>
          <FormControl id="address">
            <FormLabel>العنوان</FormLabel>
            <Input type="text" name="address" {...register("address")} />
          </FormControl>
          <Button
            type="submit"
            bg="purple.600"
            color="white"
            size="md"
            rounded="lg"
            _hover={{
              bg: "purple.800",
            }}
            rightIcon={<HiCreditCard size={24} />}
            aria-label="الدفع"
          >
            الدفع
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default PersonalDetails;
