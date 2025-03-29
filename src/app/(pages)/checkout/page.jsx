"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateOrderMutation } from "../../../store/storeApi";
import OrderSuccessPopup from "../../../components/OrderSuccessPopup";
import { toast } from "sonner";
import { useGlobalContext } from "../../../app/context/GlobalState";

const COUNTRIES = ["Pakistan"];

const CheckoutPage = () => {
  // State management code remains the same
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successOrderData, setSuccessOrderData] = useState(null);
  const { setCount } = useGlobalContext();
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    city: "",
    region: "",
    postalCode: "",
  });

  const [
    createOrder,
    {
      isLoading: orderLoading,
      isError,
      error: orderError,
      data: orderData,
      isSuccess: orderSuccess,
    },
  ] = useCreateOrderMutation();

  // Effects and handlers remain the same
  useEffect(() => {
    const savedOrderDetails = JSON.parse(
      localStorage.getItem("orderDetails") || "null"
    );
    setOrderDetails(savedOrderDetails);
  }, []);

  useEffect(() => {
    if (orderSuccess && orderData) {
      localStorage.removeItem("cartItems");
      setCount();
      setShowSuccessPopup(true);
      setSuccessOrderData(orderData);
    }
  }, [orderSuccess, orderData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = () => {
    const requiredFields = [
      "name",
      "email",
      "phone",
      "address",
      "country",
      "city",
      "region",
      "postalCode",
    ];
    const missingFields = requiredFields.filter(
      (field) => !customerDetails[field]
    );

    if (missingFields.length > 0) {
      toast.success(
        `Please fill in the following fields: ${missingFields.join(", ")}`,
        {
          duration: 3000,
          position: "top-right",
          className: "relative-toast-container",
        }
      );
      return;
    }

    const finalOrder = {
      ...orderDetails,
      customerDetails,
      paymentMethod: "Cash on Delivery (COD)",
      orderDate: new Date().toISOString(),
    };

    createOrder(finalOrder);
  };

  if (!orderDetails)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );

  const customerFields = [
    { name: "name", type: "text", placeholder: "Full Name" },
    { name: "email", type: "email", placeholder: "Email Address" },
    { name: "phone", type: "tel", placeholder: "Phone Number" },
    { name: "address", type: "textarea", placeholder: "Delivery Address" },
    {
      name: "country",
      type: "select",
      placeholder: "Select Country",
      options: COUNTRIES,
    },
    { name: "city", type: "text", placeholder: "City" },
    { name: "region", type: "text", placeholder: "Region/State" },
    { name: "postalCode", type: "text", placeholder: "Postal Code" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-16">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Side - Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-semibold mb-8">Order Summary</h2>
              <div className="space-y-6">
                {orderDetails.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 pb-6 border-b border-gray-100"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">
                        {item.name}
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Size: {item.size}</p>
                        <p>Color: {item.color}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                      <p className="mt-2 font-semibold">
                        PKR {item.totalItemPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center text-2xl font-bold">
                  <span>Total</span>
                  <span>PKR {orderDetails.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Customer Details */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-8">
                Customer Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {customerFields.map((field) => (
                  <div
                    key={field.name}
                    className={field.type === "textarea" ? "md:col-span-2" : ""}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.placeholder}
                    </label>
                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        value={customerDetails[field.name]}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-black transition-all duration-200"
                        required
                      >
                        <option value="">{field.placeholder}</option>
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        name={field.name}
                        value={customerDetails[field.name]}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        className="w-full p-3 border border-gray-200 rounded-lg h-32 focus:ring-2 focus:ring-gray-200 focus:border-black transition-all duration-200 resize-none"
                        required
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={customerDetails[field.name]}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-black transition-all duration-200"
                        required
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-medium flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Cash on Delivery (COD)
                  </p>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={orderLoading}
                className={`mt-8 w-full ${
                  orderLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                } text-white py-4 rounded-lg font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl`}
              >
                {orderLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <OrderSuccessPopup
        isOpen={showSuccessPopup}
        onClose={() => {
          setShowSuccessPopup(false);
          router.push("/");
        }}
        orderDetails={successOrderData}
      />

      {isError && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {orderError?.message || "Order submission failed"}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
