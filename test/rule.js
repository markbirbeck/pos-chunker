/**
 * Test that the rule library creates rules correctly.
 */

require('should');
var rule = require('../lib/rule');

describe('rule', function() {
  it('should create expression using tag', function() {
    rule('[ { tag:/VB/; } ]').should.equal('(((?:\\s|\\b)([^\\s/]*)/(VB)\\s*))');
  });

  it('should create expression using tag without final semicolon', function() {
    var r = 'tag:/VB/';

    rule('[ { ' + r + ' } ]').should.equal(rule('[ { ' + r + '; } ]'));
  });

  it('should create expression using tag with regular expression', function() {
    rule('[ { tag:/DT|NN.*/; } ]')
      .should.equal('(((?:\\s|\\b)([^\\s/]*)/(DT|NN.*)\\s*))');
  });

  it('should create expression using word', function() {
    rule('[ { word:/cat/; } ]').should.equal('(((?:\\s|\\b)(cat)/([A-Z]*)\\s*))');
  });

  it('should create expression using word with regular expression', function() {
    var res = rule('[ { word:/cat|dog/; } ]');

    res.should.equal('(((?:\\s|\\b)(cat|dog)/([A-Z]*)\\s*))');
  });

  it('should create expression using word and tag', function() {
    var res = rule('[ { word:/cat|dog/; tag:"NN" } ]');

    res.should.equal('(((?:\\s|\\b)(cat|dog)/(NN)\\s*))');
  });
});
