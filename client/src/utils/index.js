const CART_KEY = 'cart'

export const calculatePrice = items => {
    return `$${items
        .reduce((acc, item) => acc + item.price * item.quantity, 0)
        .toFixed(2)
        }`;
}

export const setCart = (value, cartKey = CART_KEY) => {
    if (localStorage) {
        localStorage.setItem(cartKey, JSON.stringify(value));
    }
}

export const getCart = (cartKey = CART_KEY) => {
    if (localStorage && localStorage.getItem(cartKey)) {
        return JSON.parse(localStorage.getItem(cartKey));
    }
    return [];
}