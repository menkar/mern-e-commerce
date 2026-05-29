import React, {useState, useContext, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import {clearCart} from '../redux/cartSlice';
import { useNotification } from '../context/NotificationContext';
import apiFetch from '../utils/apiFetch';
import { formatCurrency } from '../utils/orderHelpers';
import { getTestPaymentHint, isTestRazorpayKey, TEST_PAYMENT_STEPS, getPaymentErrorMessage } from '../utils/paymentHelpers';

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
    const [isTestMode, setIsTestMode] = useState(false);

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.qty, 0);

    const buildOrderItems = () =>
        cartItems.map(({ productId, qty, price }) => ({ productId, qty, price }));

    const saveOrderAfterPayment = async (paymentId) => {
        const saveOrderRes = await apiFetch('/api/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
                items: buildOrderItems(),
                totalAmount: totalPrice,
                address,
                paymentId,
            }),
            loaderMessage: 'Placing your order...',
        });

        if (saveOrderRes.ok) {
            dispatch(clearCart());
            navigate('/ordersuccess');
            return true;
        }

        notify.error('Your payment was received but we could not save the order. Please contact support.');
        return false;
    };

    useEffect(() => {
        let isMounted = true;

        const loadPaymentConfig = async () => {
            try {
                const res = await apiFetch('/api/v1/payments/config');
                const data = await res.json();
                if (isMounted) {
                    setIsTestMode(Boolean(data?.configured && data?.is_test_mode));
                }
            } catch {
                if (isMounted) {
                    setIsTestMode(false);
                }
            }
        };

        loadPaymentConfig();
        return () => {
            isMounted = false;
        };
    }, []);

    const handlePayment = async () => {
        try {
            const orderRes = await apiFetch('/api/v1/payments/order', {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ amount: totalPrice}),
                loaderMessage: 'Preparing checkout...',
            });

            const orderData = await orderRes.json();

            if (!orderRes.ok || !orderData?.id || !orderData?.key_id) {
                notify.warning('Payment gateway is not configured. You can place a test order instead.');
                setShowBypassPrompt(true);
                return;
            }

            const paymentIsTestMode = orderData.is_test_mode ?? isTestRazorpayKey(orderData.key_id);
            setIsTestMode(paymentIsTestMode);

            if (paymentIsTestMode) {
                notify.info('Test mode: use UPI ID success@razorpay or test card. UPI QR scan will not work.');
            }

            const options = {
                key: orderData.key_id,
                name: 'Swap Ecommerce Store',
                description: 'Order Payment',
                order_id: orderData.id,
                currency: 'INR',
                retry: { enabled: true, max_count: 3 },
                handler: async function(response) {
                    const verifyRes = await apiFetch('/api/v1/payments/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(response),
                        loaderMessage: 'Verifying payment...',
                    });

                    if (!verifyRes.ok) {
                        const verifyData = await verifyRes.json().catch(() => ({}));
                        notify.error(verifyData?.message || 'Payment verification failed. Please try again.');
                        return;
                    }

                    await saveOrderAfterPayment(response.razorpay_payment_id);
                },
                modal: {
                    ondismiss: () => {
                        notify.info('Payment window closed.');
                    },
                },
                prefill: {
                    name: address.fullName || user?.name || '',
                    email: user?.email || '',
                },
                theme: {
                    color: '#0d9488',
                },
            };

            const rzp1 = new window.Razorpay(options);

            rzp1.on('payment.failed', function (response) {
                notify.warning(getPaymentErrorMessage(response, paymentIsTestMode));
            });

            rzp1.open();
                
        } catch(error) {
            console.log("Error occurred", error);
            notify.error('Something went wrong during checkout. Please try again.');
        }
    };

    const bypassPayment = async () => {
        const saved = await saveOrderAfterPayment(`bypass_txn_${Date.now()}`);
        if (saved) {
            setShowBypassPrompt(false);
            notify.success('Test order placed successfully!');
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
        {isTestMode && (
          <div className="checkout-payment-hint" role="note">
            <p className="checkout-payment-hint__title">Razorpay test mode</p>
            <p className="checkout-payment-hint__summary">{getTestPaymentHint()}</p>
            <ol className="checkout-payment-hint__steps">
              {TEST_PAYMENT_STEPS.map((step) => (
                <li key={step.title}>
                  <strong>{step.title}:</strong> {step.detail}
                </li>
              ))}
            </ol>
          </div>
        )}
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
          <p className="checkout-payment-note">
            Payments are accepted in INR only. Use a domestic Indian card, UPI, or Netbanking.
          </p>
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
