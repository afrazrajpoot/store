import { Award, Bell, Gift, Headphones, Heart, Home, Package, Phone, RefreshCw, Settings, ShieldCheck, Smartphone, User } from "lucide-react";

export const menuItems = [
    {
      // icon: Home,
      label: 'Home',
      route: '/',
    },
 
  ];



  export const navVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 10 
      }
    }
  };

 export  const submenuVariants = {
    closed: { 
      height: 0, 
      opacity: 0,
      transition: { 
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    open: { 
      height: "auto", 
      opacity: 1,
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };


  export const category = [
    { 
      name: "Electronics", 
      icon: <Smartphone className="w-16 h-16 text-blue-600" />,
      bg: "bg-blue-100"
    },
    { 
      name: "Fashion", 
      icon: <Heart className="w-16 h-16 text-pink-600" />,
      bg: "bg-pink-100"
    },
    { 
      name: "Home & Kitchen", 
      icon: <Gift className="w-16 h-16 text-yellow-600" />,
      bg: "bg-yellow-100"
    },
    { 
      name: "Beauty", 
      icon: <Award className="w-16 h-16 text-purple-600" />,
      bg: "bg-purple-100"
    }
  ]

  export const shopData = [
    { 
      icon: <ShieldCheck className="w-16 h-16 text-green-600" />, 
      title: "Secure Shopping", 
      description: "100% secure payment & data protection",
      bg: "bg-green-100"
    },
    { 
      icon: <RefreshCw className="w-16 h-16 text-blue-600" />, 
      title: "Easy Returns", 
      description: "30-day hassle-free return policy",
      bg: "bg-blue-100"
    },
    { 
      icon: <Headphones className="w-16 h-16 text-purple-600" />, 
      title: "24/7 Support", 
      description: "Dedicated customer support team",
      bg: "bg-purple-100"
    }
  ]

  export const formFields = [
    { label: "Name", name: "name", type: "text", required: true },
    { label: "Price", name: "price", type: "number", required: true },
    { label: "Discount Price", name: "discountPrice", type: "number", required: false },
    { label: "Category", name: "category", type: "text", required: true },
    { label: "Description", name: "description", type: "textarea", required: false },
    { label: "Material", name: "material", type: "text", required: false },
    { label: "Care Instructions", name: "care", type: "textarea", required: false },
    // { label: "Colors", name: "colors", type: "text", required: false },
    { label: "Sizes", name: "sizes", type: "text", required: false },
    // { label: "Features", name: "features", type: "text", required: false },
    // { label: "Tags", name: "tags", type: "text", required: false },
    { label: "Fit", name: "specifications.fit", type: "text", required: false },
    { label: "Gender", name: "specifications.gender", type: "text", required: false },

    // { label: "Collar", name: "specifications.collar", type: "text", required: false },
    // { label: "Cuff", name: "specifications.cuff", type: "text", required: false },
    // { label: "Pattern", name: "specifications.pattern", type: "text", required: false },
    // { label: "Sleeve", name: "specifications.sleeve", type: "text", required: false }
  ];