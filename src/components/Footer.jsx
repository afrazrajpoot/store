import React from "react";
import { Facebook, Instagram, MessageCircle, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 w-full">
      <div className="flex flex-col lg:flex-row justify-between w-full px-8 mx-auto">
        {/* Left Column */}
        <div className="space-y-3 mb-8 lg:mb-0">
          <h3 className="font-semibold text-lg mb-4 border-b border-gray-700 pb-2">
            Quick Links
          </h3>
          <a
            href="/login"
            className="block hover:text-gray-300 transition-colors duration-200 transform hover:translate-x-2"
          >
            Log In/Sign Up
          </a>
          <a
            href="/how-to-buy"
            className="block hover:text-gray-300 transition-colors duration-200 transform hover:translate-x-2"
          >
            How To Buy
          </a>
          <a
            href="/shipping"
            className="block hover:text-gray-300 transition-colors duration-200 transform hover:translate-x-2"
          >
            Shipping & Deliveries
          </a>
          <a
            href="/returns"
            className="block hover:text-gray-300 transition-colors duration-200 transform hover:translate-x-2"
          >
            Exchange & Returns
          </a>
        </div>

        {/* Center Logo */}
        <div className="flex flex-col items-center justify-start mb-8 lg:mb-0">
          <img src="/logo/re.png" alt="logo" className="h-12 w-auto" />
          <div className="flex space-x-4 mt-6">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors duration-200 hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram className="text-white" size={20} />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors duration-200 hover:scale-110"
              aria-label="Facebook"
            >
              <Facebook className="text-white" size={20} />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors duration-200 hover:scale-110"
              aria-label="WhatsApp"
            >
              <Phone className="text-white" size={20} />
            </a>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg mb-4 border-b border-gray-700 pb-2">
            Company
          </h3>
          <a
            href="/about"
            className="block hover:text-gray-300 transition-colors duration-200 transform hover:translate-x-2"
          >
            About Us
          </a>
          <a
            href="/contact"
            className="block hover:text-gray-300 transition-colors duration-200 transform hover:translate-x-2"
          >
            Contact Us
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-12 text-sm text-gray-400 border-t border-gray-800 pt-8 px-4">
        <p className="hover:text-white transition-colors duration-200">
          © {new Date().getFullYear()} Copyrights Reserved by Roshni
        </p>
      </div>
    </footer>
  );
};

export default Footer;
