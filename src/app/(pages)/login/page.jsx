'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, Mail, Eye, EyeOff, ArrowRight, 
  Github, Twitter, Linkedin, Instagram 
} from 'lucide-react';
import { useLoginAdminMutation } from '@/store/storeApi';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser, { isLoading, isSuccess, isError, error }] = useLoginAdminMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call the login API
      const response = await loginUser({ email, password }).unwrap();

      // Save the response in localStorage
      localStorage.setItem('user', JSON.stringify(response));

      console.log('Login successful:', response);
      alert('Login successful!');
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed. Please check your credentials.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.6,
        delayChildren: 0.3,
        staggerChildren: 0.2 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 120,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        {/* Left Side - Creative Section */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col justify-center p-12 text-white relative overflow-hidden">
          <motion.div 
            variants={itemVariants}
            className="z-10 relative"
          >
            <h2 className="text-4xl font-bold mb-4 tracking-tight">
              Start Your Journey
            </h2>
            <p className="text-xl mb-6 opacity-80">
              Unlock a world of possibilities with a single step. Your adventure begins here.
            </p>
            
            <div className="flex space-x-4 mt-8">
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition"
              >
                <Github className="text-white" size={24} />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition"
              >
                <Twitter className="text-white" size={24} />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition"
              >
                <Linkedin className="text-white" size={24} />
              </motion.a>
            </div>
          </motion.div>

          {/* Background Shapes */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-12 flex flex-col justify-center">
          <motion.h1 
            variants={itemVariants}
            className="text-3xl font-bold text-center text-gray-800 mb-8"
          >
            Welcome Back
          </motion.h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <motion.div 
              variants={itemVariants}
              className="relative"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="text-gray-400" size={20} />
              </div>
              <input 
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 transition duration-300"
                required
              />
            </motion.div>

            {/* Password Input */}
            <motion.div 
              variants={itemVariants}
              className="relative"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="text-gray-400" size={20} />
              </div>
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 transition duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-500 transition duration-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </motion.div>

            {/* Remember and Forgot Password */}
            <motion.div 
              variants={itemVariants}
              className="flex justify-between items-center"
            >
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700 transition duration-300">
                Forgot password?
              </a>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition duration-300 space-x-2 shadow-lg hover:shadow-xl"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              {!isLoading && <ArrowRight size={20} />}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center justify-center space-x-4 my-6"
          >
            <div className="h-px bg-gray-300 w-full"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="h-px bg-gray-300 w-full"></div>
          </motion.div>

          {/* Social Login */}
          <motion.div 
            variants={itemVariants}
            className="flex justify-center space-x-4"
          >
            {[
              { Icon: Instagram, color: 'text-pink-500' },
              { Icon: Twitter, color: 'text-blue-400' },
              { Icon: Github, color: 'text-gray-800' }
            ].map(({ Icon, color }, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`bg-white border border-gray-200 p-3 rounded-xl hover:bg-gray-100 transition duration-300 shadow-md ${color}`}
              >
                <Icon size={24} />
              </motion.button>
            ))}
          </motion.div>

          {/* Sign Up Link */}
          <motion.p 
            variants={itemVariants}
            className="text-center mt-6 text-sm text-gray-600"
          >
            Don't have an account? {" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-700 transition">
              Sign Up
            </a>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;