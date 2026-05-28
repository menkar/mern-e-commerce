import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

const EditProduct = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', stock: '' });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      setFormData({ name: data.name, description: data.description, price: data.price, category: data.category, stock: data.stock });
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    if (image) data.append('image', image);

    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${user.token}` },
      body: data
    });
    setLoading(false);
    if (res.ok) {
      alert('Product updated successfully!');
      navigate('/admin/products');
    }
  };

  return (
    <div className="admin-form-page">
      <div className="admin-form-card">
        <h2>Edit Product</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <input type="text" placeholder="Product Name" required className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <textarea placeholder="Description" required rows="4" className="form-input" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          <input type="number" placeholder="Price" required className="form-input" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
          <input type="text" placeholder="Category" required className="form-input" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
          <input type="number" placeholder="Stock" required className="form-input" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
          <div className="form-file-zone">
            <label>Replace Image (Optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <button type="submit" disabled={loading} className="btn">
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
