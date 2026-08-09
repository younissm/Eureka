"use client";

import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Container,
} from "@chakra-ui/react";
import {
  HiOutlineBars3,
  HiOutlineChartBar,
  HiOutlineHome,
  HiOutlinePencilSquare,
  HiOutlineRectangleGroup,
  HiOutlineUser,
  HiOutlineViewColumns,
} from "react-icons/hi2";

import { Outlet, Link as RouterLink } from "react-router-dom";
import { DarkmodeToggle } from "../../components/DarkmodeToggle";
import { PiTShirtBold } from "react-icons/pi";

const LinkItems = [
  { name: "الرئيسية", to: "/", icon: HiOutlineHome },
  { name: "الاحصائيات", to: "/dashboard", icon: HiOutlineChartBar },
  { name: "المنتجات", to: "/dashboard/products", icon: HiOutlineViewColumns },
  {
    name: "الفئات",
    to: "/dashboard/categories",
    icon: HiOutlineRectangleGroup,
  },
  { name: "المستخدمين", to: "/dashboard/users", icon: HiOutlineUser },
  { name: "المراجعات", to: "/dashboard/reviews", icon: HiOutlinePencilSquare },
];

const SidebarContent = ({ onClose, ...rest }) => {
  return (
    <Box
      transition="3s ease"
      bg="purple.600"
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w="full"
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex
        // h="20"
        alignItems="center"
        mx="16px"
        justifyContent="space-between"
        borderBottom="white solid 1px"
        p="16px"
      >
        <Text fontSize="2xl" fontWeight="bold">
          <Flex
            flexDirection="column"
            alignItems="center"
            as={RouterLink}
            to="/"
            aria-label="logo"
          >
            <PiTShirtBold fontSize={"xxx-large"} color={"white"} />
            <Text fontSize="24px" fontWeight="bold" color="white">
              Eureka
            </Text>
          </Flex>
        </Text>
        <CloseButton display="flex" onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} name={link.name} icon={link.icon} to={link.to}>
          {link.name}
        </NavItem>
      ))}
      <Box
        mt="20px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        _hover={{ backgroundColor: "purple.800", color: "white" }}
        p="16px"
        mx="16px"
        rounded="8px"
      >
        <DarkmodeToggle />
      </Box>
    </Box>
  );
};

const NavItem = ({ to, icon, name, ...rest }) => {
  return (
    <Box
      as={RouterLink}
      to={to}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        color="white"
        _hover={{ backgroundColor: "purple.800", color: "white" }}
        gap="10px"
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="24px"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {name}
      </Flex>
    </Box>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      px={{ base: 4, md: 4 }}
      alignItems="center"
      justifyContent="space-between"
      {...rest}
      bg="purple.600"
      shadow="lg"
    >
      <IconButton
        color="purple.800"
        bg="white"
        _hover={{
          color: "white",
          bg: "purple.800",
        }}
        onClick={onOpen}
        aria-label="open menu"
        icon={<HiOutlineBars3 size={34} />}
      />

      <Text fontSize="2xl" fontWeight="bold">
        <Flex
          flexDirection="column"
          alignItems="center"
          as={RouterLink}
          to="/"
          aria-label="logo"
          p="5px"
        >
          <PiTShirtBold fontSize={"xxx-large"} color={"white"} />
          <Text fontSize="24px" fontWeight="bold" color="white">
            Eureka
          </Text>
        </Flex>
      </Text>
    </Flex>
  );
};

const SidebarWithHeader = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <Drawer
        isOpen={isOpen}
        size="sm"
        placement="right"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} />
      <Container maxW="6xl" my="10px">
        <Outlet />
      </Container>
    </Box>
  );
};

export default SidebarWithHeader;
