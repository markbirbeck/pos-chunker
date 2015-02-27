var should = require('should');
var rule = require('../lib/rule');

describe('expressions', function(){
  it('should create expression using tag', function(){
    rule('[ { tag:/VB/; } ]').should.equal('(([^\\s/]*)/(VB))');
  });

  it('should create expression using tag without final semicolon', function(){
    var r = 'tag:/VB/';

    rule('[ { ' + r + ' } ]').should.equal(rule('[ { ' + r + '; } ]'));
  });

  it('should create expression using tag with regular expression', function(){
    rule('[ { tag:/DT|NN.*/; } ]').should.equal('(([^\\s/]*)/(DT|NN.*))');
  });

  it('should create expression using word', function(){
    rule('[ { word:/cat/; } ]').should.equal('((cat)/([A-Z]*))');
  });

  it('should create expression using word with regular expression', function(){
    var res = rule('[ { word:/cat|dog/; } ]');

    res.should.equal('((cat|dog)/([A-Z]*))');
  });

  it('should create expression using word and tag', function(){
    var res = rule('[ { word:/cat|dog/; tag:"NN" } ]');

    res.should.equal('((cat|dog)/(NN))');
  });
});
