/**
 * Validates quantity against available stock before adding/updating cart.
 * Returns { allowed, qty, message, type }
 */
export const validateCartQuantity = (stock, requestedQty, productName = 'this item') => {
    const available = typeof stock === 'number' ? stock : Infinity;

    if (available <= 0) {
        return {
            allowed: false,
            qty: 0,
            message: `${productName} is currently out of stock.`,
            type: 'error',
        };
    }

    if (requestedQty > available) {
        return {
            allowed: true,
            qty: available,
            message: `Only ${available} unit${available === 1 ? '' : 's'} available for ${productName}. Quantity adjusted to ${available}.`,
            type: 'warning',
        };
    }

    return { allowed: true, qty: requestedQty, message: null, type: null };
};

export const getStockLimitMessage = (stock, productName = 'this item') => {
    const units = stock === 1 ? 'unit' : 'units';
    return `You already have the maximum available stock (${stock} ${units}) for ${productName}.`;
};
