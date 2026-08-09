import { Box, Container, Heading, Stack, Text } from "@chakra-ui/react";
import BackButton from "../shared/BackButton";

const NotFoundPage = () => {
  return (
    <>
      <Container maxW="6xl" mt="10px" display="flex" justifyContent="flex-end">
        <BackButton />
      </Container>
      <Box textAlign="center" mt={20}>
        <Container>
          <Stack spacing={6} justifyContent="center" alignItems="center">
            <Heading as="h1" size="xl">
              404 - الصفحة غير موجودة
            </Heading>
            <Text fontSize="lg">
              عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. قد تكون
              الصفحة قد تم حذفها، أو أن الرابط غير صحيح.
            </Text>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default NotFoundPage;
