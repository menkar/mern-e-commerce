import React, {useEffect, useState} from 'react';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [products, setProducts]= useState([]);
    const [loading, setLoading]= useState(true);

    useEffect(() => {
        const fetchProducts = async() => {
            try {
                //setLoading(true);
                const res = await fetch("/api/v1/products");
                const data = await res.json();
                // setProducts(data.slice(0,4));
                setProducts(data);
            } catch (error) {

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
                <div className="loading-message">Loading...</div>
            ) : (
                <div className='product-grid'>
                    {
                        products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    }
                </div>
            )
            }
        </div>
    )
};

export default Home;
