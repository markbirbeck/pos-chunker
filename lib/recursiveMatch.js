var _ = require('lodash');

/**
 * Make our method available on all string objects:
 */

String.prototype.recursiveMatch = recursiveMatch;
String.prototype.recursiveReplace = recursiveReplace;

exports.expand = expand;

/**
 * Configurable options:
 */

/**
 * This is the maximum number of checks we'll make:
 */

var MAX_DEPTH = 10;


/**
 * Substitute the recursion placeholder:
 */

function substPlaceholder(re, orig){
  return re.replace(/\(\?R\)/g, function (match){
    return '(?:' + orig + ')';
  });
}

function expand(pattern){

  /**
   * Duplicate the recursion placeholder as many times as allowed by
   * MAX_DEPTH:
   */

  var re = pattern;

  for (var i = 0; i < MAX_DEPTH; i++){
    re = substPlaceholder(re, pattern);
  }

  /**
   * Remove the final placeholder and return:
   */

  return re.replace(/\(\?R\)/g, '');
}


/**
 * Do match with recursion:
 */

function recursiveMatch(rregexp){
  var regexp = new RegExp(expand(rregexp), 'gm');

  return this.match(regexp);
}


/**
 * Do replace with recursion:
 */

function recursiveReplace(rregexp, newsubstr){
  var regexp = new RegExp(expand(rregexp), 'gm');

  return this.replace(regexp, newsubstr);
}