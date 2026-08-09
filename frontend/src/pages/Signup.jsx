"use client";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  FormErrorMessage,
  useToast,
  FormHelperText,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import BackButton from "../shared/BackButton";
import { HiOutlineUserPlus } from "react-icons/hi2";
import { SignupSchema } from "../utils/validationsSchemas";
import { useMutation, useQueryClient } from "react-query";
import { signup } from "../services/apiAuth";

export default function Signup() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(SignupSchema),
  });

  const { isLoading, mutate } = useMutation(signup, {
    onSuccess: () => {
      queryClient.invalidateQueries("signup"),
        toast({
          title: "تم الاشتراك بنجاح",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
          icon: <HiOutlineUserPlus size={20} />,
        });
      navigate("/login");
      reset();
    },
    onError: (error) => {
      toast({
        title: "حدث خطأ أثناء تسجيل الدخول",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    },
  });

  function onSubmit(data) {
    const { firstName, lastName, email, password } = data;
    const name = `${firstName} ${lastName}`;
    const body = {
      email,
      password,
      name,
    };

    mutate(body);
  }

  return (
    <>
      <Box position="absolute" top="50px" left="80px">
        <BackButton />
      </Box>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
        rounded="lg"
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"} justifyContent="center">
            <Heading fontSize={"4xl"} textAlign={"center"}>
              اشترك
            </Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4} as="form" onSubmit={handleSubmit(onSubmit)}>
              <HStack alignItems="flex-start">
                <Box>
                  <FormControl id="firstName" isInvalid={errors.firstName}>
                    <FormLabel>الاسم</FormLabel>
                    <Input type="text" {...register("firstName")} />
                    <FormErrorMessage>
                      {errors.firstName?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="lastName" isInvalid={errors.lastName}>
                    <FormLabel>اللقب</FormLabel>
                    <Input type="text" {...register("lastName")} />
                    <FormErrorMessage>
                      {errors.lastName?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="email" isInvalid={errors.email}>
                <FormLabel>البريد الالكتروني</FormLabel>
                <Input type="email" {...register("email")} />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>
              <FormControl id="password" isInvalid={errors.password}>
                <FormLabel>كلمة السر</FormLabel>
                <Input type="password" {...register("password")} />
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
                <FormHelperText>
                  يجب أن تكون كلمة المرور على الأقل ٨ أحرف ويجب أن تحتوي على حرف
                  كبير وحرف صغير واحد على الأقل
                </FormHelperText>
              </FormControl>

              <Stack spacing={10} pt={2}>
                <Button
                  size="lg"
                  backgroundColor="purple.600"
                  color="white"
                  p="5"
                  _hover={{ backgroundColor: "purple.800" }}
                  type="submit"
                  isLoading={isLoading}
                >
                  اشترك
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  انت مشترك بالفعل؟
                  <Link as={RouterLink} to={"/login"} color={"blue.400"}>
                    سجل الدخول
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}
