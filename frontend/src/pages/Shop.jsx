import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/v1/products');
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="shop-container">
      <h2>All Products</h2>
      <input 
        type="text" 
        placeholder="Search products..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />
      {loading ? (
        <div className="loading-message">Loading products</div>
      ) : products.length === 0 ? (
        <div className="catalog-empty">
          <p className="catalog-empty__title">No products in the store yet</p>
          <p>New items will appear here once they are added. Please check back later.</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="catalog-empty">
          <p className="catalog-empty__title">No products found</p>
          <p>No results for &quot;{search}&quot;. Try a different search term.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
