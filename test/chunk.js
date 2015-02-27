var should = require('should');
var chunker = require('..');

describe('chunk', function(){
  it('should match a chunk', function(){
    var tags = '01/CD March/NNP 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN';
    var chunks = chunker.chunk(tags, '[ { word:/January|February|March|April|May|June|July|August|September|October|November|December/ } ]', 'MONTH');

    chunks.should.equal('01/CD (MONTH March/NNP) 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN');

    var res = chunker.chunk(chunks, '[ { chunk:"MONTH" } ] [ { word:"\\d{4}" } ]');
    res.should.equal('01/CD [(MONTH March/NNP) 2015/CD] Chinese/JJ New/NNP Year/NN Dinner/NN');
  });

  it('should match a chunk with lookahead', function(){
    var tags = '01/CD March/NNP 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN';
    var res = chunker.chunk(tags, '[ { word:\\d{1,2} } ](?=\\s[ { word:/January|February|March|April|May|June|July|August|September|October|November|December/ } ])', 'DAY');

    res.should.equal('(DAY 01/CD) March/NNP 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN');
  });

  it('should not get confused by multiple chunks', function(){
    var tags = '8/CD January/NNP 2014/CD TO/TO 28/CD March/NNP 2014/CD';
    var chunks = chunker.chunk(tags, '[ { word:/January|February|March|April|May|June|July|August|September|October|November|December/ } ]', 'MONTH');

    chunks.should.equal('8/CD (MONTH January/NNP) 2014/CD TO/TO 28/CD (MONTH March/NNP) 2014/CD');

    var res = chunker.chunk(chunks, '[ { chunk:"MONTH" } ] [ { word:"\\d{4}" } ]');
    res.should.equal('8/CD [(MONTH January/NNP) 2014/CD] TO/TO 28/CD [(MONTH March/NNP) 2014/CD]');
  });

  it('should cope with multiple layers of chunking', function(){
    var tags = '8/CD January/NNP 2014/CD TO/TO 28/CD March/NNP 2014/CD';
    var months = chunker.chunk(tags, '[ { word:/January|February|March|April|May|June|July|August|September|October|November|December/ } ]', 'MONTH');

    months.should.equal('8/CD (MONTH January/NNP) 2014/CD TO/TO 28/CD (MONTH March/NNP) 2014/CD');

    var dates = chunker.chunk(months, '[ { word:"\\d{1,2}" } ] [ { chunk:"MONTH" } ] [ { word:"\\d{4}" } ]', 'DATE');
    dates.should.equal('(DATE 8/CD (MONTH January/NNP) 2014/CD) TO/TO (DATE 28/CD (MONTH March/NNP) 2014/CD)');

    var res = chunker.chunk(dates, '[ { chunk:"DATE" } ]');
    res.should.equal('[(DATE 8/CD (MONTH January/NNP) 2014/CD)] TO/TO [(DATE 28/CD (MONTH March/NNP) 2014/CD)]');
  });

  it('should not look ahead too far', function(){
    var tags = '8/CD January/NNP TO/TO 28/CD March/NNP 2014/CD';
    var months = chunker.chunk(tags, '[ { word:/January|February|March|April|May|June|July|August|September|October|November|December/ } ]', 'MONTH');

    months.should.equal('8/CD (MONTH January/NNP) TO/TO 28/CD (MONTH March/NNP) 2014/CD');

    var dates = chunker.chunk(months, '[ { word:"\\d{1,2}" } ] [ { chunk:"MONTH" } ] [ { word:"\\d{4}" } ]', 'DATE');
    dates.should.equal('8/CD (MONTH January/NNP) TO/TO (DATE 28/CD (MONTH March/NNP) 2014/CD)');

    var res = chunker.chunk(dates, '[ { chunk:"DATE" } ]');
    res.should.equal('8/CD (MONTH January/NNP) TO/TO [(DATE 28/CD (MONTH March/NNP) 2014/CD)]');
  });
});