import { format } from "date-fns";

export const addItemToShoppingCart = (
  cartItem = {},
  shoppingCartItems = []
) => {
  const existsItem = shoppingCartItems.find(
    (item) => item.data.product.id === cartItem.id
  );

  if (existsItem) {
    return shoppingCartItems.map((item) =>
      item.data.product.id === cartItem.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }

  return [...shoppingCartItems, { ...cartItem, quantity: 1 }];
};

export const formatPrice = (price) => {
  const numericPrice = Number(price);

  const formatedPrice = numericPrice.toLocaleString("ar-EG", {
    style: "currency",
    currency: "EGP",
  });
  return formatedPrice;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  return format(date, "dd/MM/yyyy HH:mm");
};

export const textSlicer = (txt, max = 50) => {
  if (txt.length >= max) return `${txt.slice(0, max)}...`;
  return txt;
};
