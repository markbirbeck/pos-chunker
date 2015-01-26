var should = require('should');
var chunker = require('..');

describe('convert', function(){
  it('should convert a token to a new tag', function(){
    var tags = '01/CD March/NNP 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN';
    var res = chunker.convert(tags, '[ { word:/January|February|March|April|May|June|July|August|September|October|November|December/ } ]', 'MONTH');

    res.should.equal('01/CD (MONTH March/NNP) 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN');
  });

  it('should convert three consecutive tokens to a new tag', function(){
    var tags = '01/CD March/NNP 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN';
    var res = chunker.convert(tags, '[ { tag:/CD/ } ] [ { tag:/NNP/ } ] [ { tag:/CD/ } ]', 'DATE');

    res.should.equal('(DATE 01/CD March/NNP 2015/CD) Chinese/JJ New/NNP Year/NN Dinner/NN');
  });
});