"use client";

import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { useRouter } from "next/navigation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

export default function OrderAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await axios.get("/api/analyze-orders");
        setAnalytics(response.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.user?.role != "admin") {
      router.push("/");
    }
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold animate-pulse">
          Loading analytics...
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total Orders",
      value: analytics.totalOrders,
      growth: (
        ((analytics.monthlyData[11].total - analytics.monthlyData[10].total) /
          analytics.monthlyData[10].total) *
        100
      ).toFixed(1),
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      title: "Completed Orders",
      value: analytics.completedOrders,
      growth: (
        ((analytics.monthlyData[11].completed -
          analytics.monthlyData[10].completed) /
          analytics.monthlyData[10].completed) *
        100
      ).toFixed(1),
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      borderColor: "border-green-200",
    },
    {
      title: "RTO Orders",
      value: analytics.rtoOrders,
      growth: (
        ((analytics.monthlyData[11].rto - analytics.monthlyData[10].rto) /
          analytics.monthlyData[10].rto) *
        100
      ).toFixed(1),
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      borderColor: "border-red-200",
    },
    {
      title: "Pending Orders",
      value: analytics.pendingOrders,
      growth: (
        ((analytics.monthlyData[11].pending -
          analytics.monthlyData[10].pending) /
          analytics.monthlyData[10].pending) *
        100
      ).toFixed(1),
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      borderColor: "border-yellow-200",
    },
  ];

  const monthlyOrdersData = {
    labels: analytics.monthlyData.map((item) => item.month),
    datasets: [
      {
        label: "Completed",
        data: analytics.monthlyData.map((item) => item.completed),
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 2,
      },
      {
        label: "RTO",
        data: analytics.monthlyData.map((item) => item.rto),
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        borderColor: "rgb(239, 68, 68)",
        borderWidth: 2,
      },
      {
        label: "Pending",
        data: analytics.monthlyData.map((item) => item.pending),
        backgroundColor: "rgba(234, 179, 8, 0.5)",
        borderColor: "rgb(234, 179, 8)",
        borderWidth: 2,
      },
    ],
  };

  const orderGrowthData = {
    labels: analytics.monthlyGrowth.map((item) => item.month),
    datasets: [
      {
        label: "Monthly Growth (%)",
        data: analytics.monthlyGrowth.map((item) => item.growth),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const orderDistributionData = {
    labels: ["Completed", "RTO", "Pending"],
    datasets: [
      {
        data: [
          analytics.completedOrders,
          analytics.rtoOrders,
          analytics.pendingOrders,
        ],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(234, 179, 8, 0.8)",
        ],
        borderColor: [
          "rgb(34, 197, 94)",
          "rgb(239, 68, 68)",
          "rgb(234, 179, 8)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Order Analytics Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat) => (
            <div
              key={stat.title}
              className={`${stat.bgColor} rounded-lg p-6 border ${stat.borderColor}`}
            >
              <h2 className="text-sm font-medium text-gray-600 mb-2">
                {stat.title}
              </h2>
              <div className={`text-2xl font-bold ${stat.textColor} mb-1`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">
              Monthly Orders Breakdown
            </h2>
            <Bar
              data={monthlyOrdersData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">
              Monthly Order Growth Rate
            </h2>
            <Line
              data={orderGrowthData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: { display: true, text: "Growth Rate (%)" },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Order Distribution</h2>
          <div className="flex justify-center">
            <div className="w-72">
              <Doughnut
                data={orderDistributionData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
