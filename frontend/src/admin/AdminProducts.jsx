import React, { useEffect, useState, useContext } from 'react';

import { AuthContext } from '../context/AuthContext';

import { Link } from 'react-router-dom';

import { useNotification } from '../context/NotificationContext';
import apiFetch from '../utils/apiFetch';
import { formatCurrency } from '../utils/orderHelpers';



const AdminProducts = () => {

  const { user } = useContext(AuthContext);

  const { notify } = useNotification();

  const [products, setProducts] = useState([]);



  useEffect(() => {

    const fetchProducts = async () => {

      const res = await fetch('/api/v1/products');

      const data = await res.json();

      setProducts(Array.isArray(data) ? data : []);

    };

    fetchProducts();

  }, []);



  const handleDelete = async (id) => {

    if (window.confirm('Are you strictly sure you want to delete this?')) {

      const res = await apiFetch(`/api/v1/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` },
        loaderMessage: 'Deleting product...',
      });

      if (res.ok) {

        setProducts(products.filter(p => p._id !== id));

        notify.success('Product deleted successfully.');

      } else {

        notify.error('Could not delete the product. Please try again.');

      }

    }

  };



  return (

    <div className="admin-page">

      <div className="admin-page-inner">

        <Link to="/admin" className="admin-back-link">← Back to Dashboard</Link>



        <div className="admin-toolbar">

          <div className="admin-toolbar__left">

            <h2>Manage Products</h2>

            <p className="admin-toolbar__subtitle">

              {products.length} product{products.length !== 1 ? 's' : ''} in catalog

            </p>

          </div>

          <div className="admin-toolbar__actions">

            <Link to="/admin/add-product" className="btn">+ Add Product</Link>

          </div>

        </div>



        {products.length === 0 ? (

          <div className="admin-empty">

            <p className="admin-empty__title">No products yet</p>

            <p>Add your first product to start selling.</p>

            <Link to="/admin/add-product" className="btn">

              + Add Product

            </Link>

          </div>

        ) : (

          <div className="admin-table-section">

            <div className="admin-table-wrap">

              <table className="admin-table">

                <thead>

                  <tr>

                    <th>ID</th>

                    <th>Name</th>

                    <th>Price</th>

                    <th>Category</th>

                    <th>Stock</th>

                    <th>Actions</th>

                  </tr>

                </thead>

                <tbody>

                  {products.map(product => (

                    <tr key={product._id}>

                      <td data-label="ID" className="admin-table__id">{product._id.substring(0, 8)}...</td>

                      <td data-label="Name" className="admin-table__name">{product.name}</td>

                      <td data-label="Price" className="admin-table__price">{formatCurrency(product.price)}</td>

                      <td data-label="Category">{product.category}</td>

                      <td data-label="Stock">

                        <span className={`admin-stock-pill ${product.stock <= 5 ? 'admin-stock-pill--low' : ''}`}>

                          {product.stock}

                        </span>

                      </td>

                      <td data-label="Actions">

                        <div className="admin-table__actions">

                          <Link to={`/admin/edit-product/${product._id}`} className="btn-edit-link">Edit</Link>

                          <button type="button" onClick={() => handleDelete(product._id)} className="btn-delete-sm">Delete</button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </div>

    </div>

  );

};



export default AdminProducts;

