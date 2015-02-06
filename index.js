var rule = require('./lib/rule');

require('./lib/recursiveMatch');

exports.parse = parse;
exports.convert = convert;
exports.chunk = chunk;

function parse(tags, re){
  return tags.recursiveReplace(rule(re), '[$1]');
}

function convert(tags, re, token){
  var mapped = parse(tags, re);

  return mapped.replace(/\[(.*?)]/g, '(' + token + ' $1)');
}

function chunk(tags, ruleList){
  var ret = tags;

  ruleList.map(function (rule){
    // console.log('chunking:', rule.description, ':', ret);
    if (rule && !('active' in rule && !rule.active)){
      switch (rule.ruleType){
        case 'tokens':
          ret = convert(ret, rule.pattern, rule.result);
          break;

        default:
          break;
      }
    }
  });
  return ret;
}