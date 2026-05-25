import React from 'react';
import { Link } from 'react-router-dom';

const Disclaimer = () => {
    return (
        <div className="page-content legal-page">
            <header className="page-header">
                <h1>Disclaimer</h1>
                <p className="page-lead">
                    Please read this disclaimer carefully before using Swap Ecommerce Store. By accessing or
                    purchasing on our platform, you agree to the terms outlined below.
                </p>
                <p className="legal-updated">Last updated: May 2026</p>
            </header>

            <section className="content-section">
                <h2>1. General Information</h2>
                <p>
                    The information, product descriptions, images, and prices displayed on Swap Ecommerce Store are
                    provided for general shopping purposes. While we strive for accuracy in line with common industry
                    standards, we do not warrant that all content is complete, current, or free from
                    typographical errors at all times.
                </p>
            </section>

            <section className="content-section">
                <h2>2. Product & Pricing</h2>
                <p>
                    Product availability, specifications, and prices may change without prior notice. Displayed prices
                    are shown in the currency indicated on the product page and may exclude applicable taxes, shipping,
                    or promotional adjustments unless stated otherwise. We reserve the right to correct pricing errors
                    and cancel orders placed at incorrect prices, following standard e-commerce industry practice.
                </p>
            </section>

            <section className="content-section">
                <h2>3. No Professional Advice</h2>
                <p>
                    Content on this website does not constitute legal, financial, medical, or professional advice.
                    Any decisions you make based on product information or platform content are at your own discretion
                    and risk.
                </p>
            </section>

            <section className="content-section">
                <h2>4. Third-Party Links & Services</h2>
                <p>
                    Our platform may reference or link to third-party websites, payment gateways, or delivery partners.
                    Swap Ecommerce Store is not responsible for the content, policies, or practices of external sites.
                    Your use of third-party services is governed by their respective terms and privacy policies.
                </p>
            </section>

            <section className="content-section">
                <h2>5. Limitation of Liability</h2>
                <p>
                    To the fullest extent permitted by law, Swap Ecommerce Store and its operators shall not be liable
                    for any indirect, incidental, special, or consequential damages arising from:
                </p>
                <ul className="info-list">
                    <li>Use or inability to use the website or mobile experience</li>
                    <li>Unauthorized access to your account due to compromised credentials</li>
                    <li>Delays in shipping, delivery, or service interruptions beyond reasonable control</li>
                    <li>Errors in product listings, inventory, or order processing systems</li>
                </ul>
            </section>

            <section className="content-section">
                <h2>6. Account & Security</h2>
                <p>
                    You are responsible for maintaining the confidentiality of your login credentials. We implement
                    industry-standard authentication measures; however, no online system is completely secure. Notify
                    us promptly if you suspect unauthorized activity on your account.
                </p>
            </section>

            <section className="content-section">
                <h2>7. Intellectual Property</h2>
                <p>
                    All logos, branding, software, and original content on this platform are the property of Swap
                    Ecommerce Store or its licensors. Unauthorized reproduction, distribution, or commercial use is
                    prohibited without written permission.
                </p>
            </section>

            <section className="content-section">
                <h2>8. Changes to This Disclaimer</h2>
                <p>
                    We may update this disclaimer periodically to reflect legal, technical, or business changes.
                    Continued use of the platform after updates constitutes acceptance of the revised terms.
                </p>
            </section>

            <section className="content-section legal-contact">
                <h2>Contact</h2>
                <p>
                    For questions regarding this disclaimer, please visit our{' '}
                    <Link to="/about">About Us</Link> page or contact support at{' '}
                    <a href="mailto:swapnilmenkar@gmail.com">swapnilmenkar@gmail.com</a>.
                </p>
            </section>
        </div>
    );
};

export default Disclaimer;
