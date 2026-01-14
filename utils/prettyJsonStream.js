const { Transform } = require('stream');

function prettyJsonStream() {
  let first = true;

  return new Transform({
    writableObjectMode: true,

    transform(chunk, encoding, callback) {
      try {
        const prettyObject = JSON.stringify(chunk, null, 2)
          .split('\n')
          .map(line => '  ' + line)
          .join('\n');

        let output;
        if (first) {
          output = `[\n${prettyObject}`;
          first = false;
        } else {
          output = `,\n${prettyObject}`;
        }

        callback(null, output);
      } catch (err) {
        callback(err);
      }
    },

    final(callback) {
      callback(null, '\n]\n');
    }
  });
}

module.exports = prettyJsonStream;
