import { Navigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getMyUser } from "../services/apiUsers";

const ProtectedRoute = ({ children }) => {
  const { data } = useQuery("myUser", getMyUser);

  if (data?.data.user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
