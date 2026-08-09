import { useToast } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { BiWifi, BiWifiOff } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { networkMode } from "../app/features/networkSlice";

const InternetConnectionProvider = ({ children }) => {
  const toast = useToast();
  const toastIdRef = useRef();

  const dispatch = useDispatch();

  function close() {
    toast.closeAll(toastIdRef.current);
  }

  function offlineToast() {
    toastIdRef.current = toast({
      title: "انت غير متصل بالانترنت",
      description: "الرجاء التحقق من اتصال الانترنت الخاص بك",
      status: "warning",
      duration: null,
      isClosable: true,
      position: "top-right",
      icon: <BiWifiOff size={20} />,
    });
  }

  function onlineToast() {
    toastIdRef.current = toast({
      title: "انت متصل بالانترنت",
      description: "تمت استعادة اتصالك بالإنترنت",
      status: "success",
      duration: "4000",
      isClosable: true,
      position: "top-right",
      icon: <BiWifi size={20} />,
    });
  }

  const setOnLine = () => {
    dispatch(networkMode(true));
    close();
    onlineToast();
  };
  const setOffLine = () => {
    dispatch(networkMode(false));
    offlineToast();
  };

  useEffect(() => {
    window.addEventListener("online", setOnLine);

    window.addEventListener("offline", setOffLine);

    return () => {
      window.removeEventListener("online", setOnLine);
      window.removeEventListener("offline", setOffLine);
    };
  }, []);

  return children;
};

export default InternetConnectionProvider;
