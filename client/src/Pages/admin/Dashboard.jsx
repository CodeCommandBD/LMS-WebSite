import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStatsService } from "@/services/courseApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, ShoppingCart, Loader2 } from "lucide-react";

const Dashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStatsService,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] ml-80 mt-20">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-80 mt-20 p-6 text-red-500">
        Error loading dashboard stats: {error.message}
      </div>
    );
  }

  const { totalRevenue, totalSales, courseStats } = data?.stats || {
    totalRevenue: 0,
    totalSales: 0,
    courseStats: [],
  };

  return (
    <div className="ml-80 mt-20 p-6 bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Welcome back! Here's what's happening with your courses.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-md border-0 bg-white hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Total Revenue
              </CardTitle>
              <div className="bg-green-100 p-2 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">
                ৳{totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-green-600 mt-2 font-medium">
                Total earnings from all enrollments
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0 bg-white hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Total Sales
              </CardTitle>
              <div className="bg-blue-100 p-2 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">
                {totalSales}
              </div>
              <p className="text-xs text-blue-600 mt-2 font-medium">
                Combined successful course sales
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card className="shadow-md border-0 bg-white overflow-hidden">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-lg font-bold text-gray-800">
              Revenue per Course
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[450px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={courseStats}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={80}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    cursor={{ fill: "#f3f4f6" }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#4f46e5"
                    radius={[6, 6, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
