import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [products, setProducts]= useState([]);
    const [loading, setLoading]= useState(true);

    useEffect(() => {
        const fetchProducts = async() => {
            try {
                const res = await fetch("/api/v1/products");
                const data = await res.json();
                setProducts(Array.isArray(data) ? data : []);
            } catch (error) {
                setProducts([]);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    return (
        <div className="home-container">
            <div className='home-banner'>
                <h1>Welcome to Swap Ecommerce Store</h1>
                <p>Discover the best products at unbeatable prices.</p>
            </div>
            <h2>Featured Products</h2>
            {loading ? (
                <div className="loading-message">Loading products</div>
            ) : products.length === 0 ? (
                <div className="catalog-empty">
                    <p className="catalog-empty__title">No products available right now</p>
                    <p>We are updating our catalog. Please check back soon or visit the shop page.</p>
                    <Link to="/shop" className="btn">Browse Shop</Link>
                </div>
            ) : (
                <div className='product-grid'>
                    {products.map(product => (
                        <ProductCard key={product._id || product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
};

export default Home;
