var should = require('should');

var rm = require('../lib/recursiveMatch');


describe('recurse', function(){
  describe('optional', function(){
    it('should match a symettrical pattern', function(){
      rm.recursiveMatch('aaazzz', 'a(?R)?z')[0].should.equal('aaazzz');
    });

    it('should match a symettrical pattern at greater depth', function(){
      rm.recursiveMatch('aaaaaazzzzzz', 'a(?R)?z')[0].should.equal('aaaaaazzzzzz');
    });
  });

  describe('alternative', function (){
    it('should match on alternative', function(){
      rm.recursiveMatch('q', 'a(?R){3}z|q')[0].should.equal('q');
    });
  });

  describe('quantifier', function(){
    it('should not match since not enough q\'s', function(){
      rm.recursiveMatch('aqqz', 'a(?R){3}z|q')[0].should.equal('q');
    });
    it('should match', function(){
      rm.recursiveMatch('aqqqz', 'a(?R){3}z|q')[0].should.equal('aqqqz');
    });

    it('should not match since too many q\'s', function(){
      rm.recursiveMatch('aqqqqz', 'a(?R){3}z|q')[0].should.equal('q');
    });

    it('should match nested quantifiers', function(){
      rm.recursiveMatch('aqaqqqzqz', 'a(?R){3}z|q')[0].should.equal('aqaqqqzqz');
    });

    it('should match nested quantifiers (long)', function(){
      rm.recursiveMatch('aaaqqaqqqzzaqqqzqzqaqqaaqqqzqqzzz', 'a(?R){3}z|q')[0].should.equal('aaaqqaqqqzzaqqqzqzqaqqaaqqqzqqzzz');
    });
  });

  describe('balanced constructs', function (){
    it('should match nested parenthesis', function(){
      rm.recursiveMatch('(a (b (c)))', '\\(([^()]*|(?R))*\\)')[0].should.equal('(a (b (c)))');
    });

    it('should match nested parenthesis when using named groups as part of atomic grouping', function(){
      rm.recursiveMatch('(a (b (c)))', '\\((?:(?=(?<' + rm.NAMED_GROUP_PLACEHOLDER + '>[^()]*))\\k<' + rm.NAMED_GROUP_PLACEHOLDER + '>|(?R))*\\)')[0].should.equal('(a (b (c)))');
    });

    it('should match multiple nested parenthesis', function(){
      rm.recursiveMatch('(a (b (c (d))) e f (g (h)) (i (j (k))))', '\\((?:[^()]*|(?R))*\\)')[0]
        .should.equal('(a (b (c (d))) e f (g (h)) (i (j (k))))');

      rm.recursiveMatch('(ABSOLUTEDATE (RELATIVEDATE (DAY 01/CD) (MONTH March/NNP)) (YEAR 2015/CD))',
          '\\(ABSOLUTEDATE (' + rm.expand('\\(([^()]*?|(?R))*?\\)') + '\\s?)*\\)')[0]
        .should.equal('(ABSOLUTEDATE (RELATIVEDATE (DAY 01/CD) (MONTH March/NNP)) (YEAR 2015/CD))');
    });


    it('should match nested div\'s', function(){
      rm.recursiveMatch('<body><div>a<div>b<div>c</div><div>d</div></div></div></body>', '<div>(?:[^<]*|(?R))*</div>')[0]
        .should.equal('<div>a<div>b<div>c</div><div>d</div></div></div>');
    });
  });
});
