import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, UserPlus, User, LogOut, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;

    // Auto close mobile menu when screen size changes to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) { // md breakpoint
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Disable scroll when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Add blur class to main navbar when mobile menu is open
            document.querySelector('nav')?.classList.add('blur-sm');
        } else {
            document.body.style.overflow = 'unset';
            // Remove blur class when mobile menu closes
            document.querySelector('nav')?.classList.remove('blur-sm');
        }

        return () => {
            document.body.style.overflow = 'unset';
            document.querySelector('nav')?.classList.remove('blur-sm');
        };
    }, [isOpen]);

    const navLinks = [

    ];

    const handleLogout = () => {
        logout();
    };

    return (
        <>
            <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2">
                            <img
                                src="/favicon.ico"
                                alt="NewRa Grids Logo"
                                className="h-8 w-8 object-contain dark:brightness-150 dark:contrast-125"
                            />
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] bg-clip-text text-transparent">
                                NewRa Grids
                            </h1>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#28B8B4] dark:hover:text-[#28B8B4] transition-colors duration-200"
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {/* User Profile or Login Button */}
                            <div className="flex items-center space-x-4">
                                <ThemeToggle />

                                {user ? (
                                    // User is logged in - Show Profile Dropdown
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="relative h-10 w-10 rounded-full p-0 hover:bg-[#28B8B4]/10 dark:hover:bg-[#28B8B4]/20 transition-colors duration-200"
                                            >
                                                {/* Profile Icon with User Initial - ONLY WHEN USER IS LOGGED IN */}
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] text-white text-sm font-semibold shadow-md">
                                                    {user.name ? (
                                                        user.name.charAt(0).toUpperCase()
                                                    ) : (
                                                        <User className="h-4 w-4" />
                                                    )}
                                                </div>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56" align="end" forceMount>
                                            <DropdownMenuLabel className="font-normal">
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
                                                    <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link to="/UserProfile" className="cursor-pointer w-full">
                                                    <User className="mr-2 h-4 w-4" />
                                                    <span>Profile</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link to="/" className="cursor-pointer w-full">
                                                    <Settings className="mr-2 h-4 w-4" />
                                                    <span>Settings</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={handleLogout}
                                                className="  w-full"
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Log out</span>
                                            </DropdownMenuItem>


                                        </DropdownMenuContent>



                                    </DropdownMenu>
                                ) : (
                                    // User is not logged in - Show ONLY Login Button (NO profile icon)
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="border-[#2D50A1] text-[#2D50A1] hover:bg-[#2D50A1] hover:text-white transition-all duration-300 font-medium"
                                    >
                                        <Link to="/choose-account-type" className="flex items-center gap-2">
                                            <UserPlus className="w-4 h-4" />
                                            Login
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex md:hidden items-center space-x-2">
                            <ThemeToggle />

                            {/* Mobile Profile Icon - ONLY WHEN USER IS LOGGED IN */}
                            {user && (
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] text-white text-sm font-semibold">
                                    {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                                </div>
                            )}

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar - Tatto wala style */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay with enhanced blur */}
                        <motion.div
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-2xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Sidebar */}
                        <motion.div
                            className="fixed top-0 right-0 w-80 h-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 z-50 shadow-2xl p-6 overflow-y-auto"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 100, damping: 30 }}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src="/favicon.ico"
                                        alt="NewRa Grids Logo"
                                        className="h-10 w-10 object-contain dark:brightness-150 dark:contrast-125 rounded-lg"
                                    />
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] bg-clip-text text-transparent">
                                        NewRa Grids
                                    </h1>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 hover:from-gray-200 rounded-xl transition-all duration-200 hover:rotate-90"
                                >
                                    <X size={24} className="text-gray-600 dark:text-gray-300" />
                                </button>
                            </div>

                            {/* Company Description */}
                            <div className="mb-6 p-4 bg-gradient-to-r from-[#28B8B4]/10 to-[#2D50A1]/10 rounded-2xl border border-[#28B8B4]/20">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">
                                    Automated Energy Solutions for Modern Industries
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                                    We aggregate industrial and commercial consumers with renewable energy partners through a fully digital, subscription-based ecosystem.
                                </p>
                            </div>

                            {/* Navigation Links */}
                            <ul className="flex flex-col space-y-2 mb-6">
                                {navLinks.map((link, idx) => (
                                    <li key={idx}>
                                        <Link
                                            to={link.to}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center py-3 px-4 rounded-2xl text-base font-semibold transition-all duration-300 ${currentPath === link.to
                                                ? 'bg-gradient-to-r from-[#28B8B4] to-[#2D50A1] text-white shadow-lg'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-[#28B8B4]/10 hover:to-[#2D50A1]/10 hover:text-[#28B8B4] dark:hover:text-[#28B8B4]'
                                                }`}
                                        >
                                            {link.label}
                                            {currentPath === link.to && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="ml-auto w-2 h-2 bg-white rounded-full"
                                                />
                                            )}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            {/* Quick Stats */}
                            <div className="mb-6 grid grid-cols-2 gap-3">
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
                                    <div className="text-lg font-bold text-[#28B8B4]">20-40%</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">Energy Savings</div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
                                    <div className="text-lg font-bold text-[#2D50A1]">Zero</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">Capex</div>
                                </div>
                            </div>

                            {/* User Section */}
                            {user ? (
                                <div className="mt-4 p-4 bg-gradient-to-r from-[#28B8B4] to-[#2D50A1] rounded-2xl text-white shadow-lg">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white text-sm font-semibold">
                                            {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base">{user.name || "User"}</h3>
                                            <p className="text-white/80 text-xs">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Link
                                            to="/UserProfile"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-2 text-sm text-white/90 hover:text-white px-2 py-1 rounded-lg transition-colors duration-200"
                                        >
                                            <User className="h-4 w-4" />
                                            Profile
                                        </Link>

                                        <Link
                                            to="/"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-2 text-sm text-white/90 hover:text-white px-2 py-1 rounded-lg transition-colors duration-200"
                                        >
                                            <Settings className="h-4 w-4" />
                                            Settings
                                        </Link>

                                        <Button
                                            onClick={() => {
                                                handleLogout();
                                                setIsOpen(false);
                                            }}
                                            variant="outline"
                                            className="w-full border-white/20 text-red-500 hover:bg-white/10 mt-2 text-sm py-2"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Logout
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-4 p-4 bg-gradient-to-r from-[#28B8B4] to-[#2D50A1] rounded-2xl text-white shadow-lg">
                                    <h3 className="font-bold text-base mb-2">Join Us Today!</h3>
                                    <p className="text-white/80 text-xs mb-3">Access exclusive features and manage your energy solutions.</p>
                                    <Button
                                        asChild
                                        className="w-full bg-white text-[#2D50A1] hover:bg-gray-100 mt-2 border-0 text-sm py-2"
                                    >
                                        <Link to="/choose-account-type" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2">
                                            <UserPlus className="w-4 h-4" />
                                            Login / Sign Up
                                        </Link>
                                    </Button>
                                </div>
                            )}

                            {/* Contact Info */}
                            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-center">
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    For Support  <span className="text-[#28B8B4] font-medium">support@newragrids.com</span>
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}