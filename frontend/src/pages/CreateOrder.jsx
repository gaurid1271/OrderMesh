import { useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function CreateOrder() {
  const [formData, setFormData] = useState({
    store_id: "",
    item_name: "",
    qty: "",
    price: "",
  });

  const total =
    Number(formData.qty || 0) * Number(formData.price || 0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const orderData = {
        store_id: formData.store_id,

        items: [
          {
            item_id: "1",
            name: formData.item_name,
            qty: Number(formData.qty),
            price: Number(formData.price),
          },
        ],

        total_amount: total,

        status: "PLACED",
      };

      const res = await API.post("/orders", orderData);

      console.log(res.data);

      alert("Order Created Successfully 🎉");

      setFormData({
        store_id: "",
        item_name: "",
        qty: "",
        price: "",
      });

    } catch (error) {
      console.error(error);
      alert("Failed to create order");
    }
  };

  return (
    <>
      <Navbar />

      <div
        className="container-fluid py-5"
        style={{
          background: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        <div className="row justify-content-center">

          <div className="col-lg-7">

            <div
              className="card border-0 shadow-lg"
              style={{ borderRadius: "20px" }}
            >
              <div className="card-body p-5">

                <div className="text-center mb-4">
                  <h2 className="fw-bold">
                    Create New Order
                  </h2>

                  <p className="text-muted">
                    Add and manage store orders efficiently
                  </p>
                </div>

                <form onSubmit={handleSubmit}>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Store ID
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="store_id"
                      value={formData.store_id}
                      onChange={handleChange}
                      placeholder="STORE001"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Item Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="item_name"
                      value={formData.item_name}
                      onChange={handleChange}
                      placeholder="Burger"
                      required
                    />
                  </div>

                  <div className="row">

                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-semibold">
                        Quantity
                      </label>

                      <input
                        type="number"
                        className="form-control"
                        name="qty"
                        value={formData.qty}
                        onChange={handleChange}
                        placeholder="2"
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-semibold">
                        Price (₹)
                      </label>

                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="150"
                        required
                      />
                    </div>

                  </div>

                  <div
                    className="p-4 mb-4"
                    style={{
                      background: "#eff6ff",
                      borderRadius: "12px",
                    }}
                  >
                    <h5 className="mb-0">
                      Total Amount:
                      <span className="ms-2 text-primary fw-bold">
                        ₹{total}
                      </span>
                    </h5>
                  </div>

                  <button
                    type="submit"
                    className="btn w-100 py-3 text-white fw-bold"
                    style={{
                      background:
                        "linear-gradient(90deg,#2563eb,#3b82f6)",
                      border: "none",
                      borderRadius: "12px",
                    }}
                  >
                    Create Order
                  </button>

                </form>

              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}

export default CreateOrder;