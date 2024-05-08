import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./App";

const useAuth = () => {
    const { user } = useContext(UserContext);
  return user && user.loggedIn;
};

const ProtectedRoutes = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;