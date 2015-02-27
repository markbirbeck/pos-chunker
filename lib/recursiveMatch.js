/**
 * Adds a shim to provide support for recursive regular expressions.
 */

var XRegExp = require('xregexp').XRegExp;

exports.expand = expand;
exports.NAMED_GROUP_PLACEHOLDER = NAMED_GROUP_PLACEHOLDER;
exports.recursiveMatch = recursiveMatch;
exports.recursiveReplace = recursiveReplace;

/**
 * Configurable options:
 */

/**
 * This is the maximum number of checks we'll make:
 */

var MAX_DEPTH = 10;

/**
 * The token used as a placeholder for named groups:
 */

var NAMED_GROUP_PLACEHOLDER = '_____ngp';


/**
 * Substitute the recursion placeholder:
 */

function substPlaceholder(re, orig){
  return re.replace(/\(\?R\)/g, function (match){
    return '(?:' + orig + ')';
  });
}

/**
 * Substitute any named groups:
 */

function substNamedGroups(re, name, counter){
  return re.replace(new RegExp('<' + name + '>', 'g'), '<' + name + counter + '>');
}

function expand(pattern){

  /**
   * Duplicate the recursion and named group placeholders as many times as
   * allowed by MAX_DEPTH:
   */

  var re = pattern;

  for (var i = 0; i < MAX_DEPTH; i++){
    re = substPlaceholder(re, pattern);
    re = substNamedGroups(re, NAMED_GROUP_PLACEHOLDER, i);
  }

  /**
   * Remove the final placeholder and return:
   */

  return re.replace(/\(\?R\)/g, '');
}


/**
 * Do match with recursion:
 */

function recursiveMatch(str, rregexp){
  var regexp = new XRegExp(expand(rregexp), 'gm');

  return str.match(regexp);
}


/**
 * Do replace with recursion:
 */

function recursiveReplace(str, rregexp, newsubstr){
  var regexp = new XRegExp(expand(rregexp), 'gm');

  return str.replace(regexp, newsubstr);
}