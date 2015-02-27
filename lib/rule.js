/**
 * Generate regular expressions from rules.
 */

var rm = require('./recursiveMatch');

module.exports = rule;

function rule(expression){
  return '(' + expression.replace(/\[\s*\{(.*?)\}\s*\]/g, function (match, p1){
    var ret = {};

    var attrs = p1.match(/.+?(;|$)/g);
    attrs.map(function (attr){
      attr = attr.replace(/;$/, '');

      var expr = attr.match(/(\w*):(.*)/);

      if (expr){
        ret[expr[1]] = expr[2].trim().replace(/(^")|("$)|(^\/)|(\/$)/g, '');
      }
    });

    var res = [];

    if (ret.chunk){
      res.push(
        '\\((' + ret.chunk + ') ' +
          '(' +
            '([^()]*)' +
            '|' +
            '(' +
              rm.expand(
                '\\(' +
                  '(?:' +
                    '(?=(?<' + rm.NAMED_GROUP_PLACEHOLDER + '>[^()]*))\\k<' + rm.NAMED_GROUP_PLACEHOLDER + '>|(?R)' +
                  ')*' +
                '\\)'
              ) +
            ')' +
          ')*' +
        '\\)');
    } else {

      /**
       * If there is no word then accept any word:
       *
       * TODO: Make sure this rule can cope with a '/' character as the word.
       */

      ret.word = ret.word || '[^\\s/]*';

      /**
       * If there is no tag then accept any POS code:
       *
       * TODO: Make sure this rule can cope with punctuation.
       */

      ret.tag = ret.tag || '[A-Z]*';

      /**
       * Create a regular expression string:
       */

      res.push('(' + ret.word + ')');
      res.push('/');
      res.push('(' + ret.tag + ')');
    }
    res.push('\\s*');

    return '(' + res.join('') + ')';
  }) + ')';
}
