import React, {useEffect, useState} from 'react';
import {useParams, Link} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { useNotification } from '../context/NotificationContext';
import { validateCartQuantity, getStockLimitMessage } from '../utils/cartValidation';
import { formatCurrency } from '../utils/orderHelpers';

const ProductDetail = () => {
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cartItems);
    const { notify } = useNotification();
    
    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const res = await fetch(`/api/v1/products/${id}`);
                const data = await res.json();
                setProduct(data);

            } catch(error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchProductDetail();

    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;

        if (product.stock <= 0) {
            notify.error('This item is out of stock.');
            return;
        }

        const existItem = cartItems.find((x) => x.productId === product._id);
        const inCartQty = existItem?.qty ?? 0;

        if (inCartQty >= product.stock) {
            notify.info(getStockLimitMessage(product.stock, product.name));
            return;
        }

        const requestedQty = inCartQty + 1;
        const validation = validateCartQuantity(product.stock, requestedQty, product.name);

        if (!validation.allowed) {
            notify.error(validation.message);
            return;
        }

        dispatch(addToCart({
            productId: product._id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            stock: product.stock,
            qty: validation.qty,
        }));

        if (validation.message) {
            notify.warning(validation.message);
        } else {
            notify.success('Item added to your cart.');
        }
    };

    if (loading) return (<p className="loading-message">Loading...</p>);
    if (!product) return (<p className="loading-message">Product not found</p>);

    const existItem = cartItems.find((x) => x.productId === product._id);
    const inCartQty = existItem?.qty ?? 0;
    const isCartFull = product.stock > 0 && inCartQty >= product.stock;

    return (
        <div className="product-detail-wrapper">
      <div className="product-breadcrumb">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / {product.category} / <span className="product-breadcrumb-current">{product.name}</span>
      </div>

      <div className="product-detail">
        <div className="detail-image-container">
          <img src={product.imageUrl} alt={product.name} className="detail-image" />
        </div>

        <div className="detail-info">
          <h2 className="detail-title">{product.name}</h2>

          <p className="detail-price">{formatCurrency(product.price)}</p>

          <div className="detail-description-block">
            <h4 className="detail-description-title">Product Description</h4>
            <p className="detail-description-text">{product.description}</p>
          </div>

          <div className="detail-actions">
            <button
              type="button"
              onClick={handleAddToCart}
              className="btn"
              disabled={product.stock <= 0 || isCartFull}
            >
              {product.stock <= 0
                ? 'Out of Stock'
                : isCartFull
                  ? 'Maximum Quantity in Cart'
                  : 'Add to Shopping Cart'}
            </button>
          </div>
          
          <p className={`detail-stock ${product.stock > 0 ? 'detail-stock--in' : 'detail-stock--out'}`}>
            {product.stock > 0 ? `● In Stock (${product.stock} units available)` : `● Temporarily Out of Stock`}
          </p>

          {isCartFull && (
            <p className="detail-stock-limit-hint" role="status">
              You already have all {product.stock} available units in your cart.
            </p>
          )}

        </div>
      </div>
    </div>
  );
};
export default ProductDetail;
