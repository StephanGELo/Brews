module.exports = {
    index: async ctx => {
        await strapi.plugins['email'].services.email.send({
            to: "webdevtest21@protonmail.ch",
            from: "webdevtest21@protonmail.ch",
            replyTo: "webdevtest21@protonmail.ch",
            subject: "Testing Sendgrid and Strapi",
            text: 'Sendgrid email'
        });
        ctx.send('Email Sent!');
    }
}