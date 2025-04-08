import React, { useState } from "react";
import AdminNavbar from "./AdminNavbar";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import { useProducts } from "../../context/ProductContext";

const Admin = () => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { products, loading, error } = useProducts();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-page">
      <AdminNavbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>Products Management</h1>
        </div>

        {(isAddingProduct || editingProduct) && (
          <ProductForm
            product={editingProduct}
            onClose={() => {
              setIsAddingProduct(false);
              setEditingProduct(null);
            }}
          />
        )}

        <ProductList products={products} onEdit={setEditingProduct} />
      </div>
    </div>
  );
};

export default Admin;
