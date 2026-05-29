import React, { useEffect, useState, useContext } from 'react';

import { AuthContext } from '../context/AuthContext';

import { useParams, useNavigate, Link } from 'react-router-dom';

import { useNotification } from '../context/NotificationContext';
import apiFetch from '../utils/apiFetch';



const EditProduct = () => {

  const { id } = useParams();

  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const { notify } = useNotification();

  

  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', stock: '' });

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);



  useEffect(() => {

    const fetchProduct = async () => {

      const res = await fetch(`/api/v1/products/${id}`);

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



    const res = await apiFetch(`/api/v1/products/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${user.token}` },
      body: data,
      loaderMessage: 'Updating product...',
    });

    setLoading(false);

    if (res.ok) {

      notify.success('Product updated successfully!');

      navigate('/admin/products');

    } else {

      notify.error('Could not update the product. Please try again.');

    }

  };



  return (

    <div className="admin-form-page">

      <div className="admin-form-page-inner">

        <Link to="/admin/products" className="admin-back-link">← Back to Products</Link>



        <div className="admin-form-card">

          <header className="admin-form-header">

            <h2>Edit Product</h2>

            <p>Update product details and save your changes.</p>

          </header>



          <form onSubmit={handleSubmit} className="admin-form">

            <div className="admin-form-field">

              <label htmlFor="edit-product-name">Product Name</label>

              <input

                id="edit-product-name"

                type="text"

                placeholder="Product Name"

                required

                className="form-input"

                value={formData.name}

                onChange={(e) => setFormData({...formData, name: e.target.value})}

              />

            </div>



            <div className="admin-form-field">

              <label htmlFor="edit-product-description">Description</label>

              <textarea

                id="edit-product-description"

                placeholder="Description"

                required

                rows="4"

                className="form-input"

                value={formData.description}

                onChange={(e) => setFormData({...formData, description: e.target.value})}

              />

            </div>



            <div className="admin-form-row">

              <div className="admin-form-field">

                <label htmlFor="edit-product-price">Price (₹)</label>

                <input

                  id="edit-product-price"

                  type="number"

                  placeholder="Price"

                  required

                  min="0"

                  step="0.01"

                  className="form-input"

                  value={formData.price}

                  onChange={(e) => setFormData({...formData, price: e.target.value})}

                />

              </div>

              <div className="admin-form-field">

                <label htmlFor="edit-product-stock">Stock</label>

                <input

                  id="edit-product-stock"

                  type="number"

                  placeholder="Stock"

                  required

                  min="0"

                  className="form-input"

                  value={formData.stock}

                  onChange={(e) => setFormData({...formData, stock: e.target.value})}

                />

              </div>

            </div>



            <div className="admin-form-field">

              <label htmlFor="edit-product-category">Category</label>

              <input

                id="edit-product-category"

                type="text"

                placeholder="Category"

                required

                className="form-input"

                value={formData.category}

                onChange={(e) => setFormData({...formData, category: e.target.value})}

              />

            </div>



            <div className="form-file-zone">

              <label htmlFor="edit-product-image">Replace Image <span>(optional)</span></label>

              <input

                id="edit-product-image"

                type="file"

                accept="image/*"

                onChange={(e) => setImage(e.target.files[0])}

              />

            </div>



            <div className="admin-form-actions">

              <button type="submit" disabled={loading} className="btn">

                {loading ? 'Updating...' : 'Update Product'}

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



export default EditProduct;

