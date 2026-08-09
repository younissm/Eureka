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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomeModal from "../../shared/Modal";
import { CreateProductSchema } from "../../utils/validationsSchemas";

const CreateProductModal = ({
  isOpen,
  onClose,
  categoriesData,
  mutateCreate,
  isCreating,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CreateProductSchema),
  });

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("discountPercentage", data.discount);
    formData.append("category", data.category);
    formData.append("thumbnail", data.thumbnail[0]);

    mutateCreate(formData);
  };

  return (
    <CustomeModal
      isModalOpen={isOpen}
      onModalClose={onClose}
      title="Create Product"
      okTxt="Create"
      loading={isCreating}
      onSubmit={handleSubmit(onSubmit)}
      errorsExist={Object.keys(errors).length > 0}
    >
      {/* Form Controls */}
      <FormControl isInvalid={errors.title}>
        <FormLabel>Product title</FormLabel>
        <Input {...register("title")} />
        <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
      </FormControl>

      <FormControl my={3} isInvalid={errors.description}>
        <FormLabel>Product description</FormLabel>
        <Textarea {...register("description")} />
        <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
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
              <FormErrorMessage>{errors.category?.message}</FormErrorMessage>
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
        <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
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
        <FormErrorMessage>{errors.discount?.message}</FormErrorMessage>
      </FormControl>

      <FormControl my={3} isInvalid={!!errors.stock}>
        <FormLabel>Count in stock</FormLabel>
        <NumberInput>
          <NumberInputField {...register("stock")} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormErrorMessage>{errors.stock?.message}</FormErrorMessage>
      </FormControl>

      <FormControl my={3} isInvalid={errors.thumbnail}>
        <FormLabel>Thumbnail</FormLabel>
        <Input type="file" {...register("thumbnail")} />
        <FormErrorMessage>{errors.thumbnail?.message}</FormErrorMessage>
      </FormControl>
    </CustomeModal>
  );
};

export default CreateProductModal;
