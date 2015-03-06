// jscs:disable maximumLineLength

/**
 * Make sure all the examples in the README actually work.
 */

require('should');
var chunker = require('..');

describe('README examples', function() {
  describe('illustration:', function() {
    describe('rules:', function() {
      describe('words:', function() {
        it('lookbehind', function() {
          chunker.chunk(
            'Shall/MD we/PRP have/VBP dinner/NN ?/.',
            '(?<=[ { word:have } ]) [ { word:/.*?/ } ]'
          ).should.equal(
            'Shall/MD we/PRP have/VBP {dinner/NN} ?/.'
          );
        });
      });
    });
  });
});
