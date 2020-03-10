const fs = require('fs')
    , util = require('util')
    , path = require('path')
    , unlink = util.promisify(fs.unlink)
    , readFile = util.promisify(fs.readFile);
    
module.exports = {
  name: 'lookForMelodia',
  actions: {
    lookFor(ctx) {
      let file = fs.readFileSync(path.join(__dirname, `../public/libmelody/${ctx.params.filename}.jams`));
      let dataObj = JSON.parse(file).annotations[0].data;
      let resRelTones = this.makeRelationTones(dataObj.value);
      let resRelDurations = this.makeRelationDurations(dataObj.time);
                                        // console.log(resRelTones);
                                        // console.log(resRelDurations);
      let subKey = '';
      if(resRelTones.length > 5) {
        for(let k=0; k<5; k++) {
          subKey += resRelTones[k];
        }
      } else {
        return Promise.all(this.unlinkAll(ctx))
          .then( () => 'Phrase too short, try again...');
      }

      return readFile(path.join(__dirname, '../public/libmelody/library.json'))
        .then( (lib) => {
          let libObj = JSON.parse(lib);
          
          let tonesConform = 0;
          let durationsConform = 0;
          let Keys = Object.keys(libObj);
          
          for(let key of Keys) {
            if(~key.indexOf(subKey)) {
              for(var i=0; i<resRelTones.length; i++) {
                if(resRelTones[i] == libObj[key].reltones[i])
                  tonesConform++;
              }
              for(var j=0; j<resRelDurations.length; j++) {
                if(resRelDurations[j] == libObj[key].reldurat[j])
                  durationsConform++;
              }

              if(tonesConform/(resRelTones.length/100)>40 && durationsConform/(resRelDurations.length/100)>40) {
                Promise.all(this.unlinkAll(ctx))
                  .catch( err => console.log(err));
                return libObj[key].musicdata;
              } else {
                Promise.all(this.unlinkAll(ctx))
                  .catch( err => console.log(err));
                return 'In library melodia not found.';
              }
            }
          }
          
          Promise.all(this.unlinkAll(ctx))
            .catch( err => console.log(err));
          return 'Melodia not found.';
        });
    }
  },

  methods: {
    makeRelationTones(arr) {
      let result = [];
      for(let i=0; i<arr.length-1; i++) {
        result.push(this.relationTones(arr[i+1], arr[i]));
      }
      return result;
    },
    makeRelationDurations(time) {
      let durations = [];
      let rel = [];
      let temp;
      for(let i=0; i<time.length-1; i++) {
        durations.push(time[i+1] - time[i]);
      }
      
      for(let k=0; k<durations.length-1; k++) {
        temp = durations[k+1]/durations[0];
        if(temp < 0.6 && temp > 0.3) {
          temp = 1/2;
          rel.push(temp)
        } else if(temp <= 0.3) {
          temp = 1/4;
          rel.push(temp)
        } else if(temp > 1.5 && temp <= 2.5) {
          rel.push(Math.floor(temp));
        } else if(temp > 2.5 && temp <= 3.5) {
          rel.push(Math.round(temp));
        } else {
          rel.push(Math.round(temp));
        }
      }
      return rel;
    },
    relationTones(next, previous) {
      switch(next - previous) {
        case 0:
          return '1-1';
        case 1:
          return 'm-2-UP';
        case 2:
          return 'b-2-UP';
        case 3:
          return 'm-3-UP';
        case 4:
          return 'b-3-UP';
        case 5:
          return 'c-4-UP';
        case 6:
          return 'u-4-UP';
        case 7:
          return 'c-5-UP';
        case 8:
          return 'm-6-UP';
        case 9:
          return 'b-6-UP';
        case 10:
          return 'm-7-UP';
        case 11:
          return 'b-7-UP';
        case 12:
          return 'c-8-UP';

        case -1:
          return 'm-2-DN';
        case -2:
          return 'b-2-DN';
        case -3:
          return 'm-3-DN';
        case -4:
          return 'b-3-DN';
        case -5:
          return 'c-4-DN';
        case -6:
          return 'u-4-DN';
        case -7:
          return 'c-5-DN';
        case -8:
          return 'm-6-DN';
        case -9:
          return 'b-6-DN';
        case -10:
          return 'm-7-DN';
        case -11:
          return 'b-7-DN';
        case -12:
          return 'c-8-DN';

        default:
          return '0-0-0';
      }
    },
    unlinkAll(ctx) {
      return [
        unlink(path.join(__dirname, '../public/libmelody/' + ctx.params.filename + '.wav')),
        unlink(path.join(__dirname, '../public/libmelody/' + ctx.params.filename + '.mid')),
        unlink(path.join(__dirname, '../public/libmelody/' + ctx.params.filename + '.jams'))
      ];
    }

  }
};