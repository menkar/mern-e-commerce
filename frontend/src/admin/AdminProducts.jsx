import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import apiFetch from '../utils/apiFetch';
import { formatCurrency } from '../utils/orderHelpers';
import ConfirmModal from '../components/ConfirmModal';

const AdminProducts = () => {
  const { user } = useContext(AuthContext);
  const { notify } = useNotification();
  const [products, setProducts] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/v1/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    };

    fetchProducts();
  }, []);

  const openDeleteModal = (product) => {
    setDeleteTarget({ id: product._id, name: product.name });
  };

  const closeDeleteModal = () => {
    if (!isDeleting) {
      setDeleteTarget(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);

    try {
      const res = await apiFetch(`/api/v1/products/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` },
        loaderMessage: 'Deleting product...',
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== deleteTarget.id));
        notify.success('Product deleted successfully.');
        setDeleteTarget(null);
      } else {
        notify.error('Could not delete the product. Please try again.');
      }
    } finally {
      setIsDeleting(false);
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
                    <th>#</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product._id}>
                      <td data-label="#" className="admin-table__id">{index + 1}</td>
                      <td data-label="Name" className="admin-table__name">{product.name}</td>
                      <td data-label="Price" className="admin-table__price">{formatCurrency(product.price)}</td>
                      <td data-label="Category">{product.category}</td>
                      <td data-label="Stock">
                        <span className={`admin-stock-pill ${
                          product.stock <= 0
                            ? 'admin-stock-pill--out'
                            : product.stock <= 5
                              ? 'admin-stock-pill--low'
                              : ''
                        }`}>
                          {product.stock <= 0 ? 'Out of stock' : product.stock}
                        </span>
                      </td>
                      <td data-label="Actions">
                        <div className="admin-table__actions">
                          <Link to={`/admin/edit-product/${product._id}`} className="btn-edit-link">Edit</Link>
                          <button
                            type="button"
                            onClick={() => openDeleteModal(product)}
                            className="btn-delete-sm"
                          >
                            Delete
                          </button>
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

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete product?"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete product"
        cancelLabel="Keep product"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
      />
    </div>
  );
};

export default AdminProducts;
