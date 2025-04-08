import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { endpoints } from '../../config/api';

const ProductForm = ({ product, onClose }) => {
  const { refreshProducts } = useProducts();
  const [formData, setFormData] = useState(product || {
    name: '',
    price: '',
    category: '',
    description: '',
    images: [''],
    specs: [''],
    color: [''],
    features: ['']
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = product 
        ? endpoints.product(product._id)
        : endpoints.products;
      
      const method = product ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save product');
      }

      await refreshProducts();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleArrayInput = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const removeArrayField = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  return (
    <div className="product-form-overlay">
      <div className="product-form">
        <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Category:</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Images:</label>
            {formData.images.map((url, index) => (
              <div key={index} className="array-input">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => handleArrayInput('images', index, e.target.value)}
                  placeholder="Image URL"
                />
                <button 
                  type="button" 
                  onClick={() => removeArrayField('images', index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={() => addArrayField('images')}
              className="add-btn"
            >
              Add Image
            </button>
          </div>

          <div className="form-group">
            <label>Specifications:</label>
            {formData.specs.map((spec, index) => (
              <div key={index} className="array-input">
                <input
                  type="text"
                  value={spec}
                  onChange={(e) => handleArrayInput('specs', index, e.target.value)}
                  placeholder="Specification"
                />
                <button 
                  type="button" 
                  onClick={() => removeArrayField('specs', index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={() => addArrayField('specs')}
              className="add-btn"
            >
              Add Specification
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Product'}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm; 