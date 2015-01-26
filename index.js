var rule = require('./lib/rule');

exports.parse = parse;

function parse(tags, re){
  var regexp = new RegExp(rule(re), 'gm');

  return tags.replace(regexp, '[$1]');
}