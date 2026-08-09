import {
  FormControl,
  FormLabel,
  IconButton,
  Image,
  Input,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { BiEdit, BiTrash } from "react-icons/bi";
import CustomeAlertDialog from "../../shared/AlretDialog";
import { deleteUser, getUsersList, updateUser } from "../../services/apiUsers";
import CustomeModal from "../../shared/Modal";
import { useForm } from "react-hook-form";
import { formatDate } from "../../utils";

const DashboardUsersTable = () => {
  const [clickedUserId, setClickedUserId] = useState(null);
  const [clickedUserData, setClickedUserData] = useState(null);

  const toast = useToast();
  const { register, handleSubmit } = useForm();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isUpdateModalOpen,
    onOpen: onUpdateModalOpen,
    onClose: onUpdateModalClose,
  } = useDisclosure();

  const queryClient = useQueryClient();
  const { data: usersData } = useQuery("users", getUsersList);

  const { isLoading: isDeleting, mutate: mutateDelete } = useMutation({
    mutationFn: () => deleteUser(clickedUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });

  const { isLoading: isUpdating, mutate: mutateUpdate } = useMutation(
    updateUser,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["users"],
        }),
          onUpdateModalClose(),
          toast({
            title: "تم تعديل المستخدم بنجاح",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
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
    }
  );

  function onUpdateSubmit(data) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("role", data.role);

    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }
    mutateUpdate({ id: clickedUserId, formData });
  }

  return (
    <>
      <TableContainer>
        <Table variant="simple" my={5}>
          <Thead>
            <Tr>
              <Th>NO.</Th>
              <Th>الصورة</Th>
              <Th>اسم المستخدم</Th>
              <Th>البريد الالكتروني</Th>
              <Th>الدور</Th>
              <Th>وقت الانشاء</Th>
              <Th>وقت التعديل</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {usersData?.data.users.map((user, index) => {
              return (
                <Tr key={user.id}>
                  <Td>{index + 1}</Td>
                  <Td>
                    <Image
                      rounded="lg"
                      objectFit="contain"
                      boxSize="60px"
                      bg="white"
                      src={user?.image}
                      alt={user?.name}
                    />
                  </Td>
                  <Td>{user?.name}</Td>
                  <Td>{user?.email}</Td>
                  <Td>{user?.role}</Td>
                  <Td>{formatDate(user?.createdAt)}</Td>
                  {user.updatedAt !== user.createdAt ? (
                    <Td>{formatDate(user?.updatedAt)}</Td>
                  ) : (
                    <Td textAlign="center">---</Td>
                  )}
                  <Td>
                    <IconButton
                      icon={<BiEdit size={17} />}
                      backgroundColor="purple.600"
                      color="white"
                      _hover={{ backgroundColor: "purple.800" }}
                      ml={2}
                      onClick={() => {
                        setClickedUserId(user?.id);
                        setClickedUserData(user);
                        onUpdateModalOpen();
                      }}
                    />
                    <IconButton
                      backgroundColor="red.600"
                      color="white"
                      _hover={{ backgroundColor: "red.800" }}
                      onClick={() => {
                        setClickedUserId(user?.id);
                        onOpen();
                      }}
                      icon={<BiTrash size={17} />}
                      aria-label="حذف مستخدم"
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <CustomeModal
        isModalOpen={isUpdateModalOpen}
        onModalOpen={onUpdateModalOpen}
        onModalClose={onUpdateModalClose}
        title={"Update User"}
        okTxt="Update"
        loading={isUpdating}
        mutate={mutateUpdate}
        onSubmit={handleSubmit(onUpdateSubmit)}
      >
        <FormControl my={3}>
          <FormLabel>اسم المستخدم</FormLabel>
          <Input
            placeholder="اسم المستخدم"
            {...register("name")}
            defaultValue={clickedUserData?.name}
          />
        </FormControl>
        <FormControl my={3}>
          <FormLabel>البريد الالكتروني للمستخدم</FormLabel>
          <Input
            placeholder="البريد الالكتروني"
            {...register("email")}
            defaultValue={clickedUserData?.email}
          />
        </FormControl>

        <FormControl my={3}>
          <FormLabel>الدور </FormLabel>
          <Select
            placeholder="Select option"
            {...register("role")}
            defaultValue={clickedUserData?.role}
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </Select>
        </FormControl>

        <FormControl my={3}>
          <FormLabel>الصورة</FormLabel>
          <Input type="file" {...register("image")} />
        </FormControl>
      </CustomeModal>

      <CustomeAlertDialog
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        mutate={mutateDelete}
        loading={isDeleting}
      />
    </>
  );
};

export default DashboardUsersTable;
