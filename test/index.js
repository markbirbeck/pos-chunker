var should = require('should');
var chunker = require('..');

describe('index', function(){
  describe('tag', function(){
    it('should match tokens with a single tag', function(){
      var tags = 'They/PRP refuse/VB to/TO permit/VB us/PRP to/TO obtain/VB the/DT refuse/NN permit/NN';
      var res = chunker.chunk(tags, '[ { tag:/VB/ } ]');

      res.should.equal('They/PRP [refuse/VB] to/TO [permit/VB] us/PRP to/TO [obtain/VB] the/DT refuse/NN permit/NN');
    });

    /**
     * TODO: Repeating patterns need to take into account that the tokens are space-separated.
     */

    it('should match tokens with a single tag but with a regular expression', function(){
      var tags = 'This/DT is/VBZ some/DT sample/NN text/NN ./. This/DT text/NN can/MD contain/VB multiple/JJ sentences/NNS ./.';
      var res = chunker.chunk(tags, '[ { tag:/DT|NNS?/; } ]+');

      res.should.equal('[This/DT] is/VBZ [some/DT sample/NN text/NN] ./. [This/DT text/NN] can/MD contain/VB multiple/JJ [sentences/NNS] ./.');
    });

    it('should match two consecutive tokens with a single tag', function(){
      var tags = 'dog/NN cat/NN mouse/NN';
      var res = chunker.chunk(tags, '[ { tag:/NN/ } ] [ { tag:/NN/ } ]');

      res.should.equal('[dog/NN cat/NN] mouse/NN');
    });

    it('should match three consecutive tokens with a single tag', function(){
      var tags = 'the/DT little/JJ cat/NN sat/VBD on/IN the/DT mat/NN';
      var res = chunker.chunk(tags, '[ { tag:/DT/ } ] [ { tag:/JJ/ } ] [ { tag:/NN/ } ]');

      res.should.equal('[the/DT little/JJ cat/NN] sat/VBD on/IN the/DT mat/NN');

      tags = '01/CD March/NNP 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN';
      res = chunker.chunk(tags, '[ { tag:/CD/ } ] [ { tag:/NNP/ } ] [ { tag:/CD/ } ]');

      res.should.equal('[01/CD March/NNP 2015/CD] Chinese/JJ New/NNP Year/NN Dinner/NN');
    });
  });

  describe('word', function(){
    it('should match tokens with a single word', function(){
      var tags = 'Half/NN Term/NN :/: Monday/NNP -/: Friday/NNP 17/CD to/TO 21/CD February/NNP 2014/CD (incl/NN ./. )/)';
      var res = chunker.chunk(tags, '[ { word:/February/ } ]');

      res.should.equal('Half/NN Term/NN :/: Monday/NNP -/: Friday/NNP 17/CD to/TO 21/CD [February/NNP] 2014/CD (incl/NN ./. )/)');
    });
  });
});
