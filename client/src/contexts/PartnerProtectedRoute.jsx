import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PartnerProtectedRoute = ({ children }) => {
  const partner = useSelector((state) => state.associatePartner?.user);

  if (!partner) return <Navigate to="/partner-dash" replace />;

  return children;
};

export default PartnerProtectedRoute;
