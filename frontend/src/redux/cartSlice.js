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

const initialState = {
    cartItems: loadCartItems(),
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const stock = typeof item.stock === 'number' ? item.stock : Infinity;
            const existItem = state.cartItems.find((x) => x.productId === item.productId);

            let qty = item.qty ?? 1;
            if (existItem && item.qty === undefined) {
                qty = existItem.qty + 1;
            }

            qty = Math.max(1, Math.min(qty, stock));

            const cartItem = {
                productId: item.productId,
                name: item.name,
                price: item.price,
                imageUrl: item.imageUrl,
                qty,
                stock: typeof item.stock === 'number' ? item.stock : existItem?.stock,
            };

            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x.productId === item.productId ? cartItem : x
                );
            } else {
                state.cartItems.push(cartItem);
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x.productId !== action.payload);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem('cartItems');
        },
        reconcileCartStock: (state, action) => {
            const stockById = action.payload;
            state.cartItems = state.cartItems
                .map((item) => {
                    const stock = stockById[item.productId];
                    if (typeof stock !== 'number') return item;

                    if (stock <= 0) return null;

                    const qty = Math.min(item.qty, stock);
                    return { ...item, stock, qty };
                })
                .filter(Boolean);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        }
    }
});

export const { addToCart, removeFromCart, clearCart, reconcileCartStock } = cartSlice.actions;
export default cartSlice.reducer;
