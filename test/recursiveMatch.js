var should = require('should');

/**
 * Add the recursiveMatch method to the string object:
 */

var rm = require('../lib/recursiveMatch');


describe('recurse', function(){
  describe('optional', function(){
    it('should match a symettrical pattern', function(){
      'aaazzz'.recursiveMatch('a(?R)?z')[0].should.equal('aaazzz');
    });

    it('should match a symettrical pattern at greater depth', function(){
      'aaaaaazzzzzz'.recursiveMatch('a(?R)?z')[0].should.equal('aaaaaazzzzzz');
    });
  });

  describe('alternative', function (){
    it('should match on alternative', function(){
      'q'.recursiveMatch('a(?R){3}z|q')[0].should.equal('q');
    });
  });

  describe('quantifier', function(){
    it('should not match since not enough q\'s', function(){
      'aqqz'.recursiveMatch('a(?R){3}z|q')[0].should.equal('q');
    });
    it('should match', function(){
      'aqqqz'.recursiveMatch('a(?R){3}z|q')[0].should.equal('aqqqz');
    });

    it('should not match since too many q\'s', function(){
      'aqqqqz'.recursiveMatch('a(?R){3}z|q')[0].should.equal('q');
    });

    it('should match nested quantifiers', function(){
      'aqaqqqzqz'.recursiveMatch('a(?R){3}z|q')[0].should.equal('aqaqqqzqz');
    });

    it('should match nested quantifiers (long)', function(){
      'aaaqqaqqqzzaqqqzqzqaqqaaqqqzqqzzz'.recursiveMatch('a(?R){3}z|q')[0].should.equal('aaaqqaqqqzzaqqqzqzqaqqaaqqqzqqzzz');
    });
  });

  describe('balanced constructs', function (){
    it('should match nested parenthesis', function(){
      '(a (b (c)))'.recursiveMatch('\\(([^()]*|(?R))*\\)')[0].should.equal('(a (b (c)))');
    });

    it('should match nested parenthesis when using named groups as part of atomic grouping', function(){
      '(a (b (c)))'.recursiveMatch('\\((?:(?=(?<' + rm.NAMED_GROUP_PLACEHOLDER + '>[^()]*))\\k<' + rm.NAMED_GROUP_PLACEHOLDER + '>|(?R))*\\)')[0].should.equal('(a (b (c)))');
    });

    it('should match multiple nested parenthesis', function(){
      '(a (b (c (d))) e f (g (h)) (i (j (k))))'
        .recursiveMatch('\\((?:[^()]*|(?R))*\\)')[0]
        .should.equal('(a (b (c (d))) e f (g (h)) (i (j (k))))');

      '(ABSOLUTEDATE (RELATIVEDATE (DAY 01/CD) (MONTH March/NNP)) (YEAR 2015/CD))'
        .recursiveMatch('\\(ABSOLUTEDATE (' + rm.expand('\\(([^()]*?|(?R))*?\\)') + '\\s?)*\\)')[0]
        .should.equal('(ABSOLUTEDATE (RELATIVEDATE (DAY 01/CD) (MONTH March/NNP)) (YEAR 2015/CD))');
    });


    it('should match nested div\'s', function(){
      '<body><div>a<div>b<div>c</div><div>d</div></div></div></body>'
        .recursiveMatch('<div>(?:[^<]*|(?R))*</div>')[0]
        .should.equal('<div>a<div>b<div>c</div><div>d</div></div></div>');
    });
  });
});
