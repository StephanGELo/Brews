export const calculatePrice = items => {
    return `$${items
        .reduce((acc, item) => acc + item.price * item.quantity, 0)
        .toFixed(2)
        }`;
}