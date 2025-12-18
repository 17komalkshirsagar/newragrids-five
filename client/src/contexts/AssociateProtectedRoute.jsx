import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AssociateProtectedRoute = ({ children }) => {
  const associate = useSelector((state) =>state.associatePartner?.user?.associate);

  if (!associate) return <Navigate to="/UserLogin" replace />;

  return children;
};

export default AssociateProtectedRoute;
