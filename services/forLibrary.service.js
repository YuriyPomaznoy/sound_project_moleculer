const fs = require('fs')
    , util = require('util')
    , path = require('path')
    , writeFile = util.promisify(fs.writeFile)
    , unlink = util.promisify(fs.unlink);

module.exports = {
  name: 'forlibrary',
  actions: {
    addMelody(ctx) {
      let upData = ctx.params;
      let dataFile = fs.readFileSync(path.join(__dirname, `../public/libmelody/${upData.filename}.jams`));
      let dataObj = JSON.parse(dataFile).annotations[0].data;

      let resRelTones = this.makeRelationTones(dataObj.value);
      let resRelDurations = this.makeRelationDurations(dataObj.time);

      let key = '';
      for(let k=0; k<10; k++) {
        key += resRelTones[k];
      }

      let libFile = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/libmelody/library.json')));
      libFile[key] = {};
      libFile[key]['reltones'] = resRelTones;
      libFile[key]['reldurat'] = resRelDurations;
      libFile[key]['musicdata'] = upData.musicdata;

      return writeFile(path.join(__dirname, '../public/libmelody/library.json'), JSON.stringify(libFile))
        .then( () => {
          Promise.all(this.unlinkAll(ctx))
            .catch( err => console.log(err));
          return 'WRITE-OK';
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

// Context< {
//   id: '587d793a-ef74-42e7-8293-d57cfd5867e4',
//   nodeID: 'yur-pc-3076',
//   action: { name: 'forlibrary.addMelody' },
//   service: { name: 'forlibrary', version: undefined, fullName: 'forlibrary' },
//   options: {
//     parentCtx: Context< {
//       id: '7c9602db-789b-462d-8b1b-803376f9afa5',
//       nodeID: 'yur-pc-3076',
//       action: { name: 'http.rest' },
//       service: { name: 'http', version: undefined, fullName: 'http' },
//       options: { requestID: undefined, timeout: 0 },
//       parentID: null,
//       caller: null,
//       level: 1,
//       params: {
//         req: IncomingMessage {
//           _readableState: [ReadableState],
//           readable: false,
//           _events: [Object: null prototype],
//           _eventsCount: 1,
//           _maxListeners: undefined,
//           socket: [Socket],
//           connection: [Socket],
//           httpVersionMajor: 1,
//           httpVersionMinor: 1,
//           httpVersion: '1.1',
//           complete: true,
//           headers: [Object],
//           rawHeaders: [Array],
//           trailers: {},
//           rawTrailers: [],
//           aborted: false,
//           upgrade: false,
//           url: '/for-music-library',
//           method: 'POST',
//           statusCode: null,
//           statusMessage: null,
//           client: [Socket],
//           _consuming: true,
//           _dumped: false,
//           '$startTime': [Array],
//           '$service': [Service],
//           '$next': undefined,
//           '$ctx': [Context],
//           originalUrl: '/melodia/for-music-library',
//           parsedUrl: '/melodia/for-music-library',
//           query: {},
//           baseUrl: '/melodia',
//           '$route': [Object],
//           body: [Object],
//           _body: true,
//           length: undefined,
//           '$params': [Object],
//           '$alias': [Alias],
//           '$endpoint': [ActionEndpoint],
//           '$action': [Object]
//         },
//         res: ServerResponse {
//           _events: [Object: null prototype],
//           _eventsCount: 1,
//           _maxListeners: undefined,
//           outputData: [],
//           outputSize: 0,
//           writable: true,
//           _last: false,
//           chunkedEncoding: false,
//           shouldKeepAlive: true,
//           useChunkedEncodingByDefault: true,
//           sendDate: true,
//           _removedConnection: false,
//           _removedContLen: false,
//           _removedTE: false,
//           _contentLength: null,
//           _hasBody: true,
//           _trailer: '',
//           finished: false,
//           _headerSent: false,
//           socket: [Socket],
//           connection: [Socket],
//           _header: null,
//           _onPendingData: [Function: bound updateOutgoingData],
//           _sent100: false,
//           _expect_continue: false,
//           '$service': [Service],
//           locals: {},
//           '$ctx': [Context],
//           '$route': [Object],
//           [Symbol(kNeedDrain)]: false,
//           [Symbol(isCorked)]: false,
//           [Symbol(kOutHeaders)]: [Object: null prototype]
//         }
//       },
//       meta: {},
//       requestID: '7c9602db-789b-462d-8b1b-803376f9afa5',
//       tracing: null,
//       span: null,
//       needAck: null,
//       ackID: null,
//       eventName: null,
//       eventType: null,
//       eventGroups: null,
//       cachedResult: false
//     } >,
//     timeout: 0
//   },
//   parentID: '7c9602db-789b-462d-8b1b-803376f9afa5',
//   caller: 'http',
//   level: 2,
//   params: { filename: 'ihmznypkfir', musicdata: '' },
//   meta: {},
//   requestID: '7c9602db-789b-462d-8b1b-803376f9afa5',
//   tracing: null,
//   span: null,
//   needAck: null,
//   ackID: null,
//   eventName: null,
//   eventType: null,
//   eventGroups: null,
//   cachedResult: false
// } >