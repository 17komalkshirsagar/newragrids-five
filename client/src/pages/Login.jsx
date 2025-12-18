import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  LogIn,
  Eye,
  EyeOff,
  User,
  Building,
  Shield,
  Zap,
  Leaf,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import Lottie from "lottie-react";
import loginAnimation from "../assets/Login.json";

import { useLoginUserMutation } from "../Redux/user.api";
import { useAuth } from "@/contexts/AuthContext";
import {
  useAssociateLoginMutation,
  usePartnerLoginMutation,
} from "../Redux/associates.api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("consumer");
  const [isAccountSelected, setIsAccountSelected] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [associateLogin, { isLoading: isAssociateLoading }] = useAssociateLoginMutation();
  const [partnerLogin, { isLoading: isPartnerLoading }] = usePartnerLoginMutation();
  const [loginUser, { isLoading: isConsumerLoading }] = useLoginUserMutation();

  // 🔥 COMBINE ALL LOADING STATES
  const isLoading = isConsumerLoading || isPartnerLoading || isAssociateLoading;

  useEffect(() => {
  console.log("📍 Location state received:", location.state);
  console.log("📍 Current path:", location.pathname);
  
  if (location.state?.loginType) {
    console.log("✅ Login type received:", location.state.loginType);
    setUserType(location.state.loginType);
    setIsAccountSelected(true);
  }
}, [location.state]);
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    onSubmit: async (values) => {
      try {
        if (userType === "partner") {
          await partnerLogin(values).unwrap();
          toast.success("Partner Login Successful");
          navigate("/partner-dash");
          return;
        }

        if (userType === "associate") {
          await associateLogin(values).unwrap();
          toast.success("Associate Login Successful");
          navigate("/Associate-Dash");
          return;
        }

        const res = await loginUser(values).unwrap();
        login(res.data, res.token);
        toast.success("Login Successful");
        navigate("/UserProfile");
      } catch {
        toast.error("Invalid Email or Password");
      }
    },
  });

  const handleQuickLogin = (type) => {
    setUserType(type);
    setIsAccountSelected(true);
    const demo = {
      consumer: { email: "consumer@example.com", password: "demo123" },
      partner: { email: "partner@newra.com", password: "demo123" },
      associate: { email: "associate@newra.com", password: "demo123" },
    };
    if (demo[type]) formik.setValues(demo[type]);
  };

