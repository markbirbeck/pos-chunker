/**
 * Test that the rule library creates rules correctly.
 */

require('should');
var rule = require('../lib/rule');

describe('tidy expression', function() {
  describe('spaces', function() {
    it('should ignore spaces within expression', function() {
      rule('[ { tag:/VB/ } ]').should.equal(rule('[{ tag:/VB/ }]'));
      rule('[    { tag:/VB/ }    ]').should.equal(rule('[{ tag:/VB/ }]'));
      rule('[    { tag:/VB/ }]').should.equal(rule('[{ tag:/VB/ }]'));
    });

    it('should reduce spaces between expressions', function() {
      rule('[ { tag:/NN/ } ] [ { tag:/VB/ } ]')
        .should.equal(rule('[ { tag:/NN/ } ] [ { tag:/VB/ } ]'));
      rule('[ { tag:/NN/ } ] [ { tag:/VB/ } ]')
        .should.equal(rule('[ { tag:/NN/ } ]     [ { tag:/VB/ } ]'));
      rule('[ { tag:/NN/ } ][ { tag:/VB/ } ]')
        .should.equal(rule('[ { tag:/NN/ } ]     [ { tag:/VB/ } ]'));
      rule('([ { tag:/NN/ } ])? [ { tag:/VB/ } ]')
        .should.equal(rule('([ { tag:/NN/ } ])?     [ { tag:/VB/ } ]'));
    });
  });

  describe('semicolons between attributes', function() {
    it('should not matter if there is a final semicolon', function() {
      rule('[ { tag:/VB/ } ]').should.equal(rule('[ { tag:/VB/; } ]'));
    });
  });

  describe('quotes', function() {
    it('should not matter if there are quotes around expression', function() {
      rule('[ { tag:"VB" } ]').should.equal(rule('[ { tag:VB } ]'));
      rule('[ { word:"running" } ]').should.equal(rule('[ { word:running } ]'));
      rule('[ { word:"running"; tag:VB } ]')
        .should.equal(rule('[ { word:running; tag:"VB" } ]'));
    });
  });

  describe('regex', function() {
    it('should not matter if there are slashes around expression', function() {
      rule('[ { tag:/VB.*?/ } ]').should.equal(rule('[ { tag:VB.*? } ]'));
      rule('[ { word:/run(ning)?/ } ]')
        .should.equal(rule('[ { word:run(ning)? } ]'));
      rule('[ { word:/run(ning)?/; tag:/VB.*?/ } ]')
        .should.equal(rule('[ { word:run(ning)?; tag:VB.*? } ]'));
    });
  });
});
