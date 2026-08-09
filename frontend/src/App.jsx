import { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import CookieServices from "./services/CookieServices";
import Popup from "./components/Popup";
import Loading from "./components/Loading";
import BackToTopButton from "./shared/BackToTop";

const AppLayout = lazy(() => import("./layout/AppLayout"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Cart = lazy(() => import("./pages/Cart"));
const WishlistPage = lazy(() => import("./pages/Wishlist"));
const ComparePage = lazy(() => import("./pages/Compare"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const ProductsCategory = lazy(() => import("./pages/ProductsCategory"));
const Checkout = lazy(() => import("./pages/Checkout"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentCancel = lazy(() => import("./pages/PaymentCancel"));

const DashboardLayout = lazy(() => import("./pages/dashboard/DashboardLayout"));
const DashboardProducts = lazy(() =>
  import("./pages/dashboard/DashboardProducts")
);
const DashboardCategories = lazy(() =>
  import("./pages/dashboard/DashboardCategories")
);
const DashboardReviews = lazy(() =>
  import("./pages/dashboard/DashboardReviews")
);
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const DashboardUsers = lazy(() => import("./pages/dashboard/DashboardUsers"));
const DiscountedProducts = lazy(() => import("./pages/DiscountedProducts"));

const App = () => {
  const token = CookieServices.get("jwt");

  const [isOpen, setIsOpen] = useState(false);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     // Check login status and show popup if user is not logged in
  //     setIsOpen(true);
  //   }, 5000); // Show popup after 5 seconds

  //   return () => clearTimeout(timer);
  // }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* {!token && <Popup isOpen={isOpen} onClose={handleClose} />} */}

      <BackToTopButton />

      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route
              path="/products/offers/discounts"
              element={<DiscountedProducts />}
            />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route
              path="products/categories/:category"
              element={<ProductsCategory />}
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/userProfile" element={<UserProfile />} />
          </Route>

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<DashboardProducts />} />
            <Route path="categories" element={<DashboardCategories />} />
            <Route path="reviews" element={<DashboardReviews />} />
            <Route path="users" element={<DashboardUsers />} />
          </Route>

          <Route path="/Signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
