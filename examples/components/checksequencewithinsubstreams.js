/**
 * This is is an ad hoc check program, checking that the IPs within each
 * substream are in descending order, and the right number in each substream -
 * assuming they were generated by GenSS...
 */

'use strict';

// checksequencewithinsubstreams.js

var IP = require('../../core/IP');

module.exports = function checksequencewithinsubstreams() {
  var inport = this.openInputPort('IN');
  var outport = this.openOutputPort('OUT');  //  optional
  var seq = -2;
  var count = 0;
  while (true) {
    var ip = inport.receive();
    if (ip === null) {
      break;
    }
    if (ip.type == IP.OPEN) {
      if (seq != -2) {
        console.log("Sequence error");
        return;
      }
      seq = -1;
      count = 5;
    }
    else if (ip.type == IP.CLOSE) {
      if (seq < 0) {
        console.log("Stream out of sequence - case 2");
        return;
      }
      if (count != 0) {
        console.log("Wrong number of IPs in substream");
        return;
      }
      seq = -2;
    }
    else {
      var s = ip.contents;
      var i = s.indexOf("abcd");
      var j = parseInt(s.substring(0, i));
      if (seq == -1) {
        //console.log("1st of substream " + j + ": " + s);
        seq = j;
      }
      else {
        if (j != seq - 1) {
          console.log("Stream out of sequence - case 3");
          return;
        }
        seq = j;
      }
      count--;
    }

    if (outport != null)
      outport.send(ip);
    else
      this.dropIP(ip);
  }
};
