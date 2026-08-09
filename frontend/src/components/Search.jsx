import React, { useState } from "react";
import {
  Box,
  Input,
  InputGroup,
  List,
  ListItem,
  Text,
  Divider,
  InputLeftElement,
  Image,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { getProductList } from "../services/apiProduct";
import { Link } from "react-router-dom";
import { HiOutlineMagnifyingGlass, HiXMark } from "react-icons/hi2";

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const { data } = useQuery("products", getProductList);

  const searchData = (value) => {
    const results = data?.data?.products.filter((product) =>
      product?.title?.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    searchData(value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <Box position="relative">
      <InputGroup>
        <InputLeftElement>
          {searchQuery.length > 0 ? (
            <HiXMark
              color="white"
              size={20}
              onClick={handleClearSearch}
              cursor="pointer"
            />
          ) : (
            <HiOutlineMagnifyingGlass color="white" size={20} />
          )}
        </InputLeftElement>
        <Input
          placeholder="ابحث عن منتجك..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          color={"white"}
          _focus={{
            _placeholder: { opacity: 0.4 },
            boxShadow: "none",
            bg: "purple.800",
            borderBottom: "1px solid white",
          }}
          border="none"
          rounded="none"
        />
      </InputGroup>
      {searchQuery && (
        <Box
          position="absolute"
          top="100%"
          left="0"
          width="100%"
          boxShadow="md"
          overflow="hidden"
          zIndex="10"
          p="2"
          bg={"purple.800"}
          color={"white"}
        >
          <List h="250px" overflowY="scroll" px="10px">
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <React.Fragment key={result.id}>
                  <ListItem
                    as={Link}
                    to={`/products/${result.id}`}
                    onClick={handleClearSearch}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p="3"
                    _hover={{
                      bg: "purple.600",
                      color: "white",
                    }}
                  >
                    <Text fontWeight="bold" fontSize="md" p={2}>
                      {result.title}
                    </Text>
                    <Image
                      rounded="lg"
                      objectFit="contain"
                      boxSize="60px"
                      bg="white"
                      src={result.thumbnail}
                      alt={result.title}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))
            ) : (
              <ListItem>
                <Text fontSize="large" fontWeight="semibold" textAlign="center">
                  لا يوجد نتائج متاحة
                </Text>
              </ListItem>
            )}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default SearchComponent;