const handleBackToSelection = () => {
  navigate("/choose-account-type");
};


  useEffect(() => {
    if (location.state?.loginType) {
      setUserType(location.state.loginType);
      setIsAccountSelected(true);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 px-4 py-8">
      <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] -z-10" />
      
      <div className="relative w-full max-w-6xl">
        {/* Floating Background Elements */}
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-300/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-emerald-300/10 rounded-full blur-3xl"></div>
        
        {/* Main Content Container */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-4xl shadow-2xl border border-white/50 p-8 md:p-12">
          
          {!isAccountSelected ? (
            /* Account Selection View */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Animation Section */}
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-blue-50 to-emerald-50/50 rounded-3xl p-8 shadow-lg border border-white/50">
                  <Lottie 
                    animationData={loginAnimation} 
                    loop 
                    className="h-72 mx-auto" 
                  />
                  <div className="flex items-center justify-center gap-3 mt-6">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border">
                      <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
                      <span className="text-sm font-medium text-slate-700">Interactive Experience</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-white to-blue-50 p-5 rounded-2xl border border-blue-100 flex items-center gap-4 group hover:scale-[1.02] transition-transform duration-300">
                    <div className="p-2.5 bg-blue-500/10 rounded-xl">
                      <Zap className="w-6 h-6 text-blue-500" />
                    </div>
                    <span className="font-semibold text-slate-700">24/7 Access</span>
                  </div>
                  <div className="bg-gradient-to-br from-white to-emerald-50 p-5 rounded-2xl border border-emerald-100 flex items-center gap-4 group hover:scale-[1.02] transition-transform duration-300">
                    <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                      <Leaf className="w-6 h-6 text-emerald-500" />
                    </div>
                    <span className="font-semibold text-slate-700">Secure Login</span>
                  </div>
                </div>
              </div>

              {/* Right Selection Section */}
              <div className="space-y-8">
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full mb-4">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-600">Welcome Back</span>
                  </div>
                  <h1 className="text-4xl font-bold text-slate-900 mb-3">
                    Continue Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Journey</span>
                  </h1>
                  <p className="text-slate-500 text-lg">Choose your account type to proceed</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {[
                    { 
                      value: "consumer", 
                      label: "Consumer", 
                      icon: <User />, 
                      desc: "Personal account",
                      color: "from-blue-500 to-cyan-500"
                    },
                    { 
                      value: "partner", 
                      label: "Partner", 
                      icon: <Building />, 
                      desc: "Business account",
                      color: "from-emerald-500 to-teal-500"
                    },
                    { 
                      value: "associate", 
                      label: "Associate", 
                      icon: <Shield />, 
                      desc: "Team account",
                      color: "from-violet-500 to-purple-500"
                    },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => handleQuickLogin(item.value)}
                      className="group relative bg-gradient-to-b from-white to-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 text-center hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl from-blue-500/5 to-emerald-500/5" />
                      <div className={`mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        {item.icon}
                      </div>
                      <p className="font-bold text-lg text-slate-900 mb-1">{item.label}</p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="text-center lg:text-left pt-6 border-t border-slate-200/50">
                  <p className="text-slate-600 mb-3">New to NewRa Energy?</p>
                  <Link
                    to="/choose-account-type"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
                  >
                    <span>Create New Account</span>
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Sparkles className="w-3 h-3" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Login Form View */
            <div className="max-w-md mx-auto">
              <button
                onClick={handleBackToSelection}
                className="group flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to selection</span>
              </button>

              <Card className="rounded-3xl shadow-2xl border border-white/50 bg-gradient-to-b from-white to-slate-50/50 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-violet-500" />
                <CardHeader className="text-center space-y-3 pt-8">
                  <div className="inline-flex items-center justify-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-emerald-50/50 border border-blue-100">
                    <div className={`p-2 rounded-xl ${
                      userType === "consumer" ? "bg-blue-100 text-blue-600" :
                      userType === "partner" ? "bg-emerald-100 text-emerald-600" :
                      "bg-violet-100 text-violet-600"
                    }`}>
                      {userType === "consumer" && <User className="w-6 h-6" />}
                      {userType === "partner" && <Building className="w-6 h-6" />}
                      {userType === "associate" && <Shield className="w-6 h-6" />}
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-slate-900">
                        {userType === "consumer" && "Consumer Login"}
                        {userType === "partner" && "Partner Login"}
                        {userType === "associate" && "Associate Login"}
                      </CardTitle>
                      <CardDescription className="text-slate-500">
                        Sign in to your dashboard
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 pb-8">
                  <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-medium">Email Address</Label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors">
                          <Mail className="w-5 h-5" />
                        </div>
                        <Input
                          name="email"
                          onChange={formik.handleChange}
                          value={formik.values.email}
                          className="pl-12 h-12 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-medium">Password</Label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors">
                          <Lock className="w-5 h-5" />
                        </div>
                        <Input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          onChange={formik.handleChange}
                          value={formik.values.password}
                          className="pl-12 pr-12 h-12 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full h-12 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden ${
                        userType === "consumer" ? "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600" :
                        userType === "partner" ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600" :
                        "bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-700 hover:to-purple-600"
                      }`}
                    >
                      {isLoading ? (
                        <>
                          {/* 🔥 ANIMATED BACKGROUND EFFECT DURING LOADING */}
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 animate-shimmer"></div>
                          
                          <div className="flex items-center justify-center gap-2 relative z-10">
                            <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            <span>Signing In...</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <LogIn className="w-5 h-5 mr-2" />
                          Sign In
                        </>
                      )}
                    </Button>
                  </form>

                 
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;