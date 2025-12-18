import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import {
  Leaf,
  DollarSign,
  Shield,
  TrendingUp,
  Star,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Play,
  Pause,
  Zap,
  Calculator,
  PlayCircle,
  Sparkles,
  CheckCircle
} from "lucide-react";
import About from "./About";
import KnowYour from "../components/knowyour";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef(null);

  const slides = [
  {
    id: 1,
    title: "Powering the Green Shift",
    description: "NewRa Grids transforms how industries and businesses consume energy with green, reliable, and cost-effective power solutions.",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2072",
    button1: "Get Started",
    path: "/choose-account-type",
  },
  {
    id: 2,
    title: "Energy as Automated | Affordable | Sustainable service",
    description: " GEOA and Virtual Power Purchase models.",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2070",
    button1: "Get Started",
    path: "/choose-account-type",
  },
  {
    id: 3,
    title: "Join Maharashtra's Renewable Future",
    description: "Be part of Maharashtra's mission toward a 500 GW renewable future with our fully digital, subscription-based ecosystem.",
    image: "https://images.unsplash.com/photo-1589201529153-5297335c1684?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1332",
    button1: "Get Started",
    path: "/choose-account-type",
  }
];


  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const benefits = [
    {
      icon: DollarSign,
      title: "Save on Energy Bills",
      description: "Reduce your power cost by 20-40% compared to MSEDCL tariffs.",
    },
    {
      icon: TrendingUp,
      title: "Boost Profit Margins",
      description: "Redirect savings into your business or reduce product cost for competitive advantage.",
    },
    {
      icon: Shield,
      title: "Stay Compliant",
      description: "Meet Renewable Purchase Obligation (RPO) norms effortlessly.",
    },
    {
      icon: Leaf,
      title: "Go Carbon Neutral",
      description: "Each unit of green energy replaces fossil power, cutting your carbon footprint.",
    },
  ];



  const goToSlide = (index) => {
    setCurrentSlide(index);
  };



  return  <>
      <div className="flex flex-col w-full">


        <section className="relative w-full h-[80vh] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(
                  rgba(9, 25, 60, 0.7),
                  rgba(9, 25, 60, 0.8)
                ), url('${slides[currentSlide].image}')`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hidden md:block"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hidden md:block"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3 hidden md:flex">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-[#28B8B4] scale-125' : 'bg-white/50'
                  }`}
              />
            ))}
          </div>

          {/* Content - Centered */}
          <div className="relative z-10 container mx-auto max-w-7xl px-4 h-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center text-white w-full max-w-4xl mx-auto"
              >
                {/* Stats Badge - Centered */}
        

                {/* Heading - Centered */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-center">
                  {slides[currentSlide].title}
                </h1>

                {/* Description - Centered */}
                <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-10 leading-relaxed text-center mx-auto max-w-3xl">
                  {slides[currentSlide].description}
                </p>

                {/* CTA Buttons - Centered */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    asChild
                    size="lg"
                    className="text-lg px-8 py-6 bg-[#2D50A1] hover:bg-[#1a3a8a] text-white border-0 shadow-2xl hover:shadow-[#2D50A1]/25 hover:scale-105 transition-all duration-300 group"
                  >
                      <Link to="/choose-account-type" className="flex items-center">
                      {currentSlide === 1 ? <Play className="mr-2 h-5 w-5" /> : <Calculator className="mr-2 h-5 w-5" />}
                      {slides[currentSlide].button1}
                    </Link>
                  </Button>


                </div>

            
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#09193C] to-transparent z-10"></div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 w-full bg-[#FFF8F5] dark:bg-gray-900">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] bg-clip-text text-transparent">
                Why Choose NewRa Grids?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Transform your energy consumption with our automated, sustainable power solutions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="relative group">
                  {/* Circular Card */}
                  <div className="relative bg-white dark:bg-gray-800 rounded-full w-64 h-64 mx-auto p-8 shadow-xl border border-[#28B8B4]/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">

                    {/* Icon Circle */}
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-[#2D50A1] to-[#28B8B4] rounded-full flex items-center justify-center shadow-lg">
                      <benefit.icon className="h-8 w-8 text-white" />
                    </div>

                    {/* Content */}
                    <div className="h-full flex flex-col items-center justify-center text-center pt-6">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 leading-tight">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>

                    {/* Outer Glow Effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#28B8B4]/10 to-[#2D50A1]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Connecting Lines for Desktop */}
                  {index < benefits.length - 1 && (
                    <>
                      <div className="hidden lg:block absolute top-1/2 right-0 w-8 h-0.5 bg-gradient-to-r from-[#28B8B4]/30 to-[#2D50A1]/30 transform translate-x-4 -translate-y-1/2 z-0"></div>
                      <div className="hidden lg:block absolute top-1/2 right-0 w-2 h-2 bg-[#28B8B4] rounded-full transform translate-x-4 -translate-y-1/2 z-10"></div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-16">
              <div className="inline-flex items-center gap-4 bg-white dark:bg-gray-800 rounded-full px-8 py-4 shadow-lg border border-[#28B8B4]/30">
                <div className="w-3 h-3 bg-[#28B8B4] rounded-full animate-pulse"></div>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Start your green energy journey today • Save 20-40% on power costs
                </p>
                <div className="w-3 h-3 bg-[#28B8B4] rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="relative py-20 px-4 w-full">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] transform -skew-x-12 p-12 rounded-2xl shadow-2xl"
            >
              <div className="transform skew-x-2 text-center text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Powering the Green Shift
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                  NewRa Grids is a new-age climate-tech company transforming how industries and businesses consume energy through Open Access and GEOA models.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="bg-white text-[#2D50A1] hover:bg-blue-50 border-white px-8 py-6 text-lg font-semibold"
                >
                  <Link to="/about">Learn More About Us</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-white dark:bg-gray-900">
          <div className="absolute inset-0 bg-[#FFF8F5] dark:bg-gray-800">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#28B8B4]/10 via-transparent to-transparent"></div>
          </div>

          <div className="relative z-10 container mx-auto max-w-7xl px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-left"
              >
                <div className="inline-flex items-center gap-2 bg-[#28B8B4]/10 text-[#2D50A1] dark:text-[#28B8B4] px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Sparkles className="h-4 w-4" />
                  Maharashtra's Leading Energy Partner
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                  Automated Energy Solutions for <span className="text-[#2D50A1] dark:text-[#28B8B4]">Modern Industries</span>
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  We aggregate industrial and commercial consumers with renewable energy partners through a fully digital, subscription-based ecosystem.
                </p>

                {/* Features List */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    "Zero Capex Investment",
                    "RPO Compliance",
                    "AI-Powered Dashboard",
                    "Automated Billing"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-[#28B8B4]" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-[#2D50A1] hover:bg-[#1a3a8a] text-white px-8 py-6 text-lg shadow-lg"
                  >
                    <Link to="/">
                      Get Free Quote
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-[#2D50A1] text-[#2D50A1] hover:bg-[#2D50A1]/10 px-8 py-6 text-lg"
                  >
                    <Link to="/">
                      View Projects
                    </Link>
                  </Button>
                </div>
              </motion.div>

              {/* Right Visual */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.1.0&auto=format&fit=crop&q=80"
                    alt="Solar Panels"
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09193C]/20 to-transparent"></div>
                </div>

                {/* Floating Stats Card */}
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border border-[#28B8B4]/20">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#28B8B4]">20-40%</div>
                    <div className="text-gray-600 dark:text-gray-300">Cost Savings</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>



      </div>

      <About />
    </>
  
};

export default Home;