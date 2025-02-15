import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';

const SearchProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { products } = useProducts();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products..."
        className="border p-2 rounded"
      />
      <div className="mt-4">
        {filteredProducts.map(product => (
          <div key={product._id} className="mb-2">
            {product.name} - ${product.price}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchProducts; 