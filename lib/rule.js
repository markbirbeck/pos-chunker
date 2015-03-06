/**
 * Generate regular expressions from rules.
 */

var rm = require('./recursiveMatch');
var config = require('../config/config');
var parens = config.parens;

function rule(expression) {

  /**
   * Remove all spaces since we'll control boundaries later:
   */

  expression = expression.replace(/\s+/g, '');

  return '(' + expression.replace(/\[\s*\{(.*?)\}\s*\]/g, function(match, p1) {
    var ret = {};

    var attrs = p1.match(/.+?(;|$)/g);
    attrs.map(function(attr) {
      attr = attr.replace(/;$/, '');

      var expr = attr.match(/(\w*):(.*)/);

      if (expr) {
        ret[expr[1]] = expr[2].trim().replace(/(^")|("$)|(^\/)|(\/$)/g, '');
      }
    });

    var res = [];

    res.push('(?:^|\\s|\\b)');
    if (ret.chunk) {
      res.push(
        '\\' + parens.left + '(' + ret.chunk + '\\s)' +
          '(' +
            '([^' +
              '\\' + parens.left + '\\' + parens.right +
            ']*)' +
            '|' +
            '(' +
              rm.expand(
                '\\' + parens.left +
                  '(?:' +
                    '(?=(' +
                      '?<' + rm.NAMED_GROUP_PLACEHOLDER + '>' +
                        '[^' +
                          '\\' + parens.left + '\\' + parens.right +
                        ']*' +
                    '))' +
                    '\\k<' + rm.NAMED_GROUP_PLACEHOLDER + '>|(?R)' +
                  ')*' +
                '\\' + parens.right
              ) +
            ')' +
          ')*' +
        '\\' + parens.right);
    } else {

      /**
       * If there is no word then accept any word:
       *
       * TODO: Make sure this rule can cope with a '/' character as the word.
       */

      ret.word = ret.word || '[^\\s/]+';

      /**
       * If there is no tag then accept any POS code:
       */

      ret.tag = ret.tag || '[,.:$#"()]|[A-Z]+';

      /**
       * Create a regular expression string:
       */

      res.push('(' + ret.word + ')');
      res.push('/');
      res.push('(' + ret.tag + ')');
    }

    return '(' + res.join('') + ')';
  }) + ')';
}

module.exports = rule;
