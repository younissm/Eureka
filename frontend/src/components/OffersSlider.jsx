import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import "./offers-slider.css";

import sliderImg1 from "../assets/1.jpg";
import sliderImg2 from "../assets/2.jpg";
import sliderImg3 from "../assets/3.jpg";
import { Box, Container, Heading, Image } from "@chakra-ui/react";

const OffersSlider = () => {
  return (
    <Container maxW="6xl">
      <Box mb="50px">
        <Heading
          fontSize={{ base: "x-large", lg: "xx-large" }}
          mb="30px"
          position="relative"
          display="inline-block"
        >
          عروضنا
          <Box
            position="absolute"
            bottom="-5px"
            left="50%"
            transform="translateX(-50%)"
            width="100%"
            height="3px"
            backgroundColor="purple.600"
          />
        </Heading>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
        >
          <SwiperSlide>
            <Image
              src={sliderImg1}
              objectFit="fill"
              height="500px"
              width="100%"
              rounded="lg"
              alt="slider image"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src={sliderImg2}
              objectFit="fill"
              height="500px"
              width="100%"
              rounded="lg"
              alt="slider image"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src={sliderImg3}
              objectFit="fill"
              height="500px"
              width="100%"
              rounded="lg"
              alt="slider image"
            />
          </SwiperSlide>
        </Swiper>
      </Box>
    </Container>
  );
};

export default OffersSlider;
