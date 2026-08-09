import {
  Box,
  Button,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
  Text,
  Input,
  HStack,
  InputGroup,
  InputLeftElement,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  getProductList,
  deleteProduct,
  createProduct,
  updateProduct,
} from "../../services/apiProduct";
import TableSkeleton from "../TableSkeleton";
import CustomeAlertDialog from "../../shared/AlretDialog";
import { HiEye, HiOutlineMagnifyingGlass, HiXMark } from "react-icons/hi2";
import { BiTrash } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";
import { getCategoriesList } from "../../services/apiCategories";
import CreateProductModal from "./CreateProductModal";
import EditProductModal from "./EditProductModal";

const DashboardProductsTable = () => {
  const [clickedProductId, setClickedProductId] = useState(null);
  const [productToEdit, setProductToEdit] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isCreateModalOpen,
    onOpen: onCreateModalOpen,
    onClose: onCreateModalClose,
  } = useDisclosure();
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const toast = useToast();

  const { isLoading, data } = useQuery("products", getProductList);
  const { data: categoriesData } = useQuery("categories", getCategoriesList);

  const { isLoading: isCreating, mutate: mutateCreate } = useMutation(
    createProduct,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("products"),
          onCreateModalClose(),
          toast({
            title: "المنتج تمت اضافته بنجاح",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
      },
      onError: (error) => {
        toast({
          title: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      },
    }
  );

  const { isLoading: isUpdating, mutate: mutateUpdate } = useMutation(
    updateProduct,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("products"),
          onEditModalClose(),
          toast({
            title: "المنتج تمت تعديله بنجاح",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
      },
      onError: (error) => {
        toast({
          title: error.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      },
    }
  );

  const { isLoading: isDeleting, mutate: mutateDelete } = useMutation({
    mutationFn: () => deleteProduct(clickedProductId),
    onSuccess: () => {
      queryClient.invalidateQueries("products"),
        toast({
          title: "المنتج تمت حذفه بنجاح",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
    },
  });

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  if (isLoading) return <TableSkeleton />;

  // Filter products based on search query
  const filteredProducts = data?.data.products?.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <HStack mb={4}>
        <Button
          backgroundColor="purple.600"
          color="white"
          size="md"
          px="25px"
          rounded="lg"
          _hover={{ backgroundColor: "purple.800" }}
          onClick={onCreateModalOpen}
        >
          اضف منتج جديد
        </Button>
        <InputGroup>
          <InputLeftElement>
            {searchQuery.length > 0 ? (
              <HiXMark
                color="white"
                size={20}
                onClick={handleClearSearch}
                cursor="pointer"
              />
            ) : (
              <HiOutlineMagnifyingGlass color="white" size={20} />
            )}
          </InputLeftElement>
          <Input
            placeholder="ابحث عن منتجك..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg="purple.600"
            color={"white"}
            rounded="lg"
            border="none"
            _focus={{
              _placeholder: { opacity: 0.5 },
              borderColor: "purple.800",
              boxShadow: "none",
            }}
          />
        </InputGroup>
      </HStack>
      <Box my="15px">
        <Text fontWeight="bold">عدد المنتجات: {filteredProducts.length}</Text>
      </Box>
      <TableContainer>
        <Table
          variant="striped"
          colorScheme="purple"
          my={5}
          fontWeight="bold"
          display={{ base: "none", md: "table" }}
        >
          <Thead>
            <Tr>
              <Th textAlign="center">Thumbnail</Th>
              <Th textAlign="center">Title</Th>
              <Th textAlign="center">Category</Th>
              <Th isNumeric textAlign="center">
                Price
              </Th>
              <Th isNumeric textAlign="center">
                Discount
              </Th>
              <Th isNumeric textAlign="center">
                Stock
              </Th>
              <Th textAlign="center">Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts?.map((product) => (
                <Tr key={product.id}>
                  <Td textAlign="center">
                    <Image
                      rounded="lg"
                      objectFit="contain"
                      boxSize="60px"
                      bg="white"
                      src={product.thumbnail}
                      alt={product.title}
                    />
                  </Td>
                  <Td whiteSpace="wrap" textAlign="center">
                    {product.title}
                  </Td>
                  <Td whiteSpace="wrap" textAlign="center">
                    {product.category?.title}
                  </Td>
                  <Td isNumeric textAlign="center">
                    {product.price}
                  </Td>
                  <Td isNumeric textAlign="center">
                    {product.discountPercentage} %
                  </Td>
                  <Td isNumeric textAlign="center">
                    {product.stock}
                  </Td>
                  <Td gap={3} textAlign="center">
                    <Button
                      as={Link}
                      to={`/products/${product.id}`}
                      mx="8px"
                      backgroundColor="purple.400"
                      color="white"
                      maxW={"120px"}
                      _hover={{ backgroundColor: "purple.500" }}
                    >
                      <HiEye size="18px" />
                    </Button>
                    <Button
                      mx="8px"
                      backgroundColor="gray.500"
                      color="white"
                      maxW={"120px"}
                      _hover={{ backgroundColor: "gray.700" }}
                      onClick={() => {
                        setProductToEdit(product);
                        onEditModalOpen();
                      }}
                    >
                      <FiEdit2 size="18px" />
                    </Button>
                    <Button
                      mx="8px"
                      backgroundColor="red.600"
                      color="white"
                      maxW={"120px"}
                      _hover={{ backgroundColor: "red.800" }}
                      onClick={() => {
                        setClickedProductId(product.id), onOpen();
                      }}
                    >
                      <BiTrash size="18px" />
                    </Button>
                  </Td>
                </Tr>
              ))
            ) : (
              <Text fontSize="large">لا يوجد نتائج مطابقة</Text>
            )}
          </Tbody>
        </Table>
        <VStack display={{ base: "flex", md: "none" }} spacing={4} my={5}>
          {filteredProducts.length > 0 ? (
            filteredProducts?.map((product) => (
              <Box
                key={product.id}
                borderWidth="1px"
                borderRadius="lg"
                borderColor="purple.600"
                shadow="lg"
                overflow="hidden"
                w="100%"
                p={4}
              >
                <Image
                  rounded="lg"
                  objectFit="contain"
                  boxSize="60px"
                  bg="white"
                  src={product.thumbnail}
                  alt={product.title}
                  mb={4}
                />
                <Text>Title: {product.title}</Text>
                <Text>Category: {product.category?.title}</Text>
                <Text>Price: {product.price}</Text>
                <Text>Discount: {product.discountPercentage} %</Text>
                <Text>Stock: {product.stock}</Text>
                <Box display="flex" gap={3} mt={4}>
                  <Button
                    as={Link}
                    to={`/products/${product.id}`}
                    backgroundColor="purple.400"
                    color="white"
                    maxW={"120px"}
                    _hover={{ backgroundColor: "purple.500" }}
                  >
                    <HiEye size="18px" />
                  </Button>
                  <Button
                    backgroundColor="gray.500"
                    color="white"
                    maxW={"120px"}
                    _hover={{ backgroundColor: "gray.700" }}
                    onClick={() => {
                      setProductToEdit(product);
                      onEditModalOpen();
                    }}
                  >
                    <FiEdit2 size="18px" />
                  </Button>
                  <Button
                    backgroundColor="red.600"
                    color="white"
                    maxW={"120px"}
                    _hover={{ backgroundColor: "red.800" }}
                    onClick={() => {
                      setClickedProductId(product.id), onOpen();
                    }}
                  >
                    <BiTrash size="18px" />
                  </Button>
                </Box>
              </Box>
            ))
          ) : (
            <Text fontSize="large">لا يوجد نتائج مطابقة</Text>
          )}
        </VStack>
      </TableContainer>

      <CustomeAlertDialog
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        mutate={mutateDelete}
        loading={isDeleting}
      />

      <CreateProductModal
        isOpen={isCreateModalOpen}
        onClose={onCreateModalClose}
        categoriesData={categoriesData}
        mutateCreate={mutateCreate}
        isCreating={isCreating}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        product={productToEdit}
        categoriesData={categoriesData}
        mutateUpdate={mutateUpdate}
        isUpdating={isUpdating}
      />
    </>
  );
};

export default DashboardProductsTable;
