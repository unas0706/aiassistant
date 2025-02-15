import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import Chat from "./Chat";
import { IoChatbubbleEllipsesSharp } from 'react-icons/io5';

const Home = () => {
  const { products, loading, error } = useProducts();
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!products?.length) return <div>No products found</div>;

  return (
    <>
      <div className="product-grid">
        {products.map((product, index) => (
          <Link to={`/product/${product._id}`} key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="product-card">
              <img src={product.images[0]} alt={product.title} className="product-image" />
              <h3 className="product-title">{product.title}</h3>
              <p className="product-price">{product.price}</p>
            </div>
          </Link>
        ))}
      </div>
      
      <button 
        className="chat-toggle-button"
        onClick={() => setIsChatOpen(true)}
      >
        <IoChatbubbleEllipsesSharp />
      </button>
      
      <Chat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default Home;
