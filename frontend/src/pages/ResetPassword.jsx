// src/ResetPassword.js
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
import { useMutation, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../services/apiUsers";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "../utils/validationsSchemas";
import BackButton from "../shared/BackButton";

const ResetPassword = () => {
  const toast = useToast();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const { token } = useParams();

  const { isLoading, mutate } = useMutation(resetPassword, {
    onSuccess: () => {
      queryClient.invalidateQueries("resetPassword"),
        toast({
          title: "تم اعادة تعيين كلمة المرور بنجاح",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      navigate("/login");
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
      email: new URLSearchParams(location.search).get('email'),
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    };
    mutate({ body, token });
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
            اعادة تعيين كلمة المرور
          </Heading>
          <Text mb={4} textAlign="center">
            ادخل كلمة المرور الجديدة
          </Text>
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <FormControl isRequired mb={4} isInvalid={errors.password}>
              <FormLabel>كلمة المرور الجديدة</FormLabel>
              <Input
                type="password"
                placeholder="ادخل كلمة المرور الجديدة"
                {...register("password")}
              />
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isRequired mb={4} isInvalid={errors.passwordConfirm}>
              <FormLabel>تأكيد كلمة المرور الجديدة</FormLabel>
              <Input
                type="password"
                placeholder="أكد كلمة المرور الجديدة"
                {...register("passwordConfirm")}
              />
              <FormErrorMessage>
                {errors.passwordConfirm && errors.passwordConfirm.message}
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
              إعادة تعيين كلمة المرور
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ResetPassword;
