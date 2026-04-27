import React, { useState, useEffect } from "react";

const PRICES = {
  Shirt: 10,
  Pants: 15,
  Saree: 20
};

const STATUS = ["RECEIVED", "PROCESSING", "READY", "DELIVERED"];

export default function App() {
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [garment, setGarment] = useState("Shirt");
  const [quantity, setQuantity] = useState(1);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(data);
  }, []);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const createOrder = () => {
    if (!name || !phone) return alert("Fill all fields");

    const total = PRICES[garment] * quantity;

    const newOrder = {
      id: Date.now(),
      name,
      phone,
      garment,
      quantity,
      total,
      status: "RECEIVED"
    };

    setOrders([newOrder, ...orders]);

    setName("");
    setPhone("");
  };

  const updateStatus = (id) => {
    setOrders(
      orders.map((o) =>
        o.id === id
          ? {
              ...o,
              status: STATUS[(STATUS.indexOf(o.status) + 1) % 4]
            }
          : o
      )
    );
  };

  const filtered = orders.filter(
    (o) =>
      o.name.toLowerCase().includes(filter.toLowerCase()) ||
      o.phone.includes(filter) ||
      o.status.toLowerCase().includes(filter.toLowerCase())
  );

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="container">
      <h1>🧺 Laundry System</h1>

      <div className="dashboard">
        <div className="stat">Orders: {orders.length}</div>
        <div className="stat">Revenue: ₹{revenue}</div>
      </div>

      <div className="card">
        <h3>Create Order</h3>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <select onChange={(e) => setGarment(e.target.value)}>
          <option>Shirt</option>
          <option>Pants</option>
          <option>Saree</option>
        </select>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <button onClick={createOrder}>Create</button>
      </div>

      <div className="card">
        <input
          placeholder="Search..."
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {filtered.map((o) => (
        <div key={o.id} className="card">
          <h4>{o.name}</h4>
          <p>{o.phone}</p>
          <p>{o.garment} x {o.quantity}</p>
          <p>₹{o.total}</p>
          <span className={`status ${o.status}`}>{o.status}</span>
          <button onClick={() => updateStatus(o.id)}>Update</button>
        </div>
      ))}
    </div>
  );
}