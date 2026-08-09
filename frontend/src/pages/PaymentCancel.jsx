import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { HiXCircle } from "react-icons/hi2";
import { Link } from "react-router-dom";

const PaymentCancel = () => {
  return (
    <Box
      p={8}
      maxW="container.md"
      bg="white"
      shadow="md"
      rounded="lg"
      textAlign="center"
      position="relative"
      bottom="50%"
      right="50%"
      transform="translate(50%,50%)"
    >
      <Text color="red.600" display="inline-block">
        <HiXCircle size="96" />
      </Text>
      <Heading
        as="h1"
        fontSize={{ base: "2xl", lg: "3xl" }}
        mb={6}
        color="red.600"
      >
        إلغاء الدفع
      </Heading>
      <Text fontSize="lg" color="gray.700" mb={4}>
        لقد تم إلغاء عملية دفعك . لم يتم خصم أي مبالغ.
      </Text>
      <Text fontSize="md" color="gray.500" mb={6}>
        يمكنك المحاولة مرة أخرى أو الاتصال بالدعم إذا كنت بحاجة إلى أي مساعدة.
      </Text>
      <VStack spacing={4}>
        <Button
          as={Link}
          to="/cart"
          mt={4}
          backgroundColor="purple.600"
          color="white"
          size="md"
          p="8px"
          _hover={{ backgroundColor: "purple.800" }}
        >
          إعادة المحاولة
        </Button>
      </VStack>
    </Box>
  );
};

export default PaymentCancel;
