import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { HiCheckCircle } from "react-icons/hi2";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
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
      <Text color="purple.600" display="inline-block">
        <HiCheckCircle size="96" />
      </Text>
      <Heading
        as="h1"
        fontSize={{ base: "2xl", lg: "3xl" }}
        mb={6}
        color="purple.600"
      >
        عملية الدفع تمت بنجاح
      </Heading>
      <Text fontSize="lg" color="gray.700" mb={4}>
        شكراً على الشراء ! لقد تم معالجة عملية دفعك بنجاح
      </Text>
      <Text fontSize="md" color="gray.500" mb={6}>
        ستتلقى رسالة تأكيد عبر البريد الإلكتروني قريبًا.
      </Text>
      <VStack spacing={4}>
        <Button
          as={Link}
          to="/"
          mt={4}
          backgroundColor="purple.600"
          color="white"
          size="md"
          p="8px"
          _hover={{ backgroundColor: "purple.800" }}
        >
          الاستمرار في التسوق
        </Button>
      </VStack>
    </Box>
  );
};

export default PaymentSuccess;
