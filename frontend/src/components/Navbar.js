import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1 className="navbar-title">Tech Store</h1>
      </div>
      <Link to="/login" id="login-btn">
        login
      </Link>
    </nav>
  );
};

export default Navbar;
