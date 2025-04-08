import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import ProductPage from "./components/ProductPage";
import Navbar from "./components/Navbar";
import { ProductProvider } from "./context/ProductContext";
import Admin from './components/Admin/Admin';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './components/Auth/Login';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <ProductProvider>
        <BrowserRouter>
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              <Route path="/product/:id" element={<ProductPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ProductProvider>
    </AuthProvider>
  );
};

export default App;
