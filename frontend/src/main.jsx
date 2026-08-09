import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import { Provider } from "react-redux";
import { store } from "./app/store.js";
import InternetConnectionProvider from "./provider/InternetConnectionProvider.jsx";

const theme = extendTheme({
  styles: {
    global: {
      "input::placeholder": {
        color: "white", // Change placeholder text color here
      },
    },
  },
  fonts: {
    body: "Tajawal, sans-serif", // Change the font for the body text
    heading: "Tajawal, sans-serif", // Change the font for headings
    mono: "Tajawal, monospace", // Change the font for monospaced text
  },
  direction: "rtl", // Set the direction to RTL
  components: {
    Radio: {
      baseStyle: {
        control: {
          _checked: {
            bg: "purple.600", // Change the background color when selected
            color: "white",
            borderColor: "blue.800", // Change the border color when selected
            _hover: {
              bg: "purple.400", // Change the background color on hover
              borderColor: "purple.600", // Change the border color on hover
            },
          },
        },
      },
    },
    Checkbox: {
      baseStyle: {
        control: {
          _checked: {
            bg: "purple.600", // Change the background color when selected
            color: "white",
            borderColor: "blue.800", // Change the border color when selected
            _hover: {
              bg: "purple.400", // Change the background color on hover
              borderColor: "purple.600", // Change the border color on hover
            },
          },
        },
      },
    },
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
      staleTime: 0,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <InternetConnectionProvider>
        <BrowserRouter>
          <ChakraProvider theme={theme}>
            <App />
          </ChakraProvider>
        </BrowserRouter>
      </InternetConnectionProvider>
    </Provider>
  </QueryClientProvider>
);
