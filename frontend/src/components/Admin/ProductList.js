import React from 'react';
import { useProducts } from '../../context/ProductContext';
import { endpoints } from '../../config/api';

const ProductList = ({ products, onEdit }) => {
  const { refreshProducts } = useProducts();

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(endpoints.product(productId), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }
      
      await refreshProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(error.message || 'Failed to delete product');
    }
  };

  return (
    <div className="product-list">
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td>
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="product-thumbnail"
                />
              </td>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.category}</td>
              <td>
                <button 
                  onClick={() => onEdit(product)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(product._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList; 