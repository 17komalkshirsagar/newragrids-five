import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Layout } from "@/components/Layout";
import { useEffect } from "react";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Calculator from "./pages/Calculator";
import Contact from "./pages/Contact";
import KnowYour from "./components/knowyour";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";

// Admin
import AdminLogin from "./components/Auth/AdminLogin";
import AdminData from "./components/Auth/AdminData";
import AdminProtectedRoute from "./contexts/AdminProtectedRoute";

// Auth Contexts
import { AuthProvider } from "./contexts/AuthContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";

// Registration Pages
import ChooseAccountType from "./components/ChooseAccountType";
import EnergyPartnerForm from "./components/AccountType/EnergyPartnerForm";
import EnergyAssociateForm from "./components/AccountType/EnergyAssociateForm";
import EnergySubscriberForm from "./components/AccountType/EnergySubscriberForm ";

// Dashboards
import AssociateDash from "./components/Dashboard/AssociateDash";
import EpcProfile from "./components/AccountType/epc/EpcProfile";
import PartnerDashboard from "./components/Dashboard/PartnerDashboard";
import EpcDashboard from "./components/AccountType/epc/EpcDashboard";
import AssocProfile from "./components/Dashboard/AssocProfile";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), [pathname]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="ragrids-theme">
      <TooltipProvider>
        <Toaster position="top-right" />

        <AuthProvider>
          <AdminAuthProvider>

            <ScrollToTop />

            <Routes>

              {/* PUBLIC ROUTES */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/calculator" element={<Layout><Calculator /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/admin-login" element={<Layout><AdminLogin /></Layout>} />
              <Route path="/UserLogin" element={<Layout><Login /></Layout>} />

              {/* REGISTRATION FLOW */}
              <Route path="/choose-account-type" element={<Layout><ChooseAccountType /></Layout>} />
              <Route path="/UserForm" element={<Layout><KnowYour /></Layout>} />
              <Route path="/register/energy-partner" element={<Layout><EnergyPartnerForm /></Layout>} />
              <Route path="/register/energy-associate" element={<Layout><EnergyAssociateForm /></Layout>} />
              <Route path="/register/energy-subscriber" element={<Layout><EnergySubscriberForm /></Layout>} />

              {/* 🔐 ONLY ADMIN REMAINS PROTECTED */}
              <Route
                path="/data"
                element={
                  <AdminProtectedRoute>
                    <Layout><AdminData /></Layout>
                  </AdminProtectedRoute>
                }
              />

              {/* 🔓 ALL OTHER DASHBOARD ROUTES ARE NOW PUBLIC */}

              <Route
                path="/partner-Dash"
                element={
                  <Layout><PartnerDashboard /></Layout>
                }
              />

              <Route
                path="/Associate-Dash"
                element={
                  <Layout><AssociateDash /></Layout>
                }
              />

              <Route
                path="/epc-dashboard"
                element={
                  <Layout><EpcDashboard /></Layout>
                }
              />

              <Route
                path="/assoceproflle"
                element={
                  <Layout><AssocProfile /></Layout>
                }
              />

              <Route
                path="/epcprofile"
                element={
                  <Layout><EpcProfile /></Layout>
                }
              />

              <Route
                path="/UserProfile"
                element={
                  <Layout><UserProfile /></Layout>
                }
              />

            </Routes>
          </AdminAuthProvider>
        </AuthProvider>

      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
