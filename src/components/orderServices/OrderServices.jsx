import { useSentShipmentMessageMutation } from "../../store/storeApi";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
export const OrderStatusBadge = ({ status }) => {
  let badgeClass = "";
  if (status === "Completed") {
    badgeClass = "bg-green-100 text-green-800";
  } else if (status === "RTO") {
    badgeClass = "bg-red-100 text-red-800";
  } else {
    badgeClass = "bg-yellow-100 text-yellow-800";
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${badgeClass}`}
    >
      {status}
    </span>
  );
};

export const OrderActions = ({
  order,
  handleComplete,
  handleRTO,
  isCompleting,
}) => (
  <div className="flex gap-2">
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleComplete(order._id, order.items);
      }}
      className="text-sm bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800"
    >
      {isCompleting ? "...loading" : "Complete"}
    </button>
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleRTO(order._id);
      }}
      className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
    >
      RTO
    </button>
  </div>
);

export const OrderDetailsModal = ({ selectedOrder, setSelectedOrder }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", duration: 0.5 }}
      className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
    >
      <div className="bg-black text-white p-6 sticky top-0">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Order Details</h3>
            <p className="text-gray-300 text-sm mt-1">
              Order ID: {selectedOrder._id}
            </p>
          </div>
          <button
            onClick={() => setSelectedOrder(null)}
            className="text-white hover:text-gray-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6 border-b border-gray-200">
        <h4 className="font-semibold mb-4">Customer Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium">{selectedOrder.customerDetails.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{selectedOrder.customerDetails.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-medium">{selectedOrder.customerDetails.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Address</p>
            <p className="font-medium">
              {selectedOrder.customerDetails.address}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h4 className="font-semibold mb-4">Order Items</h4>
        <div className="space-y-4">
          {selectedOrder.items.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h5 className="font-medium">{item.name}</h5>
                <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                  <p>Size: {item.size}</p>
                  <p>Color: {item.color}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ₹{item.price.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Payment Method</p>
            <p className="font-medium">{selectedOrder.paymentMethod}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold">
              ₹{selectedOrder.totalPrice.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  </div>
);

export const PaginationControls = ({
  pagination,
  currentPage,
  handlePageChange,
}) => (
  <div className="flex justify-center items-center gap-2 mt-8">
    <button
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={!pagination.hasPreviousPage}
      className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 
                     hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Previous
    </button>

    <div className="flex gap-2">
      {[...Array(pagination.totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => handlePageChange(index + 1)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center
                              ${
                                currentPage === index + 1
                                  ? "bg-black text-white"
                                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                              }`}
        >
          {index + 1}
        </button>
      ))}
    </div>

    <button
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={!pagination.hasNextPage}
      className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 
                     hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next
    </button>
  </div>
);

export const ShipmentFormModal = ({ isOpen, onClose, order }) => {
  const [sendShipment, { isLoading, isSuccess, data, isError }] =
    useSentShipmentMessageMutation();
  const [formData, setFormData] = useState({
    name: order?.customerDetails?.name || "",
    email: order?.customerDetails?.email || "",
    trackingId: "",
    message: "",
  });

  useEffect(() => {
    if (order) {
      setFormData((prevData) => ({
        name: order.customerDetails.name,
        email: order.customerDetails.email,
        trackingId: prevData.trackingId,
        message: getDefaultMessage(
          order.customerDetails.name,
          prevData.trackingId
        ),
      }));
    }
  }, [order]);

  // Function to generate default message
  const getDefaultMessage = (customerName, trackingId) => {
    return `Dear ${customerName},

Your order has been shipped! ${
      trackingId
        ? `You can track your package using tracking ID: ${trackingId}`
        : ""
    }

Thank you for shopping with us. If you have any questions about your shipment, please don't hesitate to contact our customer service team.

Best regards,
The Outfitters Team`;
  };

  // Update message when tracking ID changes
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      message: getDefaultMessage(prevData.name, prevData.trackingId),
    }));
  }, [formData.trackingId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendShipment({
      email: formData.email,
      customerName: formData.name,
      message: formData.message,
      trackingId: formData.trackingId,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      onClose();
      toast.success("Order shipped successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
    if (isError) {
      toast.error("Failed to process shipment", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
  }, [isSuccess, isError]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md relative overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Shipment Details
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter customer name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tracking ID
                  </label>
                  <input
                    type="text"
                    value={formData.trackingId}
                    onChange={(e) =>
                      setFormData({ ...formData, trackingId: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter tracking ID"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter shipping message"
                    rows="6"
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg transition-colors"
                >
                  <Send size={18} />
                  {isLoading ? "Sending..." : "Send Shipment"}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
