import React, {useState, useContext} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import {clearCart} from '../redux/cartSlice';
import { useNotification } from '../context/NotificationContext';
import apiFetch from '../utils/apiFetch';
import { formatCurrency } from '../utils/orderHelpers';

const Checkout = () => {
    const {user} = useContext(AuthContext);
    const cartItems = useSelector((state) => state.cart.cartItems);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { notify } = useNotification();

    const [address, setAddress] = useState({
        fullName: '', street: '', city: '', postalCode: '', country: ''
    });
    const [showBypassPrompt, setShowBypassPrompt] = useState(false);

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.qty, 0);

    const handlePayment = async () => {
        try {
            const orderRes = await apiFetch('/api/v1/payments/order', {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ amount: totalPrice}),
                loaderMessage: 'Preparing checkout...',
            });

            const orderData = await orderRes.json();

            if (!orderRes.ok) {
                notify.warning('Payment gateway is not configured. You can place a test order instead.');
                setShowBypassPrompt(true);
                return;
            }

            const options = {
                key: 'rzp_test_dummykey123',
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Swap Ecommerce Store",
                description: "Test Transaction",
                order_id: orderData.id,
                handler: async function(response) {
                    const verifyRes = await apiFetch('/api/v1/payments/verify', {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(response),
                        loaderMessage: 'Verifying payment...',
                    });

                    if (verifyRes.ok) {
                        const saveOrderRes = await apiFetch('/api/v1/orders', {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                        "Authorization": `Bearer ${user.token}`
                                                    },
                                                    body: JSON.stringify({
                                                        items: cartItems,
                                                        totalAmoount: totalPrice,
                                                        address,
                                                        paymemtId: response.reazorpay_payment_id
                                                    }),
                                                    loaderMessage: 'Placing your order...',
                                            });
                        if (saveOrderRes.ok) {
                            dispatch(clearCart());
                            navigate("/ordersuccess");
                        } else {
                            notify.error('Your payment was received but we could not save the order. Please contact support.');
                        }
                    } else {
                        notify.error('Payment verification failed. Please try again.');
                    }
                },
                prefill: {
                    name: address.fullName,
                    email: user?.email,
                    contact: '9999999999'
                },
                theme: {
                    color: '#0d9488'
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
                
        } catch(error) {
            console.log("Error occurred", error);
            notify.error('Something went wrong during checkout. Please try again.');
        }
    };

    const bypassPayment = async () => {
        const saveOrderRes = await apiFetch("/api/v1/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            },
            body: JSON.stringify({
                items: cartItems,
                totalAmount: totalPrice,
                address,
                payamentId: 'bypass_txn_' + Date.now()
            }),
            loaderMessage: 'Placing your order...',
        });

        if (saveOrderRes.ok) {
            dispatch(clearCart());
            setShowBypassPrompt(false);
            notify.success('Test order placed successfully!');
            navigate('/ordersuccess');
        } else {
            notify.error('Could not place the test order. Please try again.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            notify.info('Please log in before checkout.');
            navigate("/login");
            return;
        }

        handlePayment();
    };

    return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-content">
        {showBypassPrompt && (
          <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 shadow-sm">
            <p className="mb-3 font-medium">Payment gateway is unavailable. Would you like to place a test order?</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={bypassPayment} className="rounded-md bg-brand-teal px-4 py-2 text-sm font-semibold text-white hover:bg-brand-teal-dark transition-colors">
                Place Test Order
              </button>
              <button type="button" onClick={() => setShowBypassPrompt(false)} className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="shipping-form">
          <h3>Shipping Address</h3>
          <input type="text" placeholder="Full Name" required value={address.fullName} onChange={(e) => setAddress({...address, fullName: e.target.value})} />
          <input type="text" placeholder="Street" required value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} />
          <input type="text" placeholder="City" required value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} />
          <input type="text" placeholder="Postal Code" required value={address.postalCode} onChange={(e) => setAddress({...address, postalCode: e.target.value})} />
          <input type="text" placeholder="Country" required value={address.country} onChange={(e) => setAddress({...address, country: e.target.value})} />
          <div className="checkout-summary">
            <h4>Total to Pay: {formatCurrency(totalPrice)}</h4>
            <button type="submit" className="btn">Pay Now</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
