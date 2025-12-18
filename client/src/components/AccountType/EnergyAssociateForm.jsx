import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, CheckCircle, Users, Target, Zap, Globe, ArrowRight, Shield, TrendingUp, Copy, Check, ExternalLink, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EnergyAssociateForm = () => {
  const [emailClicked, setEmailClicked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showManualEmail, setShowManualEmail] = useState(false);
const navigate = useNavigate();

  // Handle email click with better compatibility
  const handleEmailClick = () => {
    const email = "info@newragrids.com";
    const subject = "Connect with NewRa Grids as an Associate";
    const body = "Hello NewRa Grids Team,\n\nI'm interested in becoming an Associate with NewRa Grids. Please contact me with more details.\n\nBest regards,";
    
    // Create mailto link
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Try to open email client
    try {
      // Method 1: Create a temporary link and click it
      const link = document.createElement('a');
      link.href = mailtoLink;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setEmailClicked(true);
      setTimeout(() => setEmailClicked(false), 3000);
    } catch (error) {
      console.error('Error opening email:', error);
      setShowManualEmail(true);
    }
  };

  // Alternative: Open in new window
  const openEmailInNewWindow = () => {
    const email = "info@newragrids.com";
    const subject = "Connect with NewRa Grids as an Associate";
    const body = "Hello NewRa Grids Team,\n\nI'm interested in becoming an Associate with NewRa Grids. Please contact me with more details.\n\nBest regards,";
    
    const emailWindow = window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      '_blank',
      'noopener,noreferrer'
    );
    
    if (emailWindow) {
      setEmailClicked(true);
      setTimeout(() => setEmailClicked(false), 3000);
    } else {
      setShowManualEmail(true);
    }
  };
const handleNavigateToAssociateLogin = () => {
  navigate("/UserLogin", {
    state: { loginType: "associate" }
  });
};


  // Copy email to clipboard
  const copyEmailToClipboard = () => {
    const email = "info@newragrids.com";
    const subject = "Connect with NewRa Grids as an Associate";
    const fullText = `To: ${email}\nSubject: ${subject}\n\nHello NewRa Grids Team,\n\nI'm interested in becoming an Associate with NewRa Grids. Please contact me with more details.\n\nBest regards,`;
    
    navigator.clipboard.writeText(fullText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        const textArea = document.createElement('textarea');
        textArea.value = fullText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  const benefits = [
    { icon: Target, title: "Attractive Commissions", desc: "Earn on every successful referral" },
    { icon: Shield, title: "Exclusive Access", desc: "Priority access to new projects" },
    { icon: TrendingUp, title: "Growth Opportunities", desc: "Scale your energy business" },
    { icon: Zap, title: "Training & Support", desc: "Complete onboarding support" },
    { icon: Globe, title: "Market Coverage", desc: "Access across Maharashtra" },
    { icon: Users, title: "Network Events", desc: "Join Associates meetups" }
  ];

  return (
    <div className="min-h-screen bg-[#fff8f5] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#625c8d]/20 to-[#f38f50]/20 text-[#625c8d] px-6 py-3 rounded-full mb-6">
            <Users className="h-5 w-5" />
            <span className="font-semibold">Become Our Associate</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Associate with <span className="text-[#625c8d]">NewRa Grids</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join Maharashtra's leading renewable energy platform. Email us directly.
          </p>
        </div>


<div className="flex justify-end mb-6">
  <button
  onClick={handleNavigateToAssociateLogin}
  className="bg-gradient-to-r from-[#625c8d] to-[#f38f50]
  hover:from-black hover:to-gray-800
  text-white font-medium px-6 py-3 rounded-xl
  shadow-lg hover:shadow-xl transition-all duration-300
  group flex items-center gap-2"
>
  <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
  Already an Associate? Login Here
</button>

</div>
        {/* 2-Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN - Direct Email */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#625c8d]/20"
          >
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-[#625c8d] to-[#f38f50] p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Email Us Directly</h2>
                  <p className="text-white/90">We'll reply within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {emailClicked ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-[#625c8d]/20 to-[#f38f50]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-[#625c8d]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Opening Email...
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Your email app should open automatically.
                  </p>
                  <div className="bg-[#fff8f5] rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-2">If it doesn't open, use:</p>
                    <p className="font-mono text-lg font-bold text-[#f38f50] break-all">
                      info@newragrids.com
                    </p>
                  </div>
                </motion.div>
              ) : showManualEmail ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Email Details
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="bg-[#fff8f5] rounded-xl p-4 text-left">
                      <p className="text-sm text-gray-600 mb-1">To:</p>
                      <p className="font-bold text-lg text-[#f38f50]">info@newragrids.com</p>
                    </div>
                    
                    <div className="bg-[#fff8f5] rounded-xl p-4 text-left">
                      <p className="text-sm text-gray-600 mb-1">Subject:</p>
                      <p className="font-bold text-lg text-[#625c8d]">Connect with NewRa Grids as an Associate</p>
                    </div>
                    
                    <div className="bg-[#fff8f5] rounded-xl p-4 text-left">
                      <p className="text-sm text-gray-600 mb-1">Message:</p>
                      <p className="text-gray-800 whitespace-pre-line">
                        Hello NewRa Grids Team,

                        I'm interested in becoming an Associate with NewRa Grids. Please contact me with more details.

                        Best regards,
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={copyEmailToClipboard}
                    className="w-full py-3 bg-gradient-to-r from-[#625c8d] to-[#f38f50] text-white rounded-lg font-bold flex items-center justify-center gap-2 mb-4"
                  >
                    {copied ? (
                      <>
                        <Check className="h-5 w-5" />
                        Copied All Details!
                      </>
                    ) : (
                      <>
                        <Copy className="h-5 w-5" />
                        Copy All Email Details
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setShowManualEmail(false)}
                    className="text-[#625c8d] hover:text-[#f38f50] font-medium"
                  >
                    ← Back to main view
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#625c8d]/10 to-[#f38f50]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Mail className="h-8 w-8 text-[#625c8d]" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Choose Email Method
                    </h3>
                    <p className="text-gray-700 mb-6">
                      Select how you want to email us:
                    </p>
                  </div>

                  {/* Email Options */}
                  <div className="space-y-4 mb-8">
                    {/* Option 1: Open Email Client */}
                 

                    {/* Option 2: Gmail Web */}
                    <button
                      onClick={openEmailInNewWindow}
                      className="w-full p-5 bg-white border-2 border-[#625c8d] text-[#625c8d] rounded-xl font-bold text-lg hover:bg-[#625c8d]/5 transition-all duration-300 flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
                    >
                      <ExternalLink className="h-6 w-6" />
                      Open in Gmail Web
                    </button>

                    {/* Option 3: Manual Copy */}
                    <button
                      onClick={() => setShowManualEmail(true)}
                      className="w-full p-5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      <Copy className="h-6 w-6" />
                      View Email Details
                    </button>
                  </div>
<div className="mt-8 pt-8 border-t border-gray-200">
  <div className="text-center">
    <p className="text-gray-500 mb-4">Or email us directly:</p>

    <a
      href="mailto:info@newragrids.com"
      className="inline-flex items-center gap-3 text-[#625c8d] font-semibold hover:text-[#f38f50] transition-colors group text-lg"
    >
      <div className="w-12 h-12 bg-[#625c8d]/10 rounded-full flex items-center justify-center group-hover:bg-[#f38f50]/10">
        <Mail className="h-6 w-6" />
      </div>

      <div className="text-left">
        <div className="text-sm text-gray-500">Mail our team</div>
        <div className="text-xl">info@newragrids.com</div>
      </div>
    </a>
  </div>
</div>

                  {/* Note */}
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 text-center">
                      <span className="font-semibold">Important:</span> Please use subject line:<br/>
                      <span className="font-bold">"Connect with NewRa Grids as an Associate"</span>
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* RIGHT COLUMN - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Benefits Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-[#f38f50]/20">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-[#f38f50]/20 to-[#625c8d]/20 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-[#f38f50]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Associate Benefits</h2>
                  <p className="text-gray-600">Why join NewRa Grids?</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="bg-[#fff8f5] rounded-xl p-4 border border-[#625c8d]/10 hover:border-[#f38f50] transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#625c8d]/10 to-[#f38f50]/10 rounded-lg flex items-center justify-center mb-3">
                      <benefit.icon className="h-5 w-5 text-[#625c8d]" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {benefit.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

        

            {/* Note */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#625c8d]/10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#fff8f5] rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-[#f38f50]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    How It Works
                  </h3>
                  <ol className="text-gray-600 space-y-2">
                    <li>1. Email us with the subject mentioned above</li>
                    <li>2. We'll review your inquiry within 24 hours</li>
                    <li>3. Our team will schedule a call with you</li>
                    <li>4. Complete onboarding and start earning</li>
                  </ol>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EnergyAssociateForm;