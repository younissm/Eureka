import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Image,
  Input,
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

import { useMutation, useQuery, useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import TableSkeleton from "../TableSkeleton";
import CustomeAlertDialog from "../../shared/AlretDialog";
import CustomeModal from "../../shared/Modal";

import { BiEdit, BiTrash } from "react-icons/bi";
import {
  createCategory,
  deleteCategory,
  getCategoriesList,
  updateCategory,
} from "../../services/apiCategories";

const DashboardCategoriesTable = () => {
  const [clickedCategoryId, setClickedCategoryId] = useState(null);
  const [clickedCategoryData, setClickedCategoryData] = useState(null);

  const { register, handleSubmit, setValue } = useForm();

  const toast = useToast();

  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery("categories", getCategoriesList);

  const { isLoading: isDeleting, mutate: mutateDelete } = useMutation({
    mutationFn: () => deleteCategory(clickedCategoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      }),
        onClose(),
        toast({
          title: "الفئة تمت حذفها بنجاح",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
    },
  });

  const { isLoading: isCreating, mutate: mutateCreate } = useMutation(
    createCategory,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["categories"],
        }),
          onCreateModalClose(),
          toast({
            title: "الفئة تمت اضافتها بنجاح",
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
  const { isLoading: isUpdating, mutate: mutateUpdate } = useMutation(
    updateCategory,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["categories"],
        }),
          onUpdateModalClose(),
          toast({
            title: "الفئة تمت تعديلها بنجاح",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
      },
    }
  );

  function onCreateSubmit(data) {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("thumbnail", data.thumbnail[0]);

    mutateCreate(formData);
  }

  function onUpdateSubmit(data) {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.thumbnail && data.thumbnail[0]) {
      formData.append("thumbnail", data.thumbnail[0]);
    }
    mutateUpdate({ id: clickedCategoryId, formData });
  }
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isCreateModalOpen,
    onOpen: onCreateModalOpen,
    onClose: onCreateModalClose,
  } = useDisclosure();
  const {
    isOpen: isUpdateModalOpen,
    onOpen: onUpdateModalOpen,
    onClose: onUpdateModalClose,
  } = useDisclosure();

  useEffect(() => {
    if (clickedCategoryData) {
      setValue("title", clickedCategoryData.title);
    }
  }, [clickedCategoryData, setValue]);

  if (isLoading) return <TableSkeleton />;
  return (
    <>
      <Button
        backgroundColor="purple.600"
        color="white"
        p="5"
        _hover={{ backgroundColor: "purple.800" }}
        onClick={onCreateModalOpen}
      >
        اضف فئة جديدة
      </Button>
      <TableContainer>
        <Table variant="simple" my={5}>
          <Thead>
            <Tr>
              <Th>NO.</Th>
              <Th>Title</Th>
              <Th>Thumbnail</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.data.categories.map((category, index) => {
              return (
                <Tr key={category.id}>
                  <Td>{index + 1}</Td>
                  <Td>{category.title}</Td>
                  <Td>
                    <Image
                      rounded="lg"
                      objectFit="contain"
                      boxSize="60px"
                      bg="white"
                      src={category.thumbnail}
                      alt={category.title}
                    />
                  </Td>

                  <Td>
                    <Button
                      backgroundColor="red.600"
                      color="white"
                      p="5"
                      _hover={{ backgroundColor: "red.800" }}
                      mr={3}
                      onClick={() => {
                        setClickedCategoryId(category.id);
                        onOpen();
                      }}
                    >
                      <BiTrash size={17} />
                    </Button>
                    <IconButton
                      icon={<BiEdit size={17} />}
                      backgroundColor="purple.600"
                      color="white"
                      p="5"
                      _hover={{ backgroundColor: "purple.800" }}
                      mr={3}
                      onClick={() => {
                        setClickedCategoryId(category.id);
                        setClickedCategoryData(category);
                        onUpdateModalOpen();
                      }}
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <CustomeAlertDialog
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        mutate={mutateDelete}
        loading={isDeleting}
      />
      <CustomeModal
        isModalOpen={isUpdateModalOpen}
        onModalOpen={onUpdateModalOpen}
        onModalClose={onUpdateModalClose}
        title={"Update Category"}
        okTxt="Update"
        loading={isUpdating}
        mutate={mutateUpdate}
        onSubmit={handleSubmit(onUpdateSubmit)}
      >
        <FormControl>
          <FormLabel>Category title</FormLabel>
          <Input placeholder="Category title" {...register("title")} />
        </FormControl>
        <FormControl my={3}>
          <FormLabel>الصورة</FormLabel>
          <Input type="file" {...register("thumbnail")} />
        </FormControl>
      </CustomeModal>
      <CustomeModal
        isModalOpen={isCreateModalOpen}
        onModalOpen={onCreateModalOpen}
        onModalClose={onCreateModalClose}
        title={"Create Category"}
        okTxt="Create"
        loading={isCreating}
        mutate={mutateCreate}
        onSubmit={handleSubmit(onCreateSubmit)}
      >
        <FormControl>
          <FormLabel>Category title</FormLabel>
          <Input placeholder="Category title" {...register("title")} />
        </FormControl>
        <FormControl my={3}>
          <FormLabel>الصورة</FormLabel>
          <Input type="file" {...register("thumbnail")} />
        </FormControl>
      </CustomeModal>
    </>
  );
};

export default DashboardCategoriesTable;
