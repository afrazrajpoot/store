'use client'
import { motion } from 'framer-motion'
import { ArrowRight, Leaf, Shield, Sparkles } from 'lucide-react'

const AboutPage = () => {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6
      }
    }
  }

  // Timeline data
  const timeline = [
    {
      year: "2020",
      title: "Our Beginning",
      description: "Started with a small collection of sustainable basics."
    },
    {
      year: "2021",
      title: "Expansion",
      description: "Launched our first full seasonal collection and opened our online store."
    },
    {
      year: "2022",
      title: "Sustainability Certification",
      description: "Achieved B Corp certification and launched recycling program."
    },
    {
      year: "2023",
      title: "Global Reach",
      description: "Expanded to international markets and opened our flagship store."
    }
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative h-screen bg-gray-900 flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 z-10" />
        <img 
          src="/api/placeholder/1920/1080"
          alt="Fashion atelier" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center text-white px-4 max-w-4xl">
          <motion.span 
            variants={fadeInUp}
            className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-6"
          >
            EST. 2020
          </motion.span>
          <motion.h1 
            variants={fadeInUp}
            className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
          >
            Redefining Fashion, Sustainably
          </motion.h1>
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl max-w-2xl mx-auto mb-12 text-gray-200"
          >
            Where style meets responsibility. Creating timeless pieces for the conscious generation.
          </motion.p>
          <motion.button
            variants={scaleIn}
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Discover Our Collection
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-32 px-4 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            variants={staggerChildren}
            className="grid md:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={fadeInUp}>
              <span className="text-emerald-600 font-semibold mb-4 block">OUR MISSION</span>
              <h2 className="text-5xl font-bold mb-8 text-gray-800 leading-tight">Crafting Tomorrow's Fashion, Today</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We believe that fashion can be both beautiful and sustainable. Our mission is to create
                timeless pieces that not only make you look good but also contribute to a better world.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-4xl font-bold text-gray-800 mb-2">85%</h4>
                  <p className="text-gray-600">Sustainable Materials</p>
                </div>
                <div>
                  <h4 className="text-4xl font-bold text-gray-800 mb-2">100%</h4>
                  <p className="text-gray-600">Ethical Production</p>
                </div>
              </div>
            </motion.div>
            <motion.div 
              variants={scaleIn}
              className="relative"
            >
              <div className="absolute inset-0 bg-emerald-200 rounded-lg transform rotate-3" />
              <img 
                src="/api/placeholder/600/400"
                alt="Sustainable fashion" 
                className="relative z-10 rounded-lg shadow-xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-32 px-4 bg-gray-50"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <span className="text-emerald-600 font-semibold mb-4 block">OUR VALUES</span>
            <h2 className="text-5xl font-bold mb-8 text-gray-800">What We Stand For</h2>
            <p className="text-lg text-gray-600">
              Our values guide every decision we make, from design to delivery.
            </p>
          </motion.div>
          <motion.div 
            variants={staggerChildren}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Leaf className="w-8 h-8 text-emerald-600" />,
                title: "Sustainability",
                description: "Using eco-friendly materials and ethical production methods that respect our planet."
              },
              {
                icon: <Shield className="w-8 h-8 text-emerald-600" />,
                title: "Quality",
                description: "Creating durable garments that stand the test of time through expert craftsmanship."
              },
              {
                icon: <Sparkles className="w-8 h-8 text-emerald-600" />,
                title: "Innovation",
                description: "Pushing boundaries in sustainable fashion technology while maintaining timeless style."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-xl shadow-sm hover:shadow-xl transition-shadow"
              >
                <div className="bg-emerald-50 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Timeline Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-32 px-4 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <span className="text-emerald-600 font-semibold mb-4 block">OUR JOURNEY</span>
            <h2 className="text-5xl font-bold mb-8 text-gray-800">Growing Sustainably</h2>
            <p className="text-lg text-gray-600">
              From our humble beginnings to global recognition, every step has been guided by our commitment to sustainability.
            </p>
          </motion.div>
          <motion.div 
            variants={staggerChildren}
            className="space-y-12"
          >
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex flex-col md:flex-row gap-8 items-center"
              >
                <div className="md:w-1/4 text-center md:text-right">
                  <span className="text-4xl font-bold text-emerald-600">{item.year}</span>
                </div>
                <div className="md:w-3/4 bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}

export default AboutPage