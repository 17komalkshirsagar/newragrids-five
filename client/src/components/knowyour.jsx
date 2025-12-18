import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, Building, MapPin, Lock, LogIn } from "lucide-react";

import { useRegisterUserMutation } from "../Redux/user.api";


const handleNavigateToConsumerLogin = () => {
  navigate("/UserLogin", { 
    state: { 
      loginType: "consumer" 
    } 
  });
};
const KnowYour = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  // ✅ NAVIGATE TO CONSUMER LOGIN FUNCTION
  const handleNavigateToConsumerLogin = () => {
    navigate("/UserLogin", { 
      state: { 
        loginType: "consumer" 
      } 
    });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      companyName: "",
      district: ""
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Full Name is required"),
      email: Yup.string().email("Invalid Email").required("Email is required"),
      mobile: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile must be 10 digits")
        .required("Mobile number is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
      companyName: Yup.string().required("Company Name is required"),
      district: Yup.string().required("District is required"),
    }),

    onSubmit: async (values) => {
      try {
        const result = await registerUser(values).unwrap();

        // Success case - Sonner ke saath
        toast.success("🎉 Registration Successful! Redirecting to login...");

        setTimeout(() => navigate("/UserLogin"), 1500);
      } catch (error) {
        // Network errors handle karo
        if (error?.status === 'FETCH_ERROR' || error?.status === 'TIMEOUT_ERROR') {
          toast.error("🌐 Network Error: Please check your internet connection and try again.");
          return;
        }

        // Server response errors handle karo
        if (error?.status === 400) {
          toast.error("❌ Bad Request: Please check your input data.");
          return;
        }

        if (error?.status === 409) {
          toast.error("⚠️ User already exists with this email or mobile number.");
          return;
        }

        if (error?.status === 500) {
          toast.error("🔧 Server Error: Please try again later.");
          return;
        }

        // Specific error messages from backend
        if (error?.data?.message) {
          if (error.data.message === "Provide a Strong Password") {
            toast.error("❌ Please use a strong password that includes uppercase, lowercase, number, and special character.");
          } else {
            toast.error(`❌ ${error.data.message}`);
          }
          return;
        }
        // Generic error messages
        if (error?.error) {
          toast.error(`❌ ${error.error}`);
          return;
        }

        if (error?.data) {
          const errorMsg = typeof error.data === 'string' ? error.data : "Registration failed";
          toast.error(`❌ ${errorMsg}`);
          return;
        }

        // Fallback error
        toast.error("❌ Registration failed. Please try again.");
      }
    },
  });

  // Real-time validation errors dikhane ke liye
  const showFieldError = (fieldName) => {
    return formik.touched[fieldName] && formik.errors[fieldName];
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#FFF8F5] via-white to-[#28B8B4]/10 dark:from-gray-900 dark:to-gray-800">
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-[#28B8B4]/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-[#2D50A1]/10 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-[#F79050]/10 rounded-full blur-lg"></div>

      {/* ✅ TOP RIGHT LOGIN BUTTON */}
      <div className="absolute top-6 right-6 z-10">
        <Button
          onClick={handleNavigateToConsumerLogin}
          variant="outline"
          className="bg-white/80 backdrop-blur-sm border-[#28B8B4]/30 hover:bg-[#28B8B4]/10 hover:border-[#28B8B4]/50 text-[#2D50A1] font-medium px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <LogIn className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
          Already a User? Login Here
        </Button>
      </div>

      <Card className="w-full max-w-4xl shadow-2xl rounded-3xl bg-white dark:bg-gray-800 border border-[#28B8B4]/20 relative">
        {/* Gradient Top Border */}
        <div className="h-2 bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] rounded-t-3xl"></div>

        <CardHeader className="text-center pb-4 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">

            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] bg-clip-text text-transparent">
              NewRa Grids
            </h1>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Business Registration
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Join India's renewable energy revolution
          </p>
        </CardHeader>

        <CardContent className="pb-8">
          <form onSubmit={formik.handleSubmit} onBlur={formik.handleBlur}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* LEFT SIDE - Personal Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-6 bg-gradient-to-b from-[#2D50A1] to-[#28B8B4] rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
                </div>

                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name *</Label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.name}
                      className={`pl-10 py-3 border-2 rounded-xl transition-all duration-300 ${showFieldError('name')
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-200 dark:border-gray-700 focus:border-[#28B8B4] focus:ring-2 focus:ring-[#28B8B4]/20'
                        }`}
                      placeholder="Enter your full name"
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  {showFieldError('name') && (
                    <div className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <span>⚠️</span>
                      {formik.errors.name}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email *</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      className={`pl-10 py-3 border-4 rounded-xl transition-all duration-300 ${showFieldError('email')
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-200 dark:border-gray-700 focus:border-[#28B8B4] focus:ring-2 focus:ring-[#28B8B4]/20'
                        }`}
                      placeholder="Enter your email"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  {showFieldError('email') && (
                    <div className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <span>⚠️</span>
                      {formik.errors.email}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="mobile" className="text-sm font-medium text-gray-700 dark:text-gray-300">Mobile *</Label>
                  <div className="relative">
                    <Input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.mobile}
                      className={`pl-10 py-3 border-2 rounded-xl transition-all duration-300 ${showFieldError('mobile')
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-200 dark:border-gray-700 focus:border-[#28B8B4] focus:ring-2 focus:ring-[#28B8B4]/20'
                        }`}
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  {showFieldError('mobile') && (
                    <div className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <span>⚠️</span>
                      {formik.errors.mobile}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      className={`pl-10 py-3 border-2 rounded-xl transition-all duration-300 ${showFieldError('password')
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-200 dark:border-gray-700 focus:border-[#28B8B4] focus:ring-2 focus:ring-[#28B8B4]/20'
                        }`}
                      placeholder="Create strong password"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  {showFieldError('password') && (
                    <div className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <span>⚠️</span>
                      {formik.errors.password}
                    </div>
                  )}
                  {formik.values.password && !showFieldError('password') && (
                    <div className="text-xs mt-2 text-gray-600 dark:text-gray-400 flex flex-col sm:flex-row sm:items-center gap-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-[#28B8B4] rounded-full"></div>
                        <span>Password must contain uppercase, lowercase, number, and special character.</span>
                      </div>
                      <span className="text-[11px] text-gray-500 sm:ml-2 italic">
                        Example: <span className="font-semibold text-[#28B8B4]">User@123</span>
                      </span>
                    </div>

                  )}
                </div>
              </div>

              {/* RIGHT SIDE - Business Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-6 bg-gradient-to-b from-[#2D50A1] to-[#28B8B4] rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Business Information</h3>
                </div>

                <div>
                  <Label htmlFor="companyName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Company Name *</Label>
                  <div className="relative">
                    <Input
                      id="companyName"
                      name="companyName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.companyName}
                      className={`pl-10 py-3 border-2 rounded-xl transition-all duration-300 ${showFieldError('companyName')
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-200 dark:border-gray-700 focus:border-[#28B8B4] focus:ring-2 focus:ring-[#28B8B4]/20'
                        }`}
                      placeholder="Enter company name"
                    />
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  {showFieldError('companyName') && (
                    <div className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <span>⚠️</span>
                      {formik.errors.companyName}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="district" className="text-sm font-medium text-gray-700 dark:text-gray-300">District *</Label>
                  <div className="relative">
                    <Input
                      id="district"
                      name="district"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.district}
                      className={`pl-10 py-3 border-2 rounded-xl transition-all duration-300 ${showFieldError('district')
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-200 dark:border-gray-700 focus:border-[#28B8B4] focus:ring-2 focus:ring-[#28B8B4]/20'
                        }`}
                      placeholder="Enter your district"
                    />
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  {showFieldError('district') && (
                    <div className="text-red500 text-sm mt-2 flex items-center gap-1">
                      <span>⚠️</span>
                      {formik.errors.district}
                    </div>
                  )}
                </div>

                {/* Benefits Card */}
                <div className="bg-gradient-to-r from-[#28B8B4]/10 to-[#2D50A1]/10 rounded-2xl p-4 border border-[#28B8B4]/20">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Benefits of Joining</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#28B8B4] rounded-full"></div>
                      Save 20-40% on energy costs
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#28B8B4] rounded-full"></div>
                      RPO compliance made easy
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#28B8B4] rounded-full"></div>
                      Zero Capex investment
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 py-3 bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] hover:from-[#2D50A1] hover:to-[#28B8B4] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Registering...
                </div>
              ) : (
                "Register Business"
              )}
            </Button>

<div className="absolute top-6 right-6 z-10">
  <Button
    onClick={handleNavigateToConsumerLogin}
    variant="outline"
    className="bg-white/80 backdrop-blur-sm border-[#28B8B4]/30 hover:bg-black hover:text-white hover:border-black text-[#2D50A1] font-medium px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
  >
    <LogIn className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
    Already a User? Login Here
  </Button>
</div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowYour;