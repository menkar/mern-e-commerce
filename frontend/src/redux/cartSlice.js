import { createSlice } from "@reduxjs/toolkit";

const loadCartItems = () => {
    try {
        const stored = localStorage.getItem('cartItems');
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const getItemId = (item) => item._id ?? item.productId;

const initialState = {
    cartItems: loadCartItems()
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const cartItems = Array.isArray(state.cartItems) ? state.cartItems : [];
            const existItem = cartItems.find(
                (stateItem) => getItemId(stateItem) === getItemId(item)
            );
            if (existItem) {
                state.cartItems = cartItems.map((x) =>
                    getItemId(x) === getItemId(item) ? item : x
                );
            } else {
                state.cartItems = [...cartItems, item];
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeFromCart: (state, action) => {
            const itemId = action.payload;
            state.cartItems = (Array.isArray(state.cartItems) ? state.cartItems : []).filter(
                (x) => getItemId(x) !== itemId
            );
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem('cartItems');
        }
    }
});

export const {addToCart, removeFromCart, clearCart} = cartSlice.actions;
export default cartSlice.reducer;