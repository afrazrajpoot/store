"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { useGetImagesQuery } from '@/store/storeApi'

const HeroSection = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = React.useRef(null);

  // Custom arrow components with fixed direction
  const NextArrow = () => (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-50">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-transparent p-2 rounded-full"
        onClick={() => sliderRef.current.slickNext()}
      >
        <ChevronRight className="w-6 h-6 text-gray-800 transform transition-transform group-hover:translate-x-1" />
      </motion.button>
    </div>
  );

  const PrevArrow = () => (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-50">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-transparent p-2 rounded-full "
        onClick={() => sliderRef.current.slickPrev()}
      >
        <ChevronLeft className="w-6 h-6 text-gray-800 transform transition-transform group-hover:-translate-x-1" />
      </motion.button>
    </div>
  );

  const handleSlideClick = (index) => {
    // console.log(`Clicked slide ${index}`)
    // Add your click handler logic here
    // For example: router.push(`/collection/${index}`)
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    fade: false,
    pauseOnHover: true,
    beforeChange: (current, next) => setCurrentSlide(next),
    customPaging: (i) => (
      <motion.div
        key={`dot-${i}`}
        initial={{
          width: "16px",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
        animate={{
          width: currentSlide === i ? "48px" : "16px",
          backgroundColor:
            currentSlide === i ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.5)",
        }}
        transition={{
          duration: 0.3,
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        style={{
          height: "8px",
          borderRadius: "10px",
          cursor: "pointer",
        }}
      />
    ),
    dotsClass: "slick-dots custom-dots-container",
  };

  const backgroundImages = [
    "https://outfitters.com.pk/cdn/shop/files/DV_1920x900_W_273ba314-fb75-4517-be57-4d89cfe548da_1660x.jpg?v=1736144895",
    "https://outfitters.com.pk/cdn/shop/files/DV_1920x900_M-3_7103fdae-48e5-474a-abee-99a8944861d6_1660x.jpg?v=1736154674",
    "https://outfitters.com.pk/cdn/shop/files/DV_1920x900_M-1_bf2f8c29-5824-429c-9250-7239698e0a89_1660x.jpg?v=1736154694",
  ];

  return (
    <div className="relative h-screen w-full overflow-hidden group">
      <style>{`
        .custom-dots-container {
          position: absolute !important;
          bottom: 20px !important;
          left: 0 !important;
          right: 0 !important;
          display: flex !important;
          justify-content: center !important;
          z-index: 50 !important;
          width: 100% !important;
        }
        .custom-dots-container li {
          margin: 0 5px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .slick-slider {
          position: relative !important;
          height: 100vh !important;
        }
        .slick-list, .slick-track, .slick-slide, .slick-slide > div {
          height: 100vh !important;
        }
        .slick-slide > div {
          width: 100% !important;
        }
      `}</style>

      {/* Custom Navigation Arrows */}
      <PrevArrow />
      <NextArrow />

      <Slider ref={sliderRef} {...sliderSettings}>
        {images?.map((image, index) => (
          <div key={index} className="relative h-screen w-full">
            {/* Clickable background image with hover effect */}
            <motion.div
              className="absolute inset-0 cursor-pointer transform transition-transform duration-700 hover:scale-105"
              onClick={() => handleSlideClick(index)}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "100vw",
                height: "100vh",
              }}
            />

            <div className="absolute inset-0 flex items-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="container mx-auto px-4"
              >
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="max-w-xl"
                ></motion.div>
              </motion.div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSection;
