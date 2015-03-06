// jscs:disable maximumLineLength

/**
 * Check that basic regex features like lookahead are working.
 */

require('should');
var chunker = require('..');

describe('regex rules', function() {
  it('should support lookahead', function() {
    var tags = '01/CD March/NNP 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN';
    var res = chunker.chunk(tags, '[ { word:/January|February|March|April|May|June|July|August|September|October|November|December/ } ]', 'MONTH');

    res = chunker.chunk(res, '[ { word:\\d{1,2} } ](?=[ { chunk:MONTH } ])', 'DAY');

    res.should.equal('[DAY 01/CD] [MONTH March/NNP] 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN');
  });
});
