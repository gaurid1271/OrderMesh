import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import socket from "../socket";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();

    socket.on("newOrder", fetchOrders);
    socket.on("statusUpdated", fetchOrders);

    return () => {
      socket.off("newOrder");
      socket.off("statusUpdated");
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/orders/${id}/status`, {
        status,
      });

      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteOrder = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/orders/${id}`);
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.store_id
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const getBadge = (status) => {
    switch (status) {
      case "PLACED":
        return "bg-warning text-dark";
      case "PREPARING":
        return "bg-info";
      case "COMPLETED":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  return (
    <>
      <Navbar />

      <div
        className="container-fluid py-4"
        style={{
          backgroundColor: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        <div className="container">

          <div className="d-flex justify-content-between align-items-center mb-4">

            <div>
              <h2 className="fw-bold">
                Orders Management
              </h2>
              <p className="text-muted">
                Track and manage all orders
              </p>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h6 className="text-muted">
                  Total Orders
                </h6>
                <h2 className="text-primary fw-bold">
                  {orders.length}
                </h2>
              </div>
            </div>

          </div>

          <div className="card border-0 shadow-lg rounded-4">

            <div className="card-body">

              <div className="row mb-4">

                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Store ID..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                  />
                </div>

              </div>

              <div className="table-responsive">

                <table className="table table-hover align-middle">

                  <thead className="table-light">
                    <tr>
                      <th>Store ID</th>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Update</th>
                      <th>Date</th>
                      <th>Delete</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <tr key={order._id}>

                          <td className="fw-semibold">
                            {order.store_id}
                          </td>

                          <td>
                            {order.items?.[0]?.name}
                          </td>

                          <td>
                            {order.items?.[0]?.qty}
                          </td>

                          <td className="fw-bold text-success">
                            ₹{order.total_amount}
                          </td>

                          <td>
                            <span
                              className={`badge ${getBadge(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </td>

                          <td>
                            <select
                              className="form-select"
                              value={order.status}
                              onChange={(e) =>
                                updateStatus(
                                  order._id,
                                  e.target.value
                                )
                              }
                            >
                              <option value="PLACED">
                                PLACED
                              </option>

                              <option value="PREPARING">
                                PREPARING
                              </option>

                              <option value="COMPLETED">
                                COMPLETED
                              </option>
                            </select>
                          </td>

                          <td>
                            {new Date(
                              order.created_at
                            ).toLocaleDateString()}
                          </td>

                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                deleteOrder(order._id)
                              }
                            >
                              Delete
                            </button>
                          </td>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
                          className="text-center py-4"
                        >
                          No Orders Found
                        </td>
                      </tr>
                    )}

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

export default Orders;