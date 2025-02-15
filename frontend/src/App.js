import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import ProductPage from "./components/ProductPage";
import Navbar from "./components/Navbar";
import { ProductProvider } from "./context/ProductContext";
import './App.css';

const App = () => {
  return (
    <ProductProvider>
      <BrowserRouter>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ProductProvider>
  );
};

export default App;
