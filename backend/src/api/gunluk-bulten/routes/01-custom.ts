export default {
  routes: [
    {
      method: 'POST',
      path: '/gunluk-bulten/send-now',
      handler: 'gunluk-bulten.sendNow',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/gunluk-bulten/preview',
      handler: 'gunluk-bulten.preview',
      config: {
        auth: false,
      },
    },
  ],
};
