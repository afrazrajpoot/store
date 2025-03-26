"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  LogIn,
  Layers,
  ShoppingBag,
  BarChart2,
  Upload,
  LayoutDashboard,
  Home,
  User,
  Settings,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useGetProductsQuery } from "@/store/storeApi";
import Link from "next/link";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathName = usePathname();
  const sidebarRef = useRef(null);
  const { isLoading, data, isError, error } = useGetProductsQuery();

  useEffect(() => {
    const userRole = JSON.parse(localStorage.getItem("user"));
    setIsAdmin(userRole?.user?.role === "admin");
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUser(user);
    }
  }, []);

  const mainRoutes = [
    {
      category: "Home",
      route: "/",
      icon: <Home className="h-5 w-5 text-indigo-600" />,
    },
    {
      category: "Our Story",
      route: "/our-story",
      icon: <User className="h-5 w-5 text-indigo-600" />,
    },
  ];

  const adminRoutes = [
    {
      category: "Orders",
      route: "/orders",
      icon: <ShoppingBag className="h-5 w-5 text-indigo-600" />,
    },
    {
      category: "Analytics",
      route: "/analyze",
      icon: <BarChart2 className="h-5 w-5 text-indigo-600" />,
    },
    {
      category: "Upload Products",
      route: "/admin",
      icon: <Upload className="h-5 w-5 text-indigo-600" />,
    },
    {
      category: "Products with 0 quantity",
      route: "/productwith0",
      icon: <ShoppingBag className="h-5 w-5 text-indigo-600" />,
    },
    {
      category: "Upload images",
      route: "/uploadImages",
      icon: <Upload className="h-5 w-5 text-indigo-600" />,
    },
  ];

  const categoryRoutes =
    data?.map((item) => ({
      category: item.category,
      route: `/all-products?category=${encodeURIComponent(item.category)}`,
      icon: <Layers className="h-5 w-5 text-indigo-600" />,
    })) || [];

  const allRoutes = isAdmin ? [...mainRoutes, ...adminRoutes] : [...mainRoutes];

  const handleNavigation = (route) => {
    router.push(route);
    setOpenSubmenu(null);
    setIsExpanded(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest('button[aria-label="toggle-sidebar"]')
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sidebarVariants = {
    expanded: {
      width: "300px",
      transition: { duration: 0.2 },
    },
    collapsed: {
      width: "0px",
      transition: { duration: 0.2 },
    },
  };

  const menuItemVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2 },
    },
    collapsed: {
      opacity: 0,
      x: -10,
      transition: { duration: 0.2 },
    },
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[999]"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Burger Menu Button */}
      <motion.button
        aria-label="toggle-sidebar"
        className="fixed top-4 left-4 z-[1000] p-2 mt-[0.5vw]  rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Menu className="h-6 w-6 text-indigo-600" />
      </motion.button>

      {/* Sidebar Content */}
      <motion.div
        ref={sidebarRef}
        variants={sidebarVariants}
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        className="fixed left-0 top-0 h-screen bg-white  w-full max-w-[70vw] shadow-xl z-[1001] overflow-hidden"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-black">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-3">
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      variants={menuItemVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className=""
                    >
                      <img src="/logo/re.png" alt="logo" className="" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-3 space-y-1">
              {allRoutes.map((item, index) => (
                <motion.div
                  key={index}
                  className={`
                    group relative rounded-lg
                    ${
                      pathName === item.route
                        ? "bg-indigo-50 text-indigo-600"
                        : "hover:bg-gray-50 text-gray-700"
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => handleNavigation(item.route)}
                    className="w-full p-3 flex items-center gap-3"
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.span
                          variants={menuItemVariants}
                          initial="collapsed"
                          animate="expanded"
                          exit="collapsed"
                          className="font-medium whitespace-nowrap"
                        >
                          {item.category}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100">
            <motion.button
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (!user) {
                  router.push("/login");
                  setIsExpanded(false);
                } else {
                  localStorage.removeItem("user");
                  router.push("/login");
                  setIsExpanded(false);
                }
              }}
            >
              <LogIn className="h-5 w-5" />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    variants={menuItemVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                  >
                    {user ? "logout" : "login"}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
