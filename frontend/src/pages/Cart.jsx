import react from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import {removeFromCart, addToCart} from '../redux/cartSlice';


const Cart = () => {
    const cartItems = useSelector((state) => state.cart.cartItems);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRemove = (id) => {
        dispatch(removeFromCart(id));
    };

    const handleUpdateQty = (item, qty) => {
        if (qty > 0) {
            dispatch(addToCart({...item, qty}));
        }
    };

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.qty, 0);


    return (
        <div className="cart-page">
            <h2>Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <p className="cart-empty">Your cart is empty. <Link to='/shop'>Go Shopping</Link></p>
            ) : (
                <div className='cart-layout'>
                    <div className='cart-items'>
                        {cartItems.map((item) =>(
                            <div key={item.productId} className="cart-item">
                                <img src={item.imageUrl} alt={item.name} />
                                <div className="cart-item-info">
                                    <h4>{item.name}</h4>
                                    <p>₹{item.price}</p>
                                    <div className="cart-qty-controls">
                                        <button type="button" onClick={() => handleUpdateQty(item, item.qty - 1)}>-</button>
                                        <span>{item.qty}</span>
                                        <button type="button" onClick={() => handleUpdateQty(item, item.qty + 1)}>+</button>
                                    </div>
                                    <button type="button" className="btn-remove" onClick={() => handleRemove(item.productId)}>Remove</button>
                                </div>                                  
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h3>Total: ₹{totalPrice.toFixed(2)}</h3>
                        <button type="button" className="btn" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Cart;
