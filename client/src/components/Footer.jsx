import { Facebook, Twitter, Linkedin, Instagram, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#28B8B4]/20 bg-gradient-to-r from-[#FFF8F5] to-[#28B8B4]/5 dark:from-[#09193C] dark:to-[#28B8B4]/10 w-full">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mobile View - Stacked */}
        <div className="flex flex-col items-center gap-4 md:hidden">
          {/* Social Links - Top */}
          <div className="flex justify-center space-x-3">
            <a
              href="https://www.facebook.com/profile.php?id=61581721202186"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white dark:bg-[#09193C] rounded-full flex items-center justify-center border border-[#28B8B4]/20 hover:bg-[#28B8B4] hover:border-[#28B8B4] hover:scale-110 group transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5 text-[#2D50A1] dark:text-gray-400 group-hover:text-white transition-colors" />
            </a>

            <a
              href="https://x.com/NewRaGrids"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white dark:bg-[#09193C] rounded-full flex items-center justify-center border border-[#28B8B4]/20 hover:bg-[#28B8B4] hover:border-[#28B8B4] hover:scale-110 group transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Twitter/X"
            >
              <Twitter className="h-5 w-5 text-[#2D50A1] dark:text-gray-400 group-hover:text-white transition-colors" />
            </a>

            <a
              href="https://www.linkedin.com/in/newra-grids-2b98ab388/?trk=opento_sprofile_topcard"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white dark:bg-[#09193C] rounded-full flex items-center justify-center border border-[#28B8B4]/20 hover:bg-[#28B8B4] hover:border-[#28B8B4] hover:scale-110 group transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5 text-[#2D50A1] dark:text-gray-400 group-hover:text-white transition-colors" />
            </a>

            <a
              href="https://www.instagram.com/newra.grids/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white dark:bg-[#09193C] rounded-full flex items-center justify-center border border-[#28B8B4]/20 hover:bg-[#28B8B4] hover:border-[#28B8B4] hover:scale-110 group transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5 text-[#2D50A1] dark:text-gray-400 group-hover:text-white transition-colors" />
            </a>

            <a
              href="https://www.reddit.com/user/NewRaGrids/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white dark:bg-[#09193C] rounded-full flex items-center justify-center border border-[#28B8B4]/20 hover:bg-[#28B8B4] hover:border-[#28B8B4] hover:scale-110 group transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Reddit"
            >
              <Globe className="h-5 w-5 text-[#2D50A1] dark:text-gray-400 group-hover:text-white transition-colors" />
            </a>
          </div>

          {/* Copyright - Bottom */}
          <div className="text-center">
            <p className="text-[#2D50A1] dark:text-gray-400 text-sm">
              © 2025 NewRa Grids. All rights reserved.
            </p>
          </div>
        </div>

        {/* Desktop View - Side by Side */}
        <div className="hidden md:flex flex-row justify-between items-center gap-6">
          {/* Copyright - Left */}
          <div className="text-left">
            <p className="text-[#2D50A1] dark:text-gray-400 text-sm">
              © 2025 NewRa Grids. All rights reserved.
            </p>
          </div>

          {/* Social Links - Right */}
          <div className="flex justify-end space-x-3">
            <a
              href="https://www.facebook.com/profile.php?id=61581721202186"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white dark:bg-[#09193C] rounded-full flex items-center justify-center border border-[#28B8B4]/20 hover:bg-[#28B8B4] hover:border-[#28B8B4] hover:scale-110 group transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5 text-[#2D50A1] dark:text-gray-400 group-hover:text-white transition-colors" />
            </a>

            <a
              href="https://x.com/NewRaGrids"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white dark:bg-[#09193C] rounded-full flex items-center justify-center border border-[#28B8B4]/20 hover:bg-[#28B8B4] hover:border-[#28B8B4] hover:scale-110 group transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Twitter/X"
            >
              <Twitter className="h-5 w-5 text-[#2D50A1] dark:text-gray-400 group-hover:text-white transition-colors" />
            </a>

            <a
              href="https://www.linkedin.com/in/newra-grids-2b98ab388/?trk=opento_sprofile_topcard"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white dark:bg-[#09193C] rounded-full flex items-center justify-center border border-[#28B8B4]/20 hover:bg-[#28B8B4] hover:border-[#28B8B4] hover:scale-110 group transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5 text-[#2D50A1] dark:text-gray-400 group-hover:text-white transition-colors" />
            </a>

            <a
              href="https://www.instagram.com/newra.grids/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white dark:bg-[#09193C] rounded-full flex items-center justify-center border border-[#28B8B4]/20 hover:bg-[#28B8B4] hover:border-[#28B8B4] hover:scale-110 group transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5 text-[#2D50A1] dark:text-gray-400 group-hover:text-white transition-colors" />
            </a>

            <a
              href="https://www.reddit.com/user/NewRaGrids/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white dark:bg-[#09193C] rounded-full flex items-center justify-center border border-[#28B8B4]/20 hover:bg-[#28B8B4] hover:border-[#28B8B4] hover:scale-110 group transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Reddit"
            >
              <Globe className="h-5 w-5 text-[#2D50A1] dark:text-gray-400 group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}