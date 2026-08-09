import { Box } from "@chakra-ui/react";
import Categories from "../components/Categories";
import Hero from "../components/Hero";
import DiscountsCarousel from "../components/HomeDiscountsSlider";
import ProductCarousel from "../components/HomeProductsSlider";
import OffersSlider from "../components/OffersSlider";
import Benefits from "../components/Benefits";

const Home = () => {
  return (
    <>
      <Hero />
      <OffersSlider />
      <Box>
        <Benefits />
        <Categories />
        <DiscountsCarousel />
        <ProductCarousel />
      </Box>
    </>
  );
};

export default Home;
