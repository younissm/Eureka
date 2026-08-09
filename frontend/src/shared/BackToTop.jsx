import { useState, useEffect } from "react";
import { Button, Icon } from "@chakra-ui/react";
import { FaArrowUp } from "react-icons/fa";

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <Button
          position="fixed"
          bottom="35px"
          right="35px"
          zIndex="1000"
          onClick={scrollToTop}
          color="white"
          bgColor="purple.600"
          _hover={{ color: "purple.600", bgColor: "white" }}
          boxShadow="md"
          aria-label="Scroll to top"
        >
          <Icon as={FaArrowUp} />
        </Button>
      )}
    </>
  );
};

export default BackToTopButton;
