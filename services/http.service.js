const HTTPService = require('moleculer-web')
    , path = require('path')
    , fs = require('fs');

module.exports = {
  name: 'http',
  mixins: [HTTPService],

  settings: {
    routes: [
      {
        path: '/melodia',
        aliases: {
          "POST /post-wav"(req, res) {
            let fileName = Math.random().toString(36).slice(2);
            let filePath = path.join(__dirname, '../public/libmelody/' + fileName);
            let writeStream = fs.createWriteStream(filePath + '.wav');
            req.pipe(writeStream);

            req.on('end', () => {
              writeStream.end();
              this.broker.call("convert.wavToMid", {filePath, fileName})
                .then( fileName => {
                  res.end(fileName);
                })
                .catch( err => console.log(err));
            });
          },
          "GET /before-again": "unlink.unlinkAll",
          "GET /look-for-melodia": "lookForMelodia.lookFor",
          "POST /for-music-library": "forlibrary.addMelody"
        }
      }
    ],
  
    assets: {
      folder: path.join(__dirname, '../public'),
      options: {}
    }
  }

};