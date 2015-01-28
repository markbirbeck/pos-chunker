var rule = require('./lib/rule');

exports.parse = parse;
exports.convert = convert;
exports.chunk = chunk;

function parse(tags, re){
  var regexp = new RegExp(rule(re), 'gm');

  return tags.replace(regexp, '[$1]');
}

function convert(tags, re, token){
  var mapped = parse(tags, re);

  return mapped.replace(/\[(.*?)]/g, '(' + token + ' $1)');
}

function chunk(tags, ruleList){
  var ret = tags;

  ruleList.map(function (rule){
    if (rule && !('active' in rule && !rule.active) && rule.ruleType === 'tokens'){
      ret = convert(ret, rule.pattern, rule.result);
    }
  });
  return ret;
}