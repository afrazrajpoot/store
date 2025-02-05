import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  customerDetails: {
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    email: { 
      type: String, 
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone: { 
      type: String, 
      required: true,
      trim: true
    },
    address: { 
      type: String, 
      required: true 
    },
    country: { 
      type: String, 
      required: true 
    },
    city: { 
      type: String, 
      required: true 
    },
    region: { 
      type: String 
    },
    postalCode: { 
      type: String, 
      required: true 
    }
  },
  items: [{
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product',
      required: true 
    },
    name: { 
      type: String, 
      required: true 
    },
    size: { 
      type: String, 
      required: true 
    },
    color: { 
      type: String, 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true,
      min: 1 
    },
    price: { 
      type: Number, 
      required: true,
      min: 0 
    },
    totalItemPrice: { 
      type: Number, 
      required: true,
      min: 0 
    },
    image: { 
      type: String 
    }
  }],
  totalPrice: { 
    type: Number, 
    required: true,
    min: 0 
  },
  paymentMethod: { 
    type: String, 
    enum: ['Cash on Delivery (COD)', 'Credit Card', 'PayPal'],
    default: 'Cash on Delivery (COD)' 
  },
  orderDate: { 
    type: Date, 
    default: Date.now 
  },
 
  status: { 
    type: String, 
    // enum: ['Pending', 'RTO', 'Completed'],
    default: 'Pending' 
  }

});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
