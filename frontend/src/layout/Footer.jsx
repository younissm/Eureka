"use client";

import {
  Box,
  chakra,
  Container,
  Flex,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import { PiTShirtBold } from "react-icons/pi";

const SocialButton = ({ children, label, href }) => {
  return (
    <chakra.button
      bg="white"
      color="purple.800"
      rounded="lg"
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition=" 0.3s ease"
      _hover={{
        bg: "purple.800",
        color: "white",
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box bg="purple.600" color="white">
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        spacing={4}
        justify={"center"}
        align={"center"}
      >
        <Flex
          flexDirection="column"
          alignItems="center"
          as={Link}
          to="/"
          aria-label="logo"
          p="5px"
        >
          <PiTShirtBold fontSize={"xxx-large"} color={"white"} />
          <Text fontSize="24px" fontWeight="bold" color="white">
            Eureka
          </Text>
        </Flex>
      </Container>

      <Box
        borderTopWidth={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Container
          as={Stack}
          maxW={"6xl"}
          py={4}
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justify={{ base: "center", md: "space-between" }}
          align={{ base: "center", md: "center" }}
        >
          <Text> Eureka {currentYear} ©</Text>
          <Stack direction={"row"} spacing={6}>
            <SocialButton label={"YouTube"} href={"#"}>
              <FaFacebook />
            </SocialButton>
            <SocialButton label={"Twitter"} href={"#"}>
              <FaTwitter />
            </SocialButton>
            <SocialButton label={"Instagram"} href={"#"}>
              <FaInstagram />
            </SocialButton>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
