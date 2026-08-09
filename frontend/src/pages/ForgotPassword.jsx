import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { forgotPassword } from "../services/apiUsers";
import BackButton from "../shared/BackButton";

const ForgotPassword = () => {
  const toast = useToast();

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { isLoading, mutate } = useMutation(forgotPassword, {
    onSuccess: () => {
      queryClient.invalidateQueries("forgotPassword"),
        toast({
          title: "تم ارسال رابط اعادة تعيين كلمة المرور بنجاح",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      // navigate("/reset-password");
    },
    onError: (e) => {
      toast({
        title: e.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    },
  });

  function onSubmit(data) {
    // const formData = new FormData();
    // formData.append("email", data.email);
    const body = {
      email: data.email,
    };
    mutate(body);
  }

  return (
    <>
      <Box position="absolute" top="50px" left="80px">
        <BackButton />
      </Box>
      <Container
        h="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          p={8}
          maxWidth="500px"
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg"
        >
          <Heading as="h2" size="xl" mb={6} textAlign="center">
            نسيت كلمة المرور ؟
          </Heading>
          <Text mb={4} textAlign="center">
            ادخل بريدك الالكتروني و سنقوم بارسال رابط اعادة تعيين كلمة المرور
          </Text>
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <FormControl isRequired mb={4}>
              <FormLabel>البريد الالكتروني </FormLabel>
              <Input
                type="email"
                placeholder="ادخل بريدك الالكتروني"
                {...register("email")}
              />
              <FormErrorMessage color={"red.500"}>
                {errors.email?.message}
              </FormErrorMessage>
            </FormControl>
            <Button
              type="submit"
              backgroundColor="purple.600"
              color="white"
              size="md"
              p="8px"
              _hover={{ backgroundColor: "purple.800" }}
              width="full"
              isLoading={isLoading}
            >
              ارسال
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ForgotPassword;
