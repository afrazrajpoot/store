'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  MessageCircle 
} from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Side - Creative Contact Info */}
        <div className="w-full md:w-2/5 bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-12 flex flex-col justify-center relative overflow-hidden">
          {/* Background Shapes */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>

          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="z-10 space-y-6"
          >
            <h2 className="text-4xl font-bold mb-6 tracking-tight">Connect With Us</h2>
            <div className="space-y-4">
              {[
                { 
                  icon: <Mail className="w-7 h-7 text-indigo-200" />, 
                  text: "hello@innovate.com" 
                },
                { 
                  icon: <Phone className="w-7 h-7 text-indigo-200" />, 
                  text: "+1 (555) 123-4567" 
                },
                { 
                  icon: <MapPin className="w-7 h-7 text-indigo-200" />, 
                  text: "123 Innovation Street, Tech City" 
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center space-x-4 bg-white/10 p-3 rounded-xl"
                >
                  {item.icon}
                  <span className="text-sm">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="w-full md:w-3/5 p-12 flex flex-col justify-center">
          <motion.h2 
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-8 text-gray-800 text-center"
          >
            Send us a Message
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { 
                name: 'name', 
                type: 'text', 
                label: 'Full Name', 
                icon: <User className="text-gray-400" />,
                placeholder: 'John Doe'
              },
              { 
                name: 'email', 
                type: 'email', 
                label: 'Email Address', 
                icon: <Mail className="text-gray-400" />,
                placeholder: 'john@example.com'
              }
            ].map((field, index) => (
              <motion.div 
                key={field.name}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="relative"
              >
                <label className="block mb-2 text-sm text-gray-600">{field.label}</label>
                <div className="flex items-center border-2 border-gray-200 rounded-lg focus-within:border-indigo-500 transition-all">
                  <span className="pl-4 pr-2">{field.icon}</span>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full p-3 pl-2 rounded-lg focus:outline-none"
                    required
                  />
                </div>
              </motion.div>
            ))}

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <label className="block mb-2 text-sm text-gray-600">Your Message</label>
              <div className="flex items-start border-2 border-gray-200 rounded-lg focus-within:border-indigo-500 transition-all">
                <span className="pl-4 pt-4 pr-2"><MessageCircle className="text-gray-400" /></span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  className="w-full p-3 pl-2 h-32 rounded-lg focus:outline-none resize-none"
                  required
                ></textarea>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-4 rounded-lg hover:opacity-90 transition-all"
            >
              <Send className="w-5 h-5" />
              <span>Send Message</span>
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;