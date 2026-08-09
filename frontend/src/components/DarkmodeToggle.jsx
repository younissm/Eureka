import { Button, Text, useColorMode } from "@chakra-ui/react";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";

export const DarkmodeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button
      onClick={toggleColorMode}
      bg={"none"}
      _hover={{ bg: "none" }}
      p="0"
      aria-label="dark-mode"
    >
      {colorMode === "light" ? (
        <Text
          as={"span"}
          color={"white"}
          _hover={{ color: "purple.800", transition: "color 0.2s" }}
        >
          <HiOutlineMoon size={24} />
        </Text>
      ) : (
        <Text
          as={"span"}
          color={"white"}
          _hover={{ color: "purple.800", transition: "color 0.2s" }}
        >
          <HiOutlineSun size={24} />
        </Text>
      )}
    </Button>
  );
};
