'use client'
import React from 'react';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';

// Styles for react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"

const HomePageSlider = () => {
  // Slider settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplaySpeed: 3000,
    
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  // Slide content data with images
  const slides = [
    {
      image: "/images/2.jpg"
    },
    {
      image: "/images/3.jpg"
    },
    {
      image: "/images/4.jpg"
    }
  ];

  return (
    <div className="w-full max-w-[95vw] mx-auto">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="focus:outline-none">
            <motion.div 
              className=""
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              <img 
                src={slide.image} 
                alt={`Slide ${index + 1}`} 
                className="w-full max-h-[80vh] object-cover"
              />
            </motion.div>
          </div>
        ))}
      </Slider>
    </div>
  );    
};

// Custom arrow components
function CustomNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow right-[-25px] z-10`}
      style={{ ...style }}
      onClick={onClick}
    >
      <ChevronRight className="text-gray-600 hover:text-blue-500 transition-colors" />
    </div>
  );
}

function CustomPrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow left-[-25px] z-10`}
      style={{ ...style }}
      onClick={onClick}
    >
      <ChevronLeft className="text-gray-600 hover:text-blue-500 transition-colors" />
    </div>
  );
}

export default HomePageSlider;