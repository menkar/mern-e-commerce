import React from 'react';
import {Link} from 'react-router-dom';

const Home = () => {
    return (
        <div className="home">
            <h1>Welcome to Swap Ecommerce Store</h1>
            <p>your one-stop shop for all your needs. Expore our wide range of products and enjoy seamless shopping experience.</p>
            <Link to="/shop" className='btn'>Start Shopping</Link>
        </div>
    )
};

export default Home;
