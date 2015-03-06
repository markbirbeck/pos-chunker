// jscs:disable maximumLineLength

/**
 * By 'convert' we mean, take some sequence of tokens and collect them together
 * under a new tag name:
 */

require('should');
var chunker = require('..');

describe('convert', function() {
  it('should convert a token to a new tag', function() {
    var tags = '01/CD March/NNP 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN';
    var res = chunker.chunk(tags, '[ { word:/January|February|March|April|May|June|July|August|September|October|November|December/ } ]', 'MONTH');

    res.should.equal('01/CD [MONTH March/NNP] 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN');
  });

  it('should convert three consecutive tokens to a new tag', function() {
    var tags = '01/CD March/NNP 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN';
    var res = chunker.chunk(tags, '[ { tag:/CD/ } ] [ { tag:/NNP/ } ] [ { tag:/CD/ } ]', 'DATE');

    res.should.equal('[DATE 01/CD March/NNP 2015/CD] Chinese/JJ New/NNP Year/NN Dinner/NN');
  });

  it('should honour word boundaries', function() {
    var tags = 'The/DT 1935/CD march/NN across/IN the/DT Jinsha/NN River/NNP ./.';
    var res = chunker.chunk(tags, '[ { word:/[Jj]anuary|[Ff]ebruary|[Mm]arch|[Aa]pril|[Mm]ay|[Jj]une|[Jj]uly|[Aa]ugust|[Ss]eptember|[Oo]ctober|[Nn]ovember|[Dd]ecember/ } ]', 'MONTH');

    res = chunker.chunk(res, '[ { word:\\d{1,2} } ](?=[ { chunk:MONTH } ])', 'DAY');

    res.should.equal('The/DT 1935/CD [MONTH march/NN] across/IN the/DT Jinsha/NN River/NNP ./.');
  });
});
