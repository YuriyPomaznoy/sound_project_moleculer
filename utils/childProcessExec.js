var execFile = require('child_process').execFile;

function childProcessExecFile(p, ...args) {
  return new Promise(function(resolve, reject) {
    execFile(p, args, function(err) {
      if(err) reject(err);
      let out = args[args.length-4].split('.');
      resolve(out[0]);
    });
  });
}

module.exports = childProcessExecFile;