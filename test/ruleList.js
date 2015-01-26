var should = require('should');
var chunker = require('..');

describe('rules list', function(){
  it('should match a set of chunking rules', function(){
    var tags = '01/CD March/NNP 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN';
    var rules = [
      {
        ruleType: 'tokens',
        pattern: '[ { word:/January|February|March|April|May|June|July|August|September|October|November|December/ } ]',
        result: 'MONTH'
      },
      {
        ruleType: 'tokens',
        pattern: '[ { word:\\d{1,2} } ](?=\\s[ { chunk:"MONTH" } ])',
        result: 'DAY'
      },
      {
        ruleType: 'tokens',
        pattern: '[ { word:\\d{4} } ]',
        result: 'YEAR'
      },
      {
        ruleType: 'tokens',
        pattern: '[ { chunk:"DAY" } ] [ { chunk:"MONTH" } ] [ { chunk:"YEAR" } ]',
        result: 'DATE'
      }
    ];
    var res = chunker.chunk(tags, rules);

    res.should.equal('(DATE (DAY 01/CD) (MONTH March/NNP) (YEAR 2015/CD)) Chinese/JJ New/NNP Year/NN Dinner/NN');
  });
});