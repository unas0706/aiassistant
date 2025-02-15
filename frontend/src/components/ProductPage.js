import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

const ProductPage = () => {
  const { id } = useParams();
  const {getProductById } = useProducts();
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState()
  useEffect(()=> {
    let p1 = getProductById(id);
    setProduct(p1)        
  })
  
   

  if (!product) {
    return <div className="product-not-found">Product not found</div>;
  }

  return (
    <div className="product-detail">
      <div className="product-detail-grid">
        <div className="product-detail-image-container">
          <img 
            src={product.images[selectedImage]} 
            alt={product.title} 
            className="product-detail-main-image"
            style={{height:"50vh"}}
          />
          <div className="product-detail-thumbnails">
            {product.images?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.title} ${index + 1}`}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>
        <div className="product-detail-info">
          <h1>{product.title}</h1>
          <p className="product-detail-price">{product.price}</p>
          <p className="product-detail-description">{product.description}</p>
          <div className="product-detail-specs">
            <h2>Specifications</h2>
            <ul>
              {product.specs?.map((spec, index) => (
                <li key={index}>{spec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
