# POS Chunker

A parts-of-speech (POS) chunker. The purpose of this is to take output from a POS tagger -- which adds a part-of-speech tag such as 'noun' or 'verb' to each word in a string -- and group words together to form phrases.

The module aims to provide the kind of functionality found in [NLTK's `chunk()`](http://www.nltk.org/_modules/nltk/chunk.html) or [Stanford's `TokensRegex()`](http://nlp.stanford.edu/nlp/javadoc/javanlp/edu/stanford/nlp/ling/tokensregex/SequenceMatchRules.html) methods. Since the NLTK syntax is less powerful (it only supports matching tags, not matching words or chunks), we've opted to try to emulate the Stanford approach.

## Illustration

To illustrate the purpose of a chunker, imagine we want to find dates within a sentence like the following:

```
Shall we have dinner on April 1st?
```

We could just write regular expressions to find sequences such as `April, 1st`, but they will quickly become unwieldy as we look for more and more parts of a date (days of the week, years, seasons, phrases such as 'next Friday', and so on).

However, if instead of processing the string we process the output of a POS tagger then we can write simpler rules yet deal with greater complexity. By creating simpler rules we'll have a much better chance of understanding and maintaining them.

To continue the illustration, a POS tagger might produce the following output after processing the example:

```
Shall/MD we/PRP have/VBP dinner/NN on/IN April/NNP 1/CD st/NN ?/.
```

In order to process this string we could write a rule that adds an annotation whenever a month is found:

```
[ { word:/January|February|March|April|May.../ } ] => MONTH
```

We could then write another rule that says if we find a month that is followed by a number, add another annotation to indicate we have a date:

```
[ { chunk:MONTH } ] [ { tag:CD } ] => DATE
```

The output after the first rule would be:

```
Shall/MD we/PRP have/VBP dinner/NN on/IN (MONTH April/NNP) 1/CD st/NN ?/.
```

and after the second:

```
Shall/MD we/PRP have/VBP dinner/NN on/IN (DATE (MONTH April/NNP) 1/CD) st/NN ?/.
```

## API

All examples assume:

```
var chunker = require('pos-chunker');
```

Also note that `POS Chunker` assumes that its input has already been chunked as part of some processing pipeline, using something like [pos](https://www.npmjs.com/package/pos). 

### chunk.convert(tags, re, token)

Converts a string containing POS tags into a combination of POS tags and phrase chunks.

For example:

```
var tags = '01/CD March/NNP 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN';
var chunks = chunker.convert(
  tags,
  '[ { word:/January|February|March|April|May|June|July|August|September|October|November|December/ } ]',
  'MONTH'
);

chunks.should.equal('01/CD (MONTH March/NNP) 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN');
```

### chunk.parse(tags, re)

Places square brackets around occurrences of a sequence.

Using the output we obtained in the previous example, let's locate any occurrence of a month followed by a year:

```
var chunks = '01/CD (MONTH March/NNP) 2015/CD Chinese/JJ New/NNP Year/NN Dinner/NN';

chunks = chunker.parse(chunks, '[ { chunk:"MONTH" } ] [ { word:"\\d{4}" } ]');
chunks.should.equal('01/CD [(MONTH March/NNP) 2015/CD] Chinese/JJ New/NNP Year/NN Dinner/NN');
```

### chunker.chunk(tags, ruleList)

Same as `convert`, but uses a list of rules rather than a single expression.

For example, let's define a sequence of rules that say:

* a clause is indicated when a noun phrase is followed by a verb phrase;
* a noun phrase is one or more sequences of determiners (*the*, *some*, etc.), adjectives and nouns;
* a verb phrase is a verb followed by either a noun phrase or a prepositional phrase;
* and a prepositional phrase is a noun preceded by a preposition, such as *of*, *in* or *by*.

The definition of a noun phrase is:

```
var NP = {
  ruleType: 'tokens',
  pattern: '[ { tag:/DT|JJ|NN.*?/ } ]+',
  result: 'NP'
};
```

This will match *the mat*, as well as *the large black cat*.

We said a prepositional phrase is a noun phrase preceded by a preposition, which can be represented like this:

```
var PP = {
  ruleType: 'tokens',
  pattern: '[ { tag:IN } ] [ { chunk:NP } ]',
  result: 'PP'
};
```

This will match phrases such as *in the house* and *by the cold pool*.

Now we can define a pattern for verb phrases which we said was a verb followed by one or more noun or prepositional phrases:

```
var VP = {
  ruleType: 'tokens',
  pattern: '[ { tag:/VB.*?/ } ] [ { chunk:/NP|PP/ } ]+',
  result: 'VP'
};
```

This will match phrases like `washed the dog in the bath`.

Now finally we can declare a pattern for a clause, which we said at the top is a noun phrase followed by a verb phrase:

```
var CLAUSE = {
  ruleType: 'tokens',
  pattern: '[ { tag:NP } ] [ { tag:VP } ]',
  result: 'CLAUSE'
};
```

This pattern now means we can match phrases such as *The doctor saw the patient at the surgery*

Here are a few examples using these rules:

```
var rules = [NP, PP, VP, CLAUSE];

chunker.chunk(
  'The/DT doctor/NN saw/VBD the/DT patient/NN at/IN the/DT surgery/NN ./.', rules
).should.equal(
  '(CLAUSE (NP The/DT doctor/NN) (VP saw/VBD (NP the/DT patient/NN) (PP at/IN (NP the/DT surgery/NN)))) ./.'
);

chunker.chunk(
  'Mary/NN saw/VBD the/DT cat/NN sit/VB on/IN the/DT mat/NN ./.', rules
).should.equal(
  '(CLAUSE (NP Mary/NN) (VP saw/VBD (NP the/DT cat/NN))) (VP sit/VB (PP on/IN (NP the/DT mat/NN))) ./.'
);
```

