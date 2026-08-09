import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Image,
  Input,
  Text,
  useDisclosure,
  useToast,
  Grid,
  Flex,
  Container,
  Icon,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getMyUser, updateMe, updateMyPassword } from "../services/apiUsers";
import CustomeModal from "../shared/Modal";
import { useForm } from "react-hook-form";
import { formatDate } from "../utils";
import CookieServices from "../services/CookieServices";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { updatePasswordSchema } from "../utils/validationsSchemas";
import { useRef } from "react";
import {
  HiArrowUpTray,
  HiCalendar,
  HiEnvelope,
  HiPencilSquare,
  HiUser,
} from "react-icons/hi2";

const UserProfile = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery("myUser", getMyUser);
  const toast = useToast();
  const navigate = useNavigate();
  const imageRef = useRef();

  const handleClick = () => {
    onOpen();
    const timer = setTimeout(() => {
      imageRef.current.click();
    }, 200);
    return () => clearTimeout(timer);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isPasswordModalOpen,
    onOpen: onPasswordModalOpen,
    onClose: onPasswordModalClose,
  } = useDisclosure();

  const { register, handleSubmit } = useForm();
  const {
    register: registerPasswordUpdate,
    handleSubmit: handleSubmitPasswordUpdate,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(updatePasswordSchema),
  });

  const { isLoading: isUpdating, mutate: mutateUpdate } = useMutation(
    updateMe,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("myUser");
        onClose();
      },
    }
  );

  const { isLoading: isPasswordUpdating, mutate: mutatePasswordUpdate } =
    useMutation(updateMyPassword, {
      onSuccess: () => {
        queryClient.invalidateQueries("myUser");
        onPasswordModalClose();
        toast({
          title: "تم تغيير كلمة المرور بنجاح",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        CookieServices.remove("jwt");
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
    const name = `${data.firstname} ${data.lastname}`;
    const formData = new FormData();
    formData.append("name", name);
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }
    mutateUpdate(formData);
  }

  function onPasswordSubmit(data) {
    const body = {
      passwordCurrent: data.passwordCurrent,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    };
    mutatePasswordUpdate(body);
  }

  return (
    <>
      <Container maxW="6xl">
        <Box
          p={8}
          w="full"
          my="20px"
          border="2px"
          borderColor="purple.600"
          shadow="md"
          rounded="lg"
        >
          <Grid
            templateColumns={{ base: "1fr", md: "1fr 2fr" }}
            gap={3}
            alignItems="center"
            justifyItems="center"
          >
            <Box
              position="relative"
              boxSize="140px"
              rounded="full"
              cursor="pointer"
              overflow="hidden"
              _hover={{
                "& > img": { filter: "blur(3px)" },
                "& > .icon-overlay": { opacity: 1 },
              }}
              onClick={handleClick}
              border="3px solid transparent"
              outline="3px solid #6b46c1"
            >
              <Image
                objectFit="cover"
                boxSize="100%"
                bg="gray.100"
                src={data?.data.user.image}
                alt={data?.data.user.name}
                transition="filter 0.3s ease"
              />
              <Icon
                as={HiArrowUpTray}
                boxSize="50px"
                rounded="full"
                p="5px"
                color="purple.600"
                bg="white"
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                opacity={0}
                transition="opacity 0.3s ease"
                className="icon-overlay"
              />
            </Box>
            <Box
              p={5}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="sm"
              maxW="md"
            >
              <Flex
                mb={3}
                align="center"
                gap="5px"
                fontSize={{ base: "12px", md: "16px" }}
              >
                <Icon as={HiUser} boxSize={5} mr={2} color="purple.600" />
                <Text fontWeight="bold">اسم المستخدم:</Text>
                <Text ml={2}>{data?.data?.user?.name}</Text>
              </Flex>
              <Flex
                mb={3}
                align="center"
                gap="5px"
                fontSize={{ base: "12px", md: "16px" }}
              >
                <Icon as={HiEnvelope} boxSize={5} mr={2} color="purple.600" />
                <Text fontWeight="bold">البريد الالكتروني:</Text>
                <Text ml={2}>{data?.data?.user?.email}</Text>
              </Flex>
              <Flex
                mb={3}
                align="center"
                gap="5px"
                fontSize={{ base: "12px", md: "16px" }}
              >
                <Icon as={HiCalendar} boxSize={5} mr={2} color="purple.600" />
                <Text fontWeight="bold">تاريخ الانشاء:</Text>
                <Text ml={2}>{formatDate(data?.data?.user?.createdAt)}</Text>
              </Flex>
              {data?.data?.user?.updatedAt &&
                data?.data?.user?.updatedAt !== data?.data?.user?.createdAt && (
                  <Flex
                    mb={3}
                    align="center"
                    gap="5px"
                    fontSize={{ base: "12px", md: "16px" }}
                  >
                    <Icon
                      as={HiPencilSquare}
                      boxSize={5}
                      mr={2}
                      color="purple.600"
                    />
                    <Text fontWeight="bold">اخر تعديل:</Text>
                    <Text ml={2}>
                      {formatDate(data?.data?.user?.updatedAt)}
                    </Text>
                  </Flex>
                )}
            </Box>
          </Grid>
          <Flex justify="center" mt={6}>
            <ButtonGroup>
              <Button
                backgroundColor="purple.600"
                color="white"
                size="sm"
                _hover={{ backgroundColor: "purple.800" }}
                onClick={onOpen}
              >
                تعديل الحساب
              </Button>
              <Button
                backgroundColor="white"
                color="purple.600"
                size="sm"
                _hover={{ backgroundColor: "purple.600", color: "white" }}
                onClick={onPasswordModalOpen}
              >
                تغير كلمة المرور
              </Button>
            </ButtonGroup>
          </Flex>
        </Box>
      </Container>

      <CustomeModal
        isModalOpen={isOpen}
        onModalOpen={onOpen}
        onModalClose={onClose}
        title="تعديل المستخدم"
        okTxt="تعديل"
        cancelTxt="الغاء"
        loading={isUpdating}
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormControl my={3}>
          <FormLabel>الاسم</FormLabel>
          <Input
            placeholder="الاسم"
            id="firstname"
            {...register("firstname")}
            defaultValue={data?.data?.user?.name.split(" ")[0]}
          />
        </FormControl>
        <FormControl my={3}>
          <FormLabel>اللقب</FormLabel>
          <Input
            placeholder="اللقب"
            id="lastname"
            {...register("lastname")}
            defaultValue={data?.data?.user?.name.split(" ")[1]}
          />
        </FormControl>
        <FormControl my={3}>
          <FormLabel ref={imageRef}>الصورة</FormLabel>
          <Input type="file" {...register("image")} />
        </FormControl>
      </CustomeModal>

      <CustomeModal
        isModalOpen={isPasswordModalOpen}
        onModalOpen={onPasswordModalOpen}
        onModalClose={onPasswordModalClose}
        title="تغيير كلمة المرور"
        okTxt="تغيير"
        cancelTxt="الغاء"
        loading={isPasswordUpdating}
        onSubmit={handleSubmitPasswordUpdate(onPasswordSubmit)}
      >
        <FormControl my={3} isInvalid={!!errors.passwordCurrent}>
          <FormLabel>كلمة المرور الحالية</FormLabel>
          <Input
            type="password"
            placeholder="كلمة المرور الحالية"
            {...registerPasswordUpdate("passwordCurrent")}
          />
          <FormErrorMessage color={"red.500"}>
            {errors.passwordCurrent?.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl my={3} isInvalid={!!errors.password}>
          <FormLabel>كلمة المرور الجديدة</FormLabel>
          <Input
            type="password"
            placeholder="كلمة المرور الجديدة"
            {...registerPasswordUpdate("password")}
          />
          <FormErrorMessage color={"red.500"}>
            {errors.password?.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl my={3} isInvalid={!!errors.passwordConfirm}>
          <FormLabel>تأكيد كلمة المرور الجديدة</FormLabel>
          <Input
            type="password"
            placeholder="تأكيد كلمة المرور الجديدة"
            {...registerPasswordUpdate("passwordConfirm")}
          />
          <FormErrorMessage color={"red.500"}>
            {errors.passwordConfirm?.message}
          </FormErrorMessage>
        </FormControl>
      </CustomeModal>
    </>
  );
};

export default UserProfile;
