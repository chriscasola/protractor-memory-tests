exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['app.spec.js'],
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {'args': ['lang=en-GB',  'enable-precise-memory-info' , 'js-flags=--expose-gc', 'no-sandbox']}
  },
};
