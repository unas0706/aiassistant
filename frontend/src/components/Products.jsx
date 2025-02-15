import React from 'react';
import { useProducts } from '../context/ProductContext';

const Products = () => {
  const { products, loading, error } = useProducts();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <div 
          key={product._id} 
          className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">${product.price}</span>
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="ml-1">{product.rating}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Products; 