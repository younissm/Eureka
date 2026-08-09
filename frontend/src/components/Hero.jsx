"use client";

import {
  Stack,
  Flex,
  Button,
  Text,
  VStack,
  useBreakpointValue,
  HStack,
  Heading,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

import heroImg from "../assets/hero.jpg";
import { HiOutlineTag, HiOutlineViewColumns } from "react-icons/hi2";

export default function Hero() {
  return (
    <Flex
      w={"full"}
      h={"75vh"}
      backgroundImage={heroImg}
      backgroundSize={"cover"}
      backgroundPosition={"center center"}
      mb="50px"
    >
      <VStack
        w={"full"}
        justify={"center"}
        px={useBreakpointValue({ base: 4, md: 8 })}
        bgGradient={"linear(to-l, blackAlpha.900, transparent)"}
      >
        <Stack
          maxW={"2xl"}
          align={"flex-start"}
          spacing={6}
          alignItems="center"
        >
          <Heading color="white" fontWeight="bold">
            تسوق الآن، وكن في طليعة الموضة
          </Heading>
          <Text
            color={"white"}
            fontWeight={700}
            lineHeight={1.2}
            fontSize={useBreakpointValue({ base: "lg", md: "xl" })}
          >
            اختر من بين أفضل التصميمات وكن دائمًا على الموضة.
          </Text>
          <HStack>
            <Button
              as={Link}
              to={"/products"}
              backgroundColor="purple.600"
              color="white"
              _hover={{ backgroundColor: "purple.800" }}
              size="md"
              rightIcon={<HiOutlineViewColumns size={20} />}
            >
              منتجاتنا
            </Button>
            <Button
              as={Link}
              to={"/products/offers/discounts"}
              backgroundColor="white"
              color="purple.600"
              _hover={{ backgroundColor: "purple.600", color: "white" }}
              size="md"
              rightIcon={<HiOutlineTag size={20} />}
            >
              خصوماتنا
            </Button>
          </HStack>
        </Stack>
      </VStack>
    </Flex>
  );
}
