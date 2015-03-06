// jscs:disable maximumLineLength

/**
 * Check that basic regex features like lookahead are working.
 */

require('should');
var chunker = require('..');

describe('regex rules', function() {
  it('should match one or more with \'+\'', function() {
    var tags = '01/CD March/NNP 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN';
    var res = chunker.chunk(tags, '[ { tag:NNP? } ]+', 'NOUNS');

    res.should.equal('01/CD [NOUNS March/NNP] 2015/CD Chinese/JJ [NOUNS New/NNP Year/NN Dinner/NN]');
  });

  it('should match two or more with \'{2,}\'', function() {
    var tags = '01/CD March/NNP 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN';
    var res = chunker.chunk(tags, '[ { tag:NNP? } ]{2,}', 'NOUNS');

    res.should.equal('01/CD March/NNP 2015/CD Chinese/JJ [NOUNS New/NNP Year/NN Dinner/NN]');
  });

  it('should support lookahead', function() {
    var tags = '01/CD March/NNP 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN';
    var res = chunker.chunk(tags, '[ { word:/January|February|March|April|May|June|July|August|September|October|November|December/ } ]', 'MONTH');

    res = chunker.chunk(res, '[ { word:\\d{1,2} } ](?=[ { chunk:MONTH } ])', 'DAY');

    res.should.equal('[DAY 01/CD] [MONTH March/NNP] 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN');
  });
});
