import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useSignInMutation } from '../../Redux/admin.api'; // adjust path
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [animationData, setAnimationData] = useState(null);
  const [isDark, setIsDark] = useState(false);

  const [signIn, { isLoading }] = useSignInMutation();

  // Load animation
  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const response = await fetch('/logindvdvd.json');
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error('Animation load error:', error);
        setAnimationData(null);
      }
    };
    loadAnimation();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const adminData = await signIn({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      // ✅ AdminAuthContext mein login karo
      login({
        id: adminData.id || 1,
        email: formData.email,
        name: adminData.name || 'Admin User',
        role: 'admin'
      });

      // ✅ Success toast
      toast.success('Login successful!');

      // ✅ Redirect to /data after 1s
      setTimeout(() => navigate('/data'), 1000);
    } catch (error) {
      console.error('Login failed:', error);
      
      // ❌ Error toast
      let errorMessage = 'Invalid credentials!';
      
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error) {
        errorMessage = error.error;
      }
      
      toast.error(errorMessage);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#FFF8F5] via-white to-[#28B8B4]/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex transition-colors duration-300`}>

      {/* Left Side - Animation */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 relative">
        {animationData && <Lottie animationData={animationData} loop autoplay />}
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <motion.div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <motion.h2 className="text-4xl font-black bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] bg-clip-text text-transparent mb-3">Admin Portal</motion.h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">Sign in to access your dashboard</p>
          </div>

          <form className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border border-[#28B8B4]/20 space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-2 text-lg font-bold text-gray-800 dark:text-gray-200">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-lg dark:bg-gray-700 dark:text-white focus:border-[#28B8B4] focus:ring-2 focus:ring-[#28B8B4]/20 transition-all duration-300"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block mb-2 text-lg font-bold text-gray-800 dark:text-gray-200">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-lg dark:bg-gray-700 dark:text-white focus:border-[#28B8B4] focus:ring-2 focus:ring-[#28B8B4]/20 transition-all duration-300 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-[#28B8B4] transition-colors duration-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="mr-2 w-4 h-4 text-[#28B8B4] focus:ring-[#28B8B4] border-gray-300 rounded"
                />
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] hover:from-[#2D50A1] hover:to-[#28B8B4] text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 border-0"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;