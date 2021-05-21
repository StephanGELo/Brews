'use strict';

const { default: createStrapi } = require("strapi");
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(`${stripeSecretKey}`)
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async create(ctx) {
        const { address, amount, brews, postalCode, token, city } = ctx.request.body;

        // Send charges to Stripe
        const charge = await stripe.charges.create({
            amount: amount * 100,
            currency: 'usd',
            description: `Order ${new Date(Date.now())} - User ${ctx.state.user._id}`,
            source: token
        });

        // Create order in database
        const order = await strapi.services.orders.create({
            user: ctx.state.user._id,
            address,
            amount,
            brews,
            postalCode,
            city
        });

        return order;
    }
};
