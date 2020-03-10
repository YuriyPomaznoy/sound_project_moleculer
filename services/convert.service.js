const fs = require('fs')
    , path = require('path')
    , childProcessExec = require('../utils/childProcessExec')
    , synth = require('synth-js');

module.exports = {
  name: 'convert',
  actions: {
    wavToMid(ctx) {
      // let fileName = Math.random().toString(36).slice(2);
      // let filesPath = path.join(__dirname, '../public/libmelody/' + fileName);
      // let writeStream = fs.createWriteStream(filesPath + '.wav');
      // writeStream.write(ctx.params);
      // writeStream.end();
      // console.log(ctx.params);
      return childProcessExec('python', 'c:/audio_to_midi_melodia/audio_to_midi_melodia.py', 
        '--smooth', '0.50', '--minduration', '0.2', 
        `${ctx.params.filePath}.wav`, `${ctx.params.filePath}.mid`, '--jams', '60')
          .then( path => {
            let midBuffer = fs.readFileSync(path + '.mid');
            let wavBuffer = synth.midiToWav(midBuffer).toBuffer();
            fs.writeFileSync(`${path}.wav`, wavBuffer, {encoding: 'binary'});
            return `/libmelody/${ctx.params.fileName}.wav`;
          });
    }
  }

};