var rule = require('./lib/rule');

var rm = require('./lib/recursiveMatch');

exports.chunk = chunk;

function _match(tags, re){
  return rm.recursiveMatch(tags, rule(re));
}

function _replace(tags, re, newSubstr){
  return rm
    .recursiveReplace(tags, rule(re), newSubstr)

    /**
     * This is a tiny hack, since I haven't found a way to deal with the fact
     * that any regex we do that takes into account that tokens are
     * space-separated ends up including the final space:
     */

    .replace(/ \]/g, '] ');
}

function _parse(tags, re){
  return _replace(tags, rule(re), '[$1]');
}

function _convert(tags, re, token){
  var mapped = _parse(tags, re);

  return mapped.replace(/\[(.*?)]/g, '(' + token + ' $1)');
}

function chunk(tags, re, token){
  var ret = tags;
  var ruleList;

  /**
   * If re is a string then we have either a single mapping rule, or we
   * just want to demarcate a chunk:
   */

  if (typeof re === 'string'){
    if (!token){
      return _parse(tags, re);
    } else {
      ruleList = [{
        ruleType: 'tokens',
        pattern: re,
        result: token
      }];
    }
  }

  /**
   * Otherwise, we have a collection of mapping rules:
   */

  else {
    ruleList = re;
  }

  ruleList.map(function (rule){
    // console.log('chunking:', rule.description, ':', ret);
    if (rule && !('active' in rule && !rule.active)){
      switch (rule.ruleType){
        case 'tokens':
          ret = _convert(ret, rule.pattern, rule.result);
          break;

        default:
          break;
      }
    }
  });
  return ret;
}