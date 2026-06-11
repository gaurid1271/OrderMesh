import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import socket from "../socket";

function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    storesCount: 0,
  });

  useEffect(() => {
    fetchStats();

    socket.on("newOrder", fetchStats);
    socket.on("statusUpdated", fetchStats);

    return () => {
      socket.off("newOrder");
      socket.off("statusUpdated");
    };
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get(
        "/orders/dashboard/stats"
      );

      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container py-4">
        <h1 className="fw-bold mb-4">
          OrderMesh Dashboard
        </h1>

        <div className="row g-4">

          <div className="col-md-3">
            <div className="card shadow border-0">
              <div className="card-body">
                <h6>Total Orders</h6>
                <h2>{stats.totalOrders}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow border-0">
              <div className="card-body">
                <h6>Revenue</h6>
                <h2>₹{stats.totalRevenue}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow border-0">
              <div className="card-body">
                <h6>Completed</h6>
                <h2>{stats.completedOrders}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow border-0">
              <div className="card-body">
                <h6>Stores</h6>
                <h2>{stats.storesCount}</h2>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Dashboard;