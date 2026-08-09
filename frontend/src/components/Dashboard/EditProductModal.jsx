import {
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  RadioGroup,
  Radio,
  Stack,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  FormErrorMessage,
} from "@chakra-ui/react";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomeModal from "../../shared/Modal";
import { EditProductSchema } from "../../utils/validationsSchemas";

const EditProductModal = ({
  isOpen,
  onClose,
  product,
  categoriesData,
  mutateUpdate,
  isUpdating,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(EditProductSchema),
    defaultValues: {
      title: product?.title || "",
      description: product?.description || "",
      price: product?.price || 0,
      stock: product?.stock || 0,
      discount: product?.discountPercentage || 0,
      thumbnail: null,
    },
  });

  useEffect(() => {
    if (product) {
      setValue("title", product.title);
      setValue("description", product.description);
      setValue("price", product.price);
      setValue("stock", product.stock);
      setValue("discount", product.discountPercentage || 0);
      setValue("thumbnail", null);
    }
  }, [product, setValue]);

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("discountPercentage", data.discount);
    formData.append("category", data.category);

    if (data.thumbnail && data.thumbnail.length > 0) {
      formData.append("thumbnail", data.thumbnail[0]);
    }

    mutateUpdate({ id: product.id, formData });
  };

  return (
    <CustomeModal
      isModalOpen={isOpen}
      onModalClose={onClose}
      title="Edit Product"
      okTxt="Save"
      loading={isUpdating}
      onSubmit={handleSubmit(onSubmit)}
      errorsExist={Object.keys(errors).length > 0}
    >
      <FormControl isInvalid={errors.title}>
        <FormLabel>Product title</FormLabel>
        <Input {...register("title")} />
        <FormErrorMessage color="red">{errors.title?.message}</FormErrorMessage>
      </FormControl>

      <FormControl my={3} isInvalid={errors.description}>
        <FormLabel>Product description</FormLabel>
        <Textarea {...register("description")} />
        <FormErrorMessage color="red">
          {errors.description?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl my={3} isInvalid={errors.category}>
        <Accordion defaultIndex={[0]} allowMultiple>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Product category
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <RadioGroup>
                <Stack>
                  {categoriesData?.data.categories.map((category) => (
                    <Radio
                      key={category.id}
                      value={category.title}
                      {...register("category")}
                    >
                      {category.title}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
              <FormErrorMessage color="red">
                {errors.category?.message}
              </FormErrorMessage>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </FormControl>

      <FormControl my={3} isInvalid={errors.price}>
        <FormLabel>Price</FormLabel>
        <NumberInput>
          <NumberInputField {...register("price")} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormErrorMessage color="red">{errors.price?.message}</FormErrorMessage>
      </FormControl>

      <FormControl my={3} isInvalid={errors.discount}>
        <FormLabel>Discount</FormLabel>
        <NumberInput>
          <NumberInputField {...register("discount")} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormErrorMessage color="red">
          {errors.discount?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl my={3} isInvalid={errors.stock}>
        <FormLabel>Count in stock</FormLabel>
        <NumberInput>
          <NumberInputField {...register("stock")} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormErrorMessage color="red">{errors.stock?.message}</FormErrorMessage>
      </FormControl>

      <FormControl my={3}>
        <FormLabel>Thumbnail</FormLabel>
        <Input type="file" {...register("thumbnail")} />
        {errors.thumbnail && (
          <FormErrorMessage color="red">
            {errors.thumbnail?.message}
          </FormErrorMessage>
        )}
      </FormControl>
    </CustomeModal>
  );
};

export default EditProductModal;
