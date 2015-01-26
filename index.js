var rule = require('./lib/rule');

exports.parse = parse;
exports.convert = convert;

function parse(tags, re){
  var regexp = new RegExp(rule(re), 'gm');

  return tags.replace(regexp, '[$1]');
}

function convert(tags, re, token){
  var mapped = parse(tags, re);

  return mapped.replace(/\[(.*?)]/g, '(' + token + ' $1)');
}