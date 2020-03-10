const path = require('path')
    , {ServiceBroker} = require('moleculer');
    
let broker = new ServiceBroker({
  loggerLevel: 'INFO'
});

broker.loadService(path.join(__dirname, './services/http.service'));
broker.loadService(path.join(__dirname, './services/convert.service'));
broker.loadService(path.join(__dirname, './services/beforeAgain.service'));
broker.loadService(path.join(__dirname, './services/lookForMelodia.service'));
broker.loadService(path.join(__dirname, './services/forLibrary.service'));

broker.start();