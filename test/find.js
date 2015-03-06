// jscs:disable maximumLineLength

/**
 * Check that each type of token rule works correctly:
 *
 * * 'tag' should match existing parts-of-speech tags;
 * * 'word' should match a word, regardless of it's POS tag;
 * * 'chunk' should match a chunk that was previously created
 *   by this module.
 */

require('should');
var chunker = require('..');

describe('find tags, words and chunks', function() {
  describe('tag', function() {
    it('should match tokens with a single tag', function() {
      var tags = 'They/PRP refuse/VB to/TO permit/VB us/PRP to/TO obtain/VB the/DT refuse/NN permit/NN';
      var res = chunker.chunk(tags, '[ { tag:/VB/ } ]');

      res.should.equal('They/PRP {refuse/VB} to/TO {permit/VB} us/PRP to/TO {obtain/VB} the/DT refuse/NN permit/NN');
    });

    it('should match tokens with a single tag with punctuation', function() {
      var tags = 'They/PRP refuse/VB (/( to/TO permit/VB us/PRP to/TO obtain/VB the/DT refuse/NN permit/NN )/)';
      var res = chunker.chunk(tags, '[ { tag:/\\(/ } ][ { word:.*? } ]+[ { tag:/\\)/ } ]');

      res.should.equal('They/PRP refuse/VB {(/( to/TO permit/VB us/PRP to/TO obtain/VB the/DT refuse/NN permit/NN )/)}');
    });

    it('should match tokens with a single tag but with a regular expression', function() {
      var tags = 'This/DT is/VBZ some/DT sample/NN text/NN ./. This/DT text/NN can/MD contain/VB multiple/JJ sentences/NNS ./.';
      var res = chunker.chunk(tags, '[ { tag:/DT|NNS?/; } ]+');

      res.should.equal('{This/DT} is/VBZ {some/DT sample/NN text/NN} ./. {This/DT text/NN} can/MD contain/VB multiple/JJ {sentences/NNS} ./.');
    });

    it('should match two consecutive tokens with a single tag', function() {
      var tags = 'dog/NN cat/NN mouse/NN';
      var res = chunker.chunk(tags, '[ { tag:/NN/ } ] [ { tag:/NN/ } ]');

      res.should.equal('{dog/NN cat/NN} mouse/NN');
    });

    it('should match three consecutive tokens with a single tag', function() {
      var tags = 'the/DT little/JJ cat/NN sat/VBD on/IN the/DT mat/NN';
      var res = chunker.chunk(tags, '[ { tag:/DT/ } ] [ { tag:/JJ/ } ] [ { tag:/NN/ } ]');

      res.should.equal('{the/DT little/JJ cat/NN} sat/VBD on/IN the/DT mat/NN');

      tags = '01/CD March/NNP 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN';
      res = chunker.chunk(tags, '[ { tag:/CD/ } ] [ { tag:/NNP/ } ] [ { tag:/CD/ } ]');

      res.should.equal('{01/CD March/NNP 2015/CD} Chinese/JJ New/NNP Year/NN Dinner/NN');
    });
  });

  describe('word', function() {
    it('should match tokens with a single word', function() {
      var tags = 'Half/NN Term/NN :/: Monday/NNP -/: Friday/NNP 17/CD to/TO 21/CD February/NNP 2014/CD (incl/NN ./. )/)';
      var res = chunker.chunk(tags, '[ { word:/February/ } ]');

      res.should.equal('Half/NN Term/NN :/: Monday/NNP -/: Friday/NNP 17/CD to/TO 21/CD {February/NNP} 2014/CD (incl/NN ./. )/)');
    });

    it('should match tokens with punctuation', function() {
      var tags = '17/CD -/: 21/CD February/NNP 2014/CD (/( incl/NN ./. )/)';
      var res = chunker.chunk(tags, '[ { word:[.()-] } ]');

      res.should.equal('17/CD {-/:} 21/CD February/NNP 2014/CD {(/(} incl/NN {./.} {)/)}');
    });
  });

  describe('chunk', function() {
    it('should match a chunk', function() {
      var tags = '01/CD March/NNP 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN';
      var chunks = chunker.chunk(tags, '[ { word:/January|February|March|April|May|June|July|August|September|October|November|December/ } ]', 'MONTH');

      chunks.should.equal('01/CD [MONTH March/NNP] 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN');

      var res = chunker.chunk(chunks, '[ { chunk:"MONTH" } ] [ { word:"\\d{4}" } ]');
      res.should.equal('01/CD {[MONTH March/NNP] 2015/CD} Chinese/JJ New/NNP Year/NN Dinner/NN');
    });

    it('should match a chunk with lookahead', function() {
      var tags = '01/CD March/NNP 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN';
      var res = chunker.chunk(tags, '[ { word:\\d{1,2} } ](?=\\s[ { word:/January|February|March|April|May|June|July|August|September|October|November|December/ } ])', 'DAY');

      res.should.equal('[DAY 01/CD] March/NNP 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN');
    });

    it('should not get confused by multiple chunks', function() {
      var tags = '8/CD January/NNP 2014/CD TO/TO 28/CD March/NNP 2014/CD';
      var chunks = chunker.chunk(tags, '[ { word:/January|February|March|April|May|June|July|August|September|October|November|December/ } ]', 'MONTH');

      chunks.should.equal('8/CD [MONTH January/NNP] 2014/CD TO/TO 28/CD [MONTH March/NNP] 2014/CD');

      var res = chunker.chunk(chunks, '[ { chunk:"MONTH" } ] [ { word:"\\d{4}" } ]');
      res.should.equal('8/CD {[MONTH January/NNP] 2014/CD} TO/TO 28/CD {[MONTH March/NNP] 2014/CD}');
    });

    it('should cope with multiple layers of chunking', function() {
      var tags = '8/CD January/NNP 2014/CD TO/TO 28/CD March/NNP 2014/CD';
      var months = chunker.chunk(tags, '[ { word:/January|February|March|April|May|June|July|August|September|October|November|December/ } ]', 'MONTH');

      months.should.equal('8/CD [MONTH January/NNP] 2014/CD TO/TO 28/CD [MONTH March/NNP] 2014/CD');

      var dates = chunker.chunk(months, '[ { word:"\\d{1,2}" } ] [ { chunk:"MONTH" } ] [ { word:"\\d{4}" } ]', 'DATE');
      dates.should.equal('[DATE 8/CD [MONTH January/NNP] 2014/CD] TO/TO [DATE 28/CD [MONTH March/NNP] 2014/CD]');

      var res = chunker.chunk(dates, '[ { chunk:"DATE" } ]');
      res.should.equal('{[DATE 8/CD [MONTH January/NNP] 2014/CD]} TO/TO {[DATE 28/CD [MONTH March/NNP] 2014/CD]}');
    });

    it('should not look ahead too far', function() {
      var tags = '8/CD January/NNP TO/TO 28/CD March/NNP 2014/CD';
      var months = chunker.chunk(tags, '[ { word:/January|February|March|April|May|June|July|August|September|October|November|December/ } ]', 'MONTH');

      months.should.equal('8/CD [MONTH January/NNP] TO/TO 28/CD [MONTH March/NNP] 2014/CD');

      var dates = chunker.chunk(months, '[ { word:"\\d{1,2}" } ] [ { chunk:"MONTH" } ] [ { word:"\\d{4}" } ]', 'DATE');
      dates.should.equal('8/CD [MONTH January/NNP] TO/TO [DATE 28/CD [MONTH March/NNP] 2014/CD]');

      var res = chunker.chunk(dates, '[ { chunk:"DATE" } ]');
      res.should.equal('8/CD [MONTH January/NNP] TO/TO {[DATE 28/CD [MONTH March/NNP] 2014/CD]}');
    });
  });
});
