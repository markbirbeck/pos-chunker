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
      res.push('\\(' + ret.chunk + '.*?\\)');
    } else {

      /**
       * If there is no word then accept any word:
       */

      ret.word = ret.word || '[^\\s/]*';

      /**
       * If there is no tag then accept any POS code:
       */

      ret.tag = ret.tag || '[A-Z]*';

      /**
       * Create a regular expression string:
       */

      res.push('(\\b');
      res.push('(' + ret.word + ')');
      res.push('/');
      res.push('(' + ret.tag + ')');
      res.push('\\b)');
    }

    return res.join('');
  }) + ')';
}
