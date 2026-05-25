import React from 'react';
import {Link} from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <idv>
                    <h3>Swap Ecommerce Store</h3>
                    <p>Premium E-Commerce Platform.</p>
                </idv>
                <ul className="footer-links">
                    <li><Link to="/about">About Us</Link></li>
                    <li><Link to="/return">Return Policy</Link></li>
                    <li><Link to="/disclaimer">Disclaimer</Link></li>
                </ul>
            </div>
            <div>
                <p>&copy; {new Date().getFullYear()} Swap Ecommerce Store. All rights reserved.</p>
            </div>
        </footer>
    )
};

export default Footer;
