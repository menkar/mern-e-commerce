import React, { useEffect, useContext } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {removeFromCart, addToCart, reconcileCartStock} from '../redux/cartSlice';
import { useNotification } from '../context/NotificationContext';
import { validateCartQuantity, getStockLimitMessage } from '../utils/cartValidation';
import { formatCurrency } from '../utils/orderHelpers';
import { isAdmin } from '../utils/authHelpers';


const Cart = () => {
    const { user } = useContext(AuthContext);
    const cartItems = useSelector((state) => state.cart.cartItems);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { notify } = useNotification();

    useEffect(() => {
        if (isAdmin(user)) {
            navigate('/admin', { replace: true });
        }
    }, [user, navigate]);

    useEffect(() => {
        if (cartItems.length === 0) return;

        const itemsNeedingSync = cartItems.filter(
            (item) => typeof item.stock !== 'number' || item.qty > item.stock
        );

        if (itemsNeedingSync.length === 0) return;

        let cancelled = false;

        const syncStock = async () => {
            const stockById = {};

            await Promise.all(
                itemsNeedingSync.map(async (item) => {
                    try {
                        const res = await fetch(`/api/v1/products/${item.productId}`);
                        if (!res.ok) return;
                        const product = await res.json();
                        stockById[item.productId] = product.stock;
                    } catch {
                        /* keep existing cart item if product fetch fails */
                    }
                })
            );

            if (cancelled || Object.keys(stockById).length === 0) return;

            const adjustedItems = itemsNeedingSync.filter((item) => {
                const stock = stockById[item.productId];
                return typeof stock === 'number' && item.qty > stock;
            });

            dispatch(reconcileCartStock(stockById));

            if (adjustedItems.length > 0) {
                const names = adjustedItems.map((item) => item.name).join(', ');
                notify.warning(`Quantity updated to match available stock for: ${names}.`);
            }
        };

        syncStock();

        return () => {
            cancelled = true;
        };
    }, [cartItems, dispatch, notify]);

    const handleRemove = (id) => {
        dispatch(removeFromCart(id));
        notify.info('Item removed from your cart.');
    };

    const handleIncreaseQty = (item) => {
        const isAtMax = typeof item.stock === 'number' && item.qty >= item.stock;
        if (isAtMax) {
            notify.info(getStockLimitMessage(item.stock, item.name));
            return;
        }
        handleUpdateQty(item, item.qty + 1);
    };

    const handleUpdateQty = (item, qty) => {
        if (qty <= 0) {
            handleRemove(item.productId);
            return;
        }

        const stock = item.stock ?? Infinity;
        const validation = validateCartQuantity(stock, qty, item.name);

        if (!validation.allowed) {
            notify.error(validation.message);
            return;
        }

        dispatch(addToCart({ ...item, qty: validation.qty, stock }));

        if (validation.message) {
            notify.warning(validation.message);
        }
    };

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.qty, 0);
    const totalItems = cartItems.reduce((total, item) => total + item.qty, 0);

    if (isAdmin(user)) {
        return null;
    }

    return (
        <div className="cart-page">
            <div className="cart-page-inner">
                <header className="cart-header">
                    <h2>Shopping Cart</h2>
                    {cartItems.length > 0 && (
                        <p className="cart-item-count">{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
                    )}
                </header>

                {cartItems.length === 0 ? (
                    <p className="cart-empty">Your cart is empty. <Link to='/shop'>Go Shopping</Link></p>
                ) : (
                    <div className='cart-layout'>
                        <div className="cart-items-panel">
                            <div className="cart-table-header" aria-hidden="true">
                                <span>Product</span>
                                <span>Price</span>
                                <span>Quantity</span>
                                <span>Subtotal</span>
                            </div>
                            <div className='cart-items'>
                                {cartItems.map((item) => {
                                    const isAtMaxStock = typeof item.stock === 'number' && item.qty >= item.stock;
                                    return (
                                    <div key={item.productId} className="cart-item">
                                        <div className="cart-item-product">
                                            <img src={item.imageUrl} alt={item.name} />
                                            <div className="cart-item-details">
                                                <h4>{item.name}</h4>
                                                <p className="cart-item-unit-price">{formatCurrency(item.price)} each</p>
                                                {typeof item.stock === 'number' && (
                                                    <p className="cart-item-unit-price">{item.stock} in stock</p>
                                                )}
                                                <button type="button" className="btn-remove" onClick={() => handleRemove(item.productId)}>Remove</button>
                                            </div>
                                        </div>
                                        <div className="cart-item-price">{formatCurrency(item.price)}</div>
                                        <div className="cart-qty-wrap">
                                            <div className="cart-qty-controls">
                                                <button type="button" aria-label="Decrease quantity" onClick={() => handleUpdateQty(item, item.qty - 1)}>-</button>
                                                <span>{item.qty}</span>
                                                <button
                                                    type="button"
                                                    aria-label="Increase quantity"
                                                    onClick={() => handleIncreaseQty(item)}
                                                    className={isAtMaxStock ? 'cart-qty-plus--max' : ''}
                                                    title={isAtMaxStock ? `Maximum stock (${item.stock}) already in cart` : 'Increase quantity'}
                                                >+</button>
                                            </div>
                                            {isAtMaxStock && (
                                                <p className="cart-qty-limit-hint" role="status">
                                                    Maximum available stock reached.
                                                </p>
                                            )}
                                        </div>
                                        <div className="cart-item-subtotal">{formatCurrency(item.price * item.qty)}</div>
                                    </div>
                                );})}
                            </div>
                        </div>
                        <aside className="cart-summary">
                            <h3 className="cart-summary-title">Order Summary</h3>
                            <div className="cart-summary-row">
                                <span>Items ({totalItems})</span>
                                <span>{formatCurrency(totalPrice)}</span>
                            </div>
                            <div className="cart-summary-row">
                                <span>Delivery</span>
                                <span>Calculated at checkout</span>
                            </div>
                            <hr className="cart-summary-divider" />
                            <div className="cart-summary-total">
                                <span>Total</span>
                                <span>{formatCurrency(totalPrice)}</span>
                            </div>
                            <button type="button" className="btn" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
                            <p className="cart-summary-note">Secure checkout · Prices inclusive of applicable taxes where required</p>
                        </aside>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Cart;
