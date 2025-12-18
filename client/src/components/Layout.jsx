import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function Layout({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // ❌ jya pages la navbar/footer nahi pahije
  const hideLayoutRoutes = [
    "/UserLogin",
    "/admin-login",
    "/partner-Dash",
    "/Associate-Dash",
    "/epc-dashboard",
    "/assoceproflle",
    "/epcprofile",
    "/UserProfile",
    "/UserForm",
  ];

  const hideLayout = hideLayoutRoutes.includes(pathname);

  // 🔙 jya pages la back button nahi pahije
  const hideBackButtonRoutes = [
    "/", 
    "/UserLogin",
    "/admin-login",
  ];

  const hideBackButton = hideBackButtonRoutes.includes(pathname);

  return (
    <div className="flex min-h-screen w-full flex-col relative">

      {/* 🔙 GLOBAL BACK BUTTON */}
      {!hideBackButton && (
        <button
          onClick={() => navigate(-1)}
          className="
            fixed top-4 left-4 z-50
            flex items-center gap-2
            px-3 py-2
            bg-white/80 backdrop-blur
            border border-gray-200
            rounded-full
            shadow-sm
            hover:bg-white
            transition
          "
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>
      )}

      {!hideLayout && <Navbar />}

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="flex-1 w-full"
      >
        {children}
      </motion.main>

      {!hideLayout && <Footer />}
    </div>
  );
}
