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

      describe('chunker.chunk()', function() {
        it('test', function() {
          var NP = {
            ruleType: 'tokens',
            pattern: '[ { tag:/DT|JJ|NN.*?/ } ]+',
            result: 'NP'
          };
          var PP = {
            ruleType: 'tokens',
            pattern: '[ { tag:IN } ] [ { chunk:NP } ]',
            result: 'PP'
          };
          var VP = {
            ruleType: 'tokens',
            pattern: '[ { tag:/VB.*?/ } ] [ { chunk:/NP|PP/ } ]+',
            result: 'VP'
          };
          var CLAUSE = {
            ruleType: 'tokens',
            pattern: '[ { chunk:NP } ] [ { chunk:VP } ]',
            result: 'CLAUSE'
          };
          var rules = [NP, PP, VP, CLAUSE];

          chunker.chunk(
            'The/DT doctor/NN saw/VBD the/DT patient/NN at/IN the/DT surgery/NN ./.',
            rules
          ).should.equal(
            '[CLAUSE [NP The/DT doctor/NN] [VP saw/VBD [NP the/DT patient/NN] [PP at/IN [NP the/DT surgery/NN]]]] ./.'
          );

          chunker.chunk(
            'Mary/NN saw/VBD the/DT cat/NN sit/VB on/IN the/DT mat/NN ./.',
            rules
          ).should.equal(
            '[CLAUSE [NP Mary/NN] [VP saw/VBD [NP the/DT cat/NN]]] [VP sit/VB [PP on/IN [NP the/DT mat/NN]]] ./.'
          );
        });
      });
    });
  });
});
