import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', stock: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert('Please select an image');
    
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    data.append('image', image);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
        body: data
      });
      const responseData = await res.json();
      
      if (res.ok) {
        alert('Product created successfully with Cloudinary Image URL!');
        navigate('/shop');
      } else {
        alert(responseData.message || 'Error creating product');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-page">
      <div className="admin-form-card">
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <input 
            type="text" placeholder="Product Name" required 
            className="form-input"
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
          />
          <textarea 
            placeholder="Description" required rows="4"
            className="form-input"
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
          />
          <input 
            type="number" placeholder="Price" required 
            className="form-input"
            onChange={(e) => setFormData({...formData, price: e.target.value})} 
          />
          <input 
            type="text" placeholder="Category" required 
            className="form-input"
            onChange={(e) => setFormData({...formData, category: e.target.value})} 
          />
          <input 
            type="number" placeholder="Stock Quantity" required 
            className="form-input"
            onChange={(e) => setFormData({...formData, stock: e.target.value})} 
          />
          
          <div className="form-file-zone">
            <label>Upload Product Image</label>
            <input 
              type="file" accept="image/*" required 
              onChange={(e) => setImage(e.target.files[0])} 
            />
          </div>

          <button type="submit" disabled={loading} className="btn">
            {loading ? 'Uploading & Creating...' : 'Publish Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
