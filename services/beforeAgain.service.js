const fs = require('fs')
    , util = require('util')
    , path = require('path')
    , unlink = util.promisify(fs.unlink);

module.exports = {
  name: 'unlink',
  actions: {
    unlinkAll(ctx) {
      // console.log(ctx.params.str);
      return Promise.all([
        unlink(path.join(__dirname, '../public/libmelody/' + ctx.params.str + '.wav')),
        unlink(path.join(__dirname, '../public/libmelody/' + ctx.params.str + '.mid')),
        unlink(path.join(__dirname, '../public/libmelody/' + ctx.params.str + '.jams'))
      ]).then( () => 'ok');
    }
  }
};