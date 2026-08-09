import { IconButton } from "@chakra-ui/react";
import { HiArrowLeft } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);
  return (
    <IconButton
      bg="purple.600"
      color="white"
      size="md"
      rounded="lg"
      _hover={{
        bg: "purple.800",
        color: "white",
      }}
      icon={<HiArrowLeft size={24} />}
      onClick={goBack}
      aria-label="الرجوع"
    />
  );
};

export default BackButton;
