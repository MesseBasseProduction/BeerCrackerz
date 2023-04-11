const testContext = require.context('./spec/', true, /.spec.js$/);
testContext.keys().forEach(testContext);
