import { Flex, Spinner } from "@chakra-ui/react";
import { FaSpinner } from "react-icons/fa";

const Loading = () => {
  return (
    <Flex direction="column" align="center" justify="center" height="100vh">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="purple.600"
        size="xl"
        icon={<FaSpinner />}
      />
    </Flex>
  );
};

export default Loading;
