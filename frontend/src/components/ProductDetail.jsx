import React from 'react';
import { useProducts } from '../context/ProductContext';

const ProductDetail = ({ productId }) => {
  const { getProductById, loading, error } = useProducts();
  const product = getProductById(productId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {product.images.map((image, index) => (
            <img 
              key={index}
              src={image}
              alt={`${product.name} - ${index + 1}`}
              className="w-full rounded-lg"
            />
          ))}
        </div>
        <div>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-bold mb-2">${product.price}</p>
          <div className="flex items-center mb-4">
            <span className="text-yellow-500">★</span>
            <span className="ml-1">{product.rating}</span>
          </div>
          <p className="text-gray-600">Stock: {product.stock}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 