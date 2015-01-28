var should = require('should');

/**
 * Add the recursiveMatch method to the string object:
 */

require('../lib/recursiveMatch');


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

    it('should match nested div\'s', function(){
      '<body><div>a<div>b<div>c</div><div>d</div></div></div></body>'
        .recursiveMatch('<div>(?:[^<]*|(?R))*</div>')[0]
        .should.equal('<div>a<div>b<div>c</div><div>d</div></div></div>');
    });
  });
});
