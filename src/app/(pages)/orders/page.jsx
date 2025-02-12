'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { format } from 'date-fns';
import { useCompleteOrderMutation, useGetOrdersQuery } from '@/store/storeApi';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderActions, OrderDetailsModal, OrderStatusBadge, PaginationControls, ShipmentFormModal } from '@/components/orderServices/OrderServices';
import { X, Send, Truck } from 'lucide-react';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
    </div>
);

const OrdersTable = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;
    const limit = 1;

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [shipmentOrder, setShipmentOrder] = useState(null);

    const { data, isLoading, refetch } = useGetOrdersQuery({
        page: currentPage,
        limit,
    });
    const [completeOrder, { isLoading: isCompleting, isSuccess, isError }] = useCompleteOrderMutation();

    const orders = data?.data || [];
    const pagination = data?.pagination || {};

    const handleComplete = async (orderId, items) => {
        try {
            await completeOrder({ orderId, items, complete: true });
            await refetch();
        } catch (error) {
            console.error('Failed to complete order:', error);
        }
    };

    const handleShipmentSubmit = async (formData) => {
        if (shipmentOrder) {
            try {
                await handleComplete(shipmentOrder._id, shipmentOrder.items);
                console.log('Shipment form submitted:', formData);
            } catch (error) {
                console.error('Failed to process shipment:', error);
            }
        }
    };

    const handleRTO = async (orderId) => {
        try {
            await completeOrder({ orderId, rto: true });
            await refetch();
        } catch (error) {
            console.error('Failed to mark as RTO:', error);
        }
    };

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`);
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        if (isSuccess) {
            alert('Order Actions Successfully');
        }
        if (isError) {
            alert('Order Actions Failed');
        }
    }, [isSuccess, isError]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Orders Dashboard</h1>
                    <p className="text-gray-600">Manage and track your orders</p>
                    {pagination.totalOrders > 0 && (
                        <p className="text-sm text-gray-500 mt-2">
                            Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, pagination.totalOrders)} of {pagination.totalOrders} orders
                        </p>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left">Order ID</th>
                                    <th className="px-6 py-4 text-left">Customer</th>
                                    <th className="px-6 py-4 text-left">Date</th>
                                    <th className="px-6 py-4 text-left">Status</th>
                                    <th className="px-6 py-4 text-left">Total</th>
                                    <th className="px-6 py-4 text-left">Shipment</th>
                                    <th className="px-6 py-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr 
                                        key={order._id}
                                        onClick={() => setSelectedOrder(order)}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-6 py-4">{order._id}</td>
                                        <td className="px-6 py-4">{order.customerDetails.name}</td>
                                        <td className="px-6 py-4">
                                            {format(new Date(order.orderDate), 'PP')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <OrderStatusBadge status={order.status} />
                                        </td>
                                        <td className="px-6 py-4">₹{order.totalPrice.toLocaleString()}</td>
                                        <td>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShipmentOrder(order);
                                                }}
                                                className="flex items-center gap-2 text-sm bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                                            >
                                                <Truck size={16} />
                                                Shipment
                                            </motion.button>
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.status !== 'Completed' && order.status !== 'RTO' && (
                                                <OrderActions 
                                                    order={order} 
                                                    handleComplete={handleComplete} 
                                                    handleRTO={handleRTO} 
                                                    isCompleting={isCompleting} 
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {pagination.totalPages > 1 && (
                    <PaginationControls 
                        pagination={pagination} 
                        currentPage={currentPage} 
                        handlePageChange={handlePageChange} 
                    />
                )}

                <AnimatePresence>
                    {selectedOrder && (
                        <OrderDetailsModal 
                            selectedOrder={selectedOrder} 
                            setSelectedOrder={setSelectedOrder} 
                        />
                    )}
                </AnimatePresence>

                <ShipmentFormModal
                    isOpen={!!shipmentOrder}
                    onClose={() => setShipmentOrder(null)}
                    order={shipmentOrder}
                   
                />
            </div>
        </div>
    );
};

const Page = () => (
    <Suspense fallback={<LoadingSpinner />}>
        <OrdersTable />
    </Suspense>
);

export default Page;