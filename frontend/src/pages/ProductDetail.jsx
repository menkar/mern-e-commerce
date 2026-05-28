import React, {useEffect, useState} from 'react';
import {useParams, Link} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const ProductDetail = () => {
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    
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
        if (product) {
            dispatch(addToCart({
                productId: product._id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                qty: 1
            }));

            alert("Successfully added to your cart!");
        }
    };

    if (loading) return (<p className="loading-message">Loading...</p>);
    if (!product) return (<p className="loading-message">Product not found</p>); 

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

          <p className="detail-price">₹{product.price.toFixed(2)}</p>

          <div className="detail-description-block">
            <h4 className="detail-description-title">Product Description</h4>
            <p className="detail-description-text">{product.description}</p>
          </div>

          <div className="detail-actions">
            <button onClick={handleAddToCart} className="btn">
              Add to Shopping Cart
            </button>
          </div>
          
          <p className={`detail-stock ${product.stock > 0 ? 'detail-stock--in' : 'detail-stock--out'}`}>
            {product.stock > 0 ? `● In Stock (${product.stock} units available)` : `● Temporarily Out of Stock`}
          </p>

        </div>
      </div>
    </div>
  );
};
export default ProductDetail;