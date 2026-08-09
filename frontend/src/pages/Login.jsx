"use client";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { selectLogin, userLogin } from "../app/features/loginSlice";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "../shared/BackButton";
import { HiOutlineArrowLeftOnRectangle } from "react-icons/hi2";
import { useEffect } from "react";
import { LoginSchema } from "../utils/validationsSchemas";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginSchema),
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const { loading, error: loginError, success } = useSelector(selectLogin);

  function onSubmit(data) {
    const { email, password } = data;
    dispatch(userLogin({ email, password }));
  }

  // Navigate to the home page if login is successful
  useEffect(() => {
    if (success) {
      toast({
        title: "تم تسجيل الدخول بنجاح",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
        icon: <HiOutlineArrowLeftOnRectangle size={20} />,
      });

      navigate("/");
    }
  }, [success, navigate, toast]);
  // Handle login error
  useEffect(() => {
    if (loginError) {
      toast({
        title: "حدث خطأ أثناء تسجيل الدخول",
        description:
          (loginError.response?.data?.message &&
            "البريد الالكتروني او كلمة المرور غير صحيح") ||
          loginError.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  }, [loginError, toast]);

  const backgroundColor = useColorModeValue("gray.50", "gray.800");
  const formColor = useColorModeValue("white", "gray.700");

  return (
    <>
      <Box position="absolute" top="50px" left="80px">
        <BackButton />
      </Box>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={backgroundColor}
        rounded="lg"
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>سجل الدخول الى حسابك</Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={formColor}
            boxShadow={"lg"}
            p={8}
            as="form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Stack spacing={4}>
              <FormControl id="email" isInvalid={!!errors.email}>
                <FormLabel>البريد الالكتروني</FormLabel>
                <Input type="email" {...register("email")} />
                <FormErrorMessage color={"red.500"}>
                  {errors.email?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl id="password" isInvalid={!!errors.password}>
                <FormLabel>كلمة السر</FormLabel>
                <Input type="password" {...register("password")} />
                <FormErrorMessage color={"red.500"}>
                  {errors.password?.message}
                </FormErrorMessage>
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Text as={Link} to={"/signup"} color={"blue.400"}>
                    مستخدم جديد؟
                  </Text>
                  <Text as={Link} to={"/forgot-password"} color={"blue.400"}>
                    نسيت كلمة المرور؟
                  </Text>
                </Stack>
                <Button
                  backgroundColor="purple.600"
                  color="white"
                  size="large"
                  p="5"
                  _hover={{ backgroundColor: "purple.800" }}
                  type="submit"
                  isLoading={loading}
                >
                  سجل الدخول
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}
