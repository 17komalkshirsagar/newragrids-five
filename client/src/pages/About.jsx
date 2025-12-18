import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Target, Eye, Heart, Lightbulb, Users, Award, TrendingUp, MapPin, UserCheck, IndianRupee, Zap, Leaf, Shield, Cpu, Scale, ArrowRight, Handshake, Cloud, TreePine } from "lucide-react";
import { useEffect, useState } from "react";
import solarFarmImage from '../assets/solarfarm.jpg';

export default function About() {
  const [counterValues, setCounterValues] = useState({
    customers: 0,
    capacity: 0,
    cities: 0,
    savings: 0
  });

  const values = [
    {
      icon: Heart,
      title: "Reliability",
      description: "We deliver consistent, dependable energy solutions you can trust",
      color: "text-[#F79050]",
      bgColor: "bg-[#F79050]/10"
    },
    {
      icon: Target,
      title: "Affordability",
      description: "Making renewable energy accessible to all with competitive pricing",
      color: "text-[#28B8B4]",
      bgColor: "bg-[#28B8B4]/10"
    },
    {
      icon: Lightbulb,
      title: "Sustainability",
      description: "Committed to reducing carbon footprint and protecting our planet",
      color: "text-[#2D50A1]",
      bgColor: "bg-[#2D50A1]/10"
    },
    {
      icon: Award,
      title: "Innovation",
      description: "Leading with cutting-edge technology and modern solutions",
      color: "text-[#09193C]",
      bgColor: "bg-[#09193C]/10"
    },
  ];

  const stats = [
    {
      value: "15000+",
      label: "Happy Customers",
      icon: UserCheck,
      color: "text-[#28B8B4]",
      suffix: "+",
      duration: 2000
    },
    {
      value: "15",
      label: "Installed Capacity",
      icon: TrendingUp,
      color: "text-[#2D50A1]",
      suffix: "MW",
      duration: 2500
    },
    {
      value: "20",
      label: "Cities Served",
      icon: MapPin,
      color: "text-[#09193C]",
      suffix: "+",
      duration: 1500
    },
    {
      value: "500",
      label: "Savings Generated",
      icon: IndianRupee,
      color: "text-[#F79050]",
      suffix: "Cr",
      duration: 3000
    },
  ];

  useEffect(() => {
    const animateCounters = () => {
      const finalValues = {
        customers: 30,
        capacity: 100,
        cities: 20,
        savings: 50
      };

      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;

        setCounterValues({
          customers: Math.floor(finalValues.customers * progress),
          capacity: Number((finalValues.capacity * progress).toFixed(1)),
          cities: Math.floor(finalValues.cities * progress),
          savings: Math.floor(finalValues.savings * progress)
        });

        if (step >= steps) {
          clearInterval(timer);
        }
      }, stepDuration);
    };

    // Start animation when component mounts
    animateCounters();
  }, []);

  const Counter = ({ value, suffix, color, icon: Icon, label, duration }) => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          duration: 0.5
        }}
        className="text-center group"
      >
        <motion.div
          className="flex flex-col items-center p-4 sm:p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-[#28B8B4]/20 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
          whileHover={{ y: -5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`p-2 sm:p-3 rounded-full ${color} bg-opacity-10 dark:bg-opacity-20 mb-3 sm:mb-4`}
          >
            <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className={`text-2xl sm:text-3xl md:text-4xl font-bold ${color} mb-1 sm:mb-2`}
          >
            {value}{suffix}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 dark:text-gray-300 font-medium text-xs sm:text-sm uppercase tracking-wide px-1"
          >
            {label}
          </motion.div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#FFF8F5] dark:bg-gray-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#28B8B4]/10 to-[#2D50A1]/10 dark:from-[#28B8B4]/20 dark:to-[#2D50A1]/20" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute top-4 right-4 sm:top-10 sm:right-10 w-12 h-12 sm:w-20 sm:h-20 bg-[#F79050] rounded-full blur-xl opacity-20"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute bottom-4 left-4 sm:bottom-10 sm:left-10 w-10 h-10 sm:w-16 sm:h-16 bg-[#28B8B4] rounded-full blur-xl opacity-20"
        />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[#28B8B4] to-[#2D50A1] bg-clip-text text-transparent"
            >
              About NewRa Grids
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed px-2 sm:px-0"
            >
              Leading India's transition to sustainable energy solutions with innovation and reliability
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 sm:py-16 md:py-24 px-4 w-full bg-[#FFF8F5] dark:bg-[#09193C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#28B8B4]/20 text-[#09193C] dark:text-white text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-[#28B8B4]" />
              Powering India's Green Future
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#09193C] dark:text-white mb-4 sm:mb-6 px-2">
              Building a <span className="text-[#28B8B4]">Smarter</span> Energy Ecosystem
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#2D50A1] dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              Driving India's renewable revolution through automation, innovation, and sustainable partnerships
            </p>
          </motion.div>

          {/* Mission & Vision Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16 md:mb-20 lg:mb-24">
            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-br from-[#28B8B4] to-[#2D50A1] rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
              <div className="relative bg-white dark:bg-[#09193C] rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-[#28B8B4]/20 dark:border-[#28B8B4]/30 group-hover:shadow-3xl transition-all duration-500 h-full flex flex-col">
                <div className="flex items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#28B8B4] to-[#2D50A1] rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <Target className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#09193C] dark:text-white mb-2">Our Mission</h3>
                    <div className="w-8 sm:w-10 md:w-12 h-1 bg-gradient-to-r from-[#28B8B4] to-[#2D50A1] rounded-full"></div>
                  </div>
                </div>
                <p className="text-[#2D50A1] dark:text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed flex-grow">
                  To democratize access to clean energy by delivering automated, affordable, and sustainable power solutions and enabling every enterprise to reduce costs, meet RPO norms, and accelerate India's transition to a carbon-neutral future.
                </p>
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[#28B8B4]/20">
                  <div className="flex items-center gap-2 sm:gap-3 text-[#28B8B4] font-semibold text-sm sm:text-base group-hover:gap-3 sm:group-hover:gap-4 transition-all duration-300">
                    <span>Explore our impact</span>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-br from-[#F79050] to-[#2D50A1] rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
              <div className="relative bg-white dark:bg-[#09193C] rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-[#F79050]/20 dark:border-[#F79050]/30 group-hover:shadow-3xl transition-all duration-500 h-full flex flex-col">
                <div className="flex items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#F79050] to-[#2D50A1] rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <Eye className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#09193C] dark:text-white mb-2">Our Vision</h3>
                    <div className="w-8 sm:w-10 md:w-12 h-1 bg-gradient-to-r from-[#F79050] to-[#2D50A1] rounded-full"></div>
                  </div>
                </div>
                <p className="text-[#2D50A1] dark:text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed flex-grow">
                  To become India's most trusted digital renewable-energy platform, empowering industries and communities to experience energy not as a commodity, but as a shared and automated service that powers growth responsibly.
                </p>
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[#F79050]/20">
                  <div className="flex items-center gap-2 sm:gap-3 text-[#F79050] font-semibold text-sm sm:text-base group-hover:gap-3 sm:group-hover:gap-4 transition-all duration-300">
                    <span>See our roadmap</span>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Our Contribution Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 sm:mb-16 md:mb-20 lg:mb-24"
          >
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] bg-clip-text text-transparent px-2">
                Our Environmental Impact
              </h3>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#2D50A1] dark:text-gray-400 max-w-2xl mx-auto px-4">
                Quantifying our contribution to a cleaner, greener planet
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              {/* Carbon Emission Reduction */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-br from-[#28B8B4] to-[#2D50A1] rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
                <div className="relative bg-white dark:bg-[#09193C] rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-[#28B8B4]/20 dark:border-[#28B8B4]/30 group-hover:shadow-3xl transition-all duration-500 h-full">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#28B8B4] to-[#2D50A1] rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <Cloud className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
                    </div>
                    <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-[#09193C] dark:text-white">Carbon Emission Reduction</h4>
                  </div>

                  <p className="text-[#2D50A1] dark:text-gray-300 text-sm sm:text-base md:text-lg mb-4 sm:mb-6">
                    For every unit (kWh) of renewable electricity used, we avoid the grid's average emission factor.
                  </p>

                  <div className="bg-[#28B8B4]/10 rounded-xl p-4 sm:p-6 border border-[#28B8B4]/20">
                    <h5 className="font-semibold text-[#09193C] dark:text-white mb-2 sm:mb-3 text-sm sm:text-base">Example Calculation:</h5>
                    <p className="text-[#2D50A1] dark:text-gray-300 mb-2 text-sm sm:text-base">
                      A <span className="font-bold text-[#28B8B4]">1 MW plant</span> generating <span className="font-bold text-[#28B8B4]">1,600 MWh/year</span> avoids:
                    </p>
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#28B8B4] mb-1 sm:mb-2">
                      1,312 tons CO₂
                    </div>
                    <p className="text-[#2D50A1] dark:text-gray-300 text-xs sm:text-sm">
                      emission reduction per year
                    </p>
                    <div className="mt-2 sm:mt-3 text-xs text-[#2D50A1] dark:text-gray-400">
                      Calculation: 1,600 × 0.82 = 1,312 tons CO₂
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Tree Equivalent Sustainability */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-br from-[#F79050] to-[#2D50A1] rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
                <div className="relative bg-white dark:bg-[#09193C] rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-[#F79050]/20 dark:border-[#F79050]/30 group-hover:shadow-3xl transition-all duration-500 h-full">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#F79050] to-[#2D50A1] rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <TreePine className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
                    </div>
                    <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-[#09193C] dark:text-white">Tree Equivalent Sustainability</h4>
                  </div>

                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <p className="text-[#2D50A1] dark:text-gray-300 text-sm sm:text-base md:text-lg">
                      1 mature tree absorbs about <span className="font-bold text-[#F79050]">22 kg CO₂</span> per year (≈ 0.022 tons).
                    </p>
                    <div className="bg-[#F79050]/10 rounded-xl p-3 sm:p-4 border border-[#F79050]/20">
                      <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#F79050] mb-1 sm:mb-2">
                        1 MWh ≈ 37 Trees
                      </div>
                      <p className="text-[#2D50A1] dark:text-gray-300 text-xs sm:text-sm">
                        of renewable energy equals the carbon absorption of 37 mature trees
                      </p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#09193C] rounded-lg p-3 sm:p-4 border border-[#28B8B4]/20">
                    <p className="text-[#2D50A1] dark:text-gray-300 text-xs sm:text-sm">
                      <span className="font-bold text-[#28B8B4]">1 MWh</span> of renewable energy ≈
                      <span className="font-bold text-[#28B8B4]"> 0.82 t CO₂</span> saved ≈
                      <span className="font-bold text-[#F79050]"> 37 trees</span> planted
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 px-4 bg-gradient-to-r from-[#28B8B4]/5 to-[#2D50A1]/5 dark:from-[#28B8B4]/10 dark:to-[#2D50A1]/10 w-full">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-[#28B8B4] to-[#2D50A1] bg-clip-text text-transparent">
              Our Impact in Numbers
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              Driving India's energy transformation with measurable results and sustainable impact
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 max-w-6xl mx-auto">
            {/* Left Side - Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={solarFarmImage}
                  alt="Our Impact Visualization"
                  className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09193C]/20 to-transparent"></div>
              </div>
            </motion.div>

            {/* Right Side - Counter Boxes */}
            <div className="w-full lg:w-1/2">
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-6">
                <Counter
                  value={counterValues.customers}
                  suffix="+"
                  label="Happy Customers"
                  icon={UserCheck}
                  color="text-[#28B8B4]"
                  duration={2000}
                />
                <Counter
                  value={counterValues.capacity}
                  suffix="MW"
                  label="Installed Capacity"
                  icon={TrendingUp}
                  color="text-[#2D50A1]"
                  duration={2500}
                />
                <Counter
                  value={counterValues.cities}
                  suffix="+"
                  label="Cities Served"
                  icon={MapPin}
                  color="text-[#09193C]"
                  duration={1500}
                />
                <Counter
                  value={counterValues.savings}
                  suffix="Cr"
                  label="Savings Generated"
                  icon={IndianRupee}
                  color="text-[#F79050]"
                  duration={3000}
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Timeline/Story Section */}
      <section className="py-12 sm:py-16 px-4 bg-[#FFF8F5] dark:bg-gray-900 w-full">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-[#28B8B4] to-[#2D50A1] bg-clip-text text-transparent">
              Our Journey
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 px-4">
              Building a sustainable future, one installation at a time
            </p>
          </motion.div>

          <div className="space-y-6 sm:space-y-8 relative">
            {/* Timeline line */}
            <div className="absolute left-4 sm:left-8 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#28B8B4] to-[#2D50A1] transform -translate-x-1/2 hidden md:block" />

            {[
              {
                year: "2023",
                title: "Foundation",
                description: "Conceptualized NewRa Grids with a vision to simplify renewable-energy access.",
                icon: Target
              },
              {
                year: "2024",
                title: "First 1000 Installations",
                description: " Formed key partnerships with solar and wind farms; launched pilot aggregator model.",
                icon: TrendingUp
              },
              {
                year: "2025",
                title: "National Expansion",
                description: "Developed the NewRa Smart Energy Platform, integrating AI-powered dashboards, automated billing, and carbon-impact analytics.",
                icon: MapPin
              },
              {
                year: "2025",
                title: "Innovation Leader",
                description: "Expanding to multi-state operations, hybrid solar-wind-storage projects, and ESG reporting integration for all clients.",
                icon: Award
              },
            ].map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
                className="relative"
              >
                <Card className="border border-[#28B8B4]/20 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="hidden md:flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-[#28B8B4] to-[#2D50A1] rounded-2xl mr-4 sm:mr-6 text-white font-bold text-base sm:text-lg"
                      >
                        {milestone.year}
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex items-center mb-2 sm:mb-3">
                          <milestone.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#28B8B4] mr-2 sm:mr-3" />
                          <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">{milestone.title}</h3>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">{milestone.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}