import React from 'react';
import { Link } from 'react-router-dom';

const ReturnPolicy = () => {
    return (
        <div className="page-content legal-page">
            <header className="page-header">
                <h1>Return & Refund Policy</h1>
                <p className="page-lead">
                    We want you to shop with confidence. Our return policy is designed to be clear and fair, aligned
                    with standard practices used across the online retail industry.
                </p>
                <p className="legal-updated">Last updated: May 2026</p>
            </header>

            <section className="content-section highlight-box">
                <h2>Quick Summary</h2>
                <ul className="info-list">
                    <li><strong>Return window:</strong> 7 days from delivery for most eligible items</li>
                    <li><strong>Condition:</strong> Unused, undamaged, with original tags and packaging</li>
                    <li><strong>Refund method:</strong> Original payment source or store credit (where applicable)</li>
                    <li><strong>Processing time:</strong> 5–10 business days after we receive and inspect the return</li>
                </ul>
            </section>

            <section className="content-section">
                <h2>1. Eligibility for Returns</h2>
                <p>You may request a return if all of the following apply:</p>
                <ul className="info-list">
                    <li>The return is initiated within <strong>7 calendar days</strong> of delivery confirmation</li>
                    <li>The product is in resalable condition (no signs of use, washing, or damage)</li>
                    <li>Original packaging, invoice, and accessories (if any) are included</li>
                    <li>The item is not listed under non-returnable categories below</li>
                </ul>
            </section>

            <section className="content-section">
                <h2>2. Non-Returnable Items</h2>
                <p>For hygiene, safety, and regulatory reasons, the following are generally not eligible for return:</p>
                <ul className="info-list">
                    <li>Personal care, innerwear, and hygiene products (once opened)</li>
                    <li>Customized or made-to-order products</li>
                    <li>Digital goods, gift cards, or downloadable content</li>
                    <li>Items marked as &quot;Final Sale&quot; or &quot;Non-Returnable&quot; on the product page</li>
                    <li>Products damaged due to misuse or improper handling after delivery</li>
                </ul>
            </section>

            <section className="content-section">
                <h2>3. How to Initiate a Return</h2>
                <ol className="steps-list">
                    <li>Log in to your Swap Ecommerce Store account and open <strong>My Orders</strong>.</li>
                    <li>Select the order and item you wish to return and choose <strong>Return Item</strong>.</li>
                    <li>Select a reason for return (defective, wrong item, size issue, changed mind, etc.).</li>
                    <li>Submit the request. Our team will review and approve eligible returns within 24–48 hours.</li>
                    <li>Pack the item securely and hand it to the assigned pickup partner or ship to the address provided.</li>
                </ol>
            </section>

            <section className="content-section">
                <h2>4. Refunds</h2>
                <p>
                    After we receive and inspect your return, approved refunds are processed as follows:
                </p>
                <ul className="info-list">
                    <li><strong>Prepaid orders:</strong> Refund to the original payment method</li>
                    <li><strong>Cash on delivery:</strong> Refund via bank transfer or store credit</li>
                    <li><strong>Partial refunds:</strong> May apply if the product shows signs of use or missing components</li>
                </ul>
                <p>
                    Shipping charges are non-refundable unless the return is due to our error (wrong or defective item).
                </p>
            </section>

            <section className="content-section">
                <h2>5. Exchanges</h2>
                <p>
                    Where stock permits, you may exchange an item for a different size or color instead of a refund.
                    Exchange requests follow the same 7-day window and condition requirements. If the replacement is
                    unavailable, a full refund will be offered.
                </p>
            </section>

            <section className="content-section">
                <h2>6. Defective or Wrong Items</h2>
                <p>
                    If you receive a damaged, defective, or incorrect product, contact us within 48 hours of delivery
                    with photos of the item and packaging. We will arrange a free pickup and priority refund or
                    replacement at no extra cost to you.
                </p>
            </section>

            <section className="content-section">
                <h2>7. Cancellations</h2>
                <p>
                    Orders may be cancelled before shipment. Once dispatched, cancellation is not possible; you may
                    return the item after delivery subject to this policy.
                </p>
            </section>

            <section className="content-section legal-contact">
                <h2>Need Help?</h2>
                <p>
                    For return status or policy questions, email{' '}
                    <a href="mailto:swapnilmenkar@gmail.com">swapnilmenkar@gmail.com</a> or review our{' '}
                    <Link to="/disclaimer">Disclaimer</Link> for general terms.
                </p>
            </section>
        </div>
    );
};

export default ReturnPolicy;
