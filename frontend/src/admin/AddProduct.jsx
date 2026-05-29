import React, { useState, useContext } from 'react';

import { AuthContext } from '../context/AuthContext';

import { useNavigate, Link } from 'react-router-dom';

import { useNotification } from '../context/NotificationContext';
import apiFetch from '../utils/apiFetch';



const AddProduct = () => {

  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const { notify } = useNotification();

  

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

    if (!image) {

      notify.warning('Please select a product image before publishing.');

      return;

    }

    

    setLoading(true);

    const data = new FormData();

    data.append('name', formData.name);

    data.append('description', formData.description);

    data.append('price', formData.price);

    data.append('category', formData.category);

    data.append('stock', formData.stock);

    data.append('image', image);



    try {

      const res = await apiFetch('/api/v1/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
        body: data,
        loaderMessage: 'Publishing product...',
      });

      const responseData = await res.json();

      

      if (res.ok) {

        notify.success('Product created successfully!');

        navigate('/shop');

      } else {

        notify.error(responseData.message || 'Could not create the product. Please try again.');

      }

    } catch (error) {

      console.error(error);

      notify.error('Something went wrong while creating the product.');

    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="admin-form-page">

      <div className="admin-form-page-inner">

        <Link to="/admin" className="admin-back-link">← Back to Dashboard</Link>



        <div className="admin-form-card">

          <header className="admin-form-header">

            <h2>Add New Product</h2>

            <p>Fill in the details below to publish a new product to your store.</p>

          </header>



          <form onSubmit={handleSubmit} className="admin-form">

            <div className="admin-form-field">

              <label htmlFor="product-name">Product Name</label>

              <input

                id="product-name"

                type="text"

                placeholder="e.g. Wireless Headphones"

                required

                className="form-input"

                onChange={(e) => setFormData({...formData, name: e.target.value})}

              />

            </div>



            <div className="admin-form-field">

              <label htmlFor="product-description">Description</label>

              <textarea

                id="product-description"

                placeholder="Describe the product features and benefits..."

                required

                rows="4"

                className="form-input"

                onChange={(e) => setFormData({...formData, description: e.target.value})}

              />

            </div>



            <div className="admin-form-row">

              <div className="admin-form-field">

                <label htmlFor="product-price">Price (₹)</label>

                <input

                  id="product-price"

                  type="number"

                  placeholder="0.00"

                  required

                  min="0"

                  step="0.01"

                  className="form-input"

                  onChange={(e) => setFormData({...formData, price: e.target.value})}

                />

              </div>

              <div className="admin-form-field">

                <label htmlFor="product-stock">Stock Quantity</label>

                <input

                  id="product-stock"

                  type="number"

                  placeholder="0"

                  required

                  min="0"

                  className="form-input"

                  onChange={(e) => setFormData({...formData, stock: e.target.value})}

                />

              </div>

            </div>



            <div className="admin-form-field">

              <label htmlFor="product-category">Category</label>

              <input

                id="product-category"

                type="text"

                placeholder="e.g. electronics, home, fashion"

                required

                className="form-input"

                onChange={(e) => setFormData({...formData, category: e.target.value})}

              />

            </div>



            <div className="form-file-zone">

              <label htmlFor="product-image">Upload Product Image</label>

              <input

                id="product-image"

                type="file"

                accept="image/*"

                required

                onChange={(e) => setImage(e.target.files[0])}

              />

            </div>



            <div className="admin-form-actions">

              <button type="submit" disabled={loading} className="btn">

                {loading ? 'Uploading & Creating...' : 'Publish Product'}

              </button>

              <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/products')}>

                Cancel

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>

  );

};



export default AddProduct;

