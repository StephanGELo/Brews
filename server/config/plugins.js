module.exports = ({ env }) => ({
  // ...
  email: {
    provider: 'sendgrid',
    providerOptions: {
      apiKey: env('SENDGRID_API_KEY'),
    },
    settings: {
      defaultFrom: 'webdevtest21@protonmail.ch',
      defaultReplyTo: 'webdevtest21@protonmail.ch',
      testAddress: 'webdevtest21@protonmail.ch',
    },
  },
  // ...
});