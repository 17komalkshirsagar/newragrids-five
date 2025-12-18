import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaHandshake, FaHome, FaUserTie } from "react-icons/fa";

const ChooseAccountType = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const accountTypes = [
    {
      id: "energy-partner",
      title: "Energy Partner",
      description: "For organizations and businesses who want to collaborate on energy projects",
      path: "/register/energy-partner",
      icon: <FaHandshake size={30} />
    },
    {
      id: "energy-subscriber",
      title: "Energy Subscriber",
      description: "For individuals and households looking to subscribe to clean energy solutions",
      path: "/Userform",
      icon: <FaHome size={30} />
    },
    {
      id: "energy-associate",
      title: "Energy Associate",
      description: "For professionals and consultants in the energy industry",
      path: "/register/energy-associate",
      icon: <FaUserTie size={30} />
    }
  ];

  return (
    <div
      className="
        min-h-screen flex flex-col items-center justify-center p-4 md:p-8 
        bg-gradient-to-b from-gray-50 to-[#fcf5f2]
        dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800
      "
    >
      <div className="w-full max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] bg-clip-text text-transparent">
            Join Our Energy Platform
          </h1>

          <p className="text-1xl md:text-1xl mb-6 text-black dark:text-gray-300">
            Select the account type that best fits your role in the energy ecosystem
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {accountTypes.map((type) => (
            <div
              key={type.id}
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                hoveredCard === type.id
                  ? "shadow-2xl transform -translate-y-2"
                  : "shadow-lg"
              }`}
              onMouseEnter={() => setHoveredCard(type.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Card Background */}
              <div
                className="
                  absolute inset-0 
                  bg-gradient-to-br from-white to-gray-50
                  dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-700
                "
              ></div>

              {/* Accent Bar */}
              <div
                className="h-2 w-full"
                style={{ backgroundColor: "#2d53a1" }}
              ></div>

              {/* Card Content */}
              <div className="relative p-8 flex flex-col items-center text-center h-full">

                {/* Icon */}
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-6 transition-transform duration-300"
                  style={{
                    backgroundColor:
                      hoveredCard === type.id ? "#f79050" : "#2d53a1",
                    color: "white"
                  }}
                >
                  {type.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {type.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-8 flex-grow">
                  {type.description}
                </p>

                {/* Button */}
                <button
                  onClick={() => navigate(type.path)}
                  className="
                    w-full py-3 px-6 rounded-xl font-semibold 
                    transition-all duration-300 transform hover:scale-[1.02]
                  "
                  style={{
                    backgroundColor:
                      hoveredCard === type.id ? "#f79050" : "#2d53a1",
                    color: "white"
                  }}
                >
                  Select Account Type
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            Not sure which account to choose?{" "}
            <span
              className="font-semibold cursor-pointer hover:underline"
              style={{ color: "#2d53a1" }}
            >
              Contact our support team
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChooseAccountType;
