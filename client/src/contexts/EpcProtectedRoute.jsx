import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const EpcProtectedRoute = ({ children }) => {
  const epc = useSelector((state) => state.epc?.user);

  if (!epc) return <Navigate to="/UserLogin" replace />;

  return children;
};

export default EpcProtectedRoute;
