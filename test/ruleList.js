var should = require('should');
var chunker = require('..');

describe('rules list', function(){
  it('should match a set of date chunking rules', function(){
    var tags = '01/CD March/NNP 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN';
    var rules = [
      {
        ruleType: 'tokens',
        pattern: '[ { word:/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/ } ]',
        description: 'Days of the week.',
        result: 'DAYOFWEEK'
      },
      {
        ruleType: 'tokens',
        pattern: '[ { word:/January|February|March|April|May|June|July|August|September|October|November|December/ } ]',
        result: 'MONTH'
      },
      {
        ruleType: 'tokens',
        pattern: '[ { word:\\d{1,2} } ](?=\\s[ { chunk:"MONTH" } ])',
        description: 'Day number.',
        result: 'DAY'
      },
      {
        ruleType: 'tokens',
        pattern: '[ { word:\\d{4} } ]',
        description: 'Year.',
        result: 'YEAR'
      },
      {
        ruleType: 'tokens',
        pattern: '([ { chunk:"DAYOFWEEK" } ] )?[ { chunk:"DAY" } ] [ { chunk:"MONTH" } ]',
        description: 'Relative date, i.e., one without a year.',
        result: 'RELATIVEDATE'
      },
      {
        ruleType: 'tokens',
        pattern: '[ { chunk:"RELATIVEDATE" } ] [ { chunk:"YEAR" } ]',
        description: 'Absolute date, i.e., a relative date plus a year.',
        result: 'ABSOLUTEDATE'
      },
      {
        ruleType: 'tokens',
        patternx: '[ { chunk:"ABSOLUTEDATE" } ]',
        pattern: '[ { chunk:"ABSOLUTEDATE" } ] [ { tag:"TO" } ] [ { chunk:"ABSOLUTEDATE" } ]',
        description: 'A range expressed by having a \'TO\' word between two dates.',
        result: 'DATERANGE'
      }
    ];
    var res = chunker.chunk(tags, rules);

    res.should.equal('(ABSOLUTEDATE (RELATIVEDATE (DAY 01/CD) (MONTH March/NNP)) (YEAR 2015/CD)) Chinese/JJ New/NNP Year/NN Dinner/NN');
  });

  it('should match a set of chunking rules', function(){

    /**
     * TODO: Work out what to do with tags and chunks. Probably need to
     * make requests to match on a 'tag', also look for chunks.
     */

    var tags = 'Mary/NN saw/VBD the/DT cat/NN sit/VB on/IN the/DT mat/NN';
    var rules = [
      {
        ruleType: 'tokens',
        pattern: '[ { tag:/DT|JJ|NN.*?/ } ]+',
        result: 'NP'
      },
      {
        ruleType: 'tokens',
        pattern: '[ { tag:"IN" } ] [ { chunk:"NP" } ]',
        result: 'PP'
      },
      {
        ruleType: 'tokens',
        pattern: '[ { tag:/VB.*?/ } ] [ { chunk:/NP|PP|CLAUSE/ } ]+$',
        result: 'VP'
      },
      {
        ruleType: 'tokens',
        pattern: '[ { chunk:"NP" } ] [ { chunk:"VP" } ]',
        result: 'CLAUSE'
      }
    ];
    var res = chunker.chunk(tags, rules);

    res.should.equal('(NP Mary/NN) saw/VBD (CLAUSE (NP the/DT cat/NN) (VP sit/VB (PP on/IN (NP the/DT mat/NN))))');
  });
});