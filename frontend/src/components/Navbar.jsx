import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">

        <Link className="navbar-brand fw-bold fs-4" to="/">
          📦 OrderMesh
        </Link>

        <div className="d-flex gap-4">

          <Link className="nav-link text-white" to="/">
            Dashboard
          </Link>

          <Link className="nav-link text-white" to="/create-order">
            Create Order
          </Link>

          <Link className="nav-link text-white" to="/orders">
            Orders
          </Link>

          <Link className="nav-link text-white" to="/analytics">
            Analytics
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;