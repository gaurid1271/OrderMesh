import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function Analytics() {
  const [ordersData, setOrdersData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [topItems, setTopItems] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const ordersRes = await API.get(
        "/orders/analytics/orders-per-day"
      );

      const revenueRes = await API.get(
        "/orders/analytics/revenue-per-store"
      );

      const itemsRes = await API.get(
        "/orders/analytics/top-items"
      );

      setOrdersData(ordersRes.data);
      setRevenueData(revenueRes.data);
      setTopItems(itemsRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  const COLORS = [
    "#2563eb",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
  ];

  return (
    <>
      <Navbar />

      <div
        className="container-fluid p-4"
        style={{
          background: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        <h1 className="fw-bold mb-4">
          📊 Analytics Dashboard
        </h1>

        <div className="row g-4">

          {/* Orders Per Day */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-lg">
              <div className="card-body">
                <h5 className="mb-3">
                  Orders Per Day
                </h5>

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >
                  <BarChart data={ordersData}>
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="orders"
                      fill="#2563eb"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Revenue Per Store */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-lg">
              <div className="card-body">
                <h5 className="mb-3">
                  Revenue Per Store
                </h5>

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >
                  <PieChart>
                    <Pie
                      data={revenueData}
                      dataKey="revenue"
                      nameKey="_id"
                      outerRadius={100}
                      label
                    >
                      {revenueData.map(
                        (entry, index) => (
                          <Cell
                            key={index}
                            fill={
                              COLORS[
                                index %
                                  COLORS.length
                              ]
                            }
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Selling Items */}
          <div className="col-12">
            <div className="card border-0 shadow-lg">
              <div className="card-body">
                <h5 className="mb-3">
                  Top Selling Items
                </h5>

                <table className="table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity Sold</th>
                    </tr>
                  </thead>

                  <tbody>
                    {topItems.map((item) => (
                      <tr key={item._id}>
                        <td>{item._id}</td>
                        <td>{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Analytics;