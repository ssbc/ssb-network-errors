const BENIGN_STREAM_END = {
  // stream closed okay, ssb-js variant
  'unexpected end of parent stream': true,

  // stream closed okay, go-ssb variant
  'muxrpc: session terminated': true,
};

const STREAM_ERRORS = {
  ...BENIGN_STREAM_END,
  'unexpected hangup': true, // stream closed probably okay
  'read EHOSTUNREACH': true,
  'read ECONNRESET': true,
  'read ENETDOWN': true,
  'read ETIMEDOUT': true,
  'write ECONNRESET': true,
  'write EPIPE': true,
  'stream is closed': true, // rpc method called after stream ended
  'parent stream is closing': true,
};

function detectSsbNetworkErrors(err) {
  const msg = err.message;
  if (msg in STREAM_ERRORS) {
    if (msg in BENIGN_STREAM_END) {
      if (err instanceof Error) {
        err.severity = 0;
      } else {
        err.severity = 1;
      }
    } else {
      err.severity = 2;
    }
  } else {
    err.severity = 3;
  }
  return err;
}

module.exports = detectSsbNetworkErrors;
