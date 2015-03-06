/**
 * Adds a shim to provide support for recursive regular expressions.
 */

var XRegExp = require('xregexp').XRegExp;

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

function substPlaceholder(re, orig) {
  return re.replace(/\(\?R\)/g, function(/* match */) {
    return '(?:' + orig + ')';
  });
}

/**
 * Substitute any named groups:
 */

function substNamedGroups(re, name, counter) {
  return re.replace(new RegExp('<' + name + '>', 'g'), '<' + name + counter +
      '>');
}

function expand(pattern) {

  /**
   * Duplicate the recursion and named group placeholders as many times as
   * allowed by MAX_DEPTH:
   */

  var re = pattern;

  for (var i = 0; i < MAX_DEPTH; i++) {
    re = substPlaceholder(re, pattern);
    re = substNamedGroups(re, NAMED_GROUP_PLACEHOLDER, i);
  }

  /**
   * Remove the final placeholder and return:
   */

  return re
    .replace(/\(\?R\)/g, '')
    .replace(/\(\?<=/g, '(?<lookbehind>');
}

/**
 * Do match with recursion:
 */

function recursiveMatch(str, rregexp) {
  var regexp = new XRegExp(expand(rregexp), 'gm');

  return str.match(regexp);
}

/**
 * Do replace with recursion:
 */

function recursiveReplace(str, rregexp, newsubstr) {
  var regexp = new XRegExp(expand(rregexp), 'gm');
  return XRegExp.replace(str, regexp, function(match) {
    var subststr = newsubstr;

    /**
     * To emulate lookbehind a named group has been used. If it contains
     * a value then we need to juggle the results a little. For example,
     * if the parameters are:
     *
     *  replace('abc def', /(?<=abc )def/, '{$1}');
     *
     * then the callback will receive:
     *
     *  match = 'abc def'
     *  match.lookbehind = 'abc '
     *
     * We can then use these values to emulate lookbehind, by:
     *
     *  * modifying the substitution string, to include the value in
     *    @lookbehind;
     *  * modifying the returned value to *exclude* the value in
     *    @lookbehind;
     *  * using the new substitution string with the new returned
     *    value.
     *
     * So to continue the example, we begin with this:
     *
     *  match = 'abc def'
     *  match.lookbehind = 'abc '
     *  newsubstr = '{$1}'
     *
     * and after manipulation, have:
     *
     *  match = 'def'
     *  match.lookbehind = 'abc '
     *  newsubstr = 'abc {$1}'
     *
     * Once the strings have been modified then it's just a simple replacement.
     */

    if (match.lookbehind) {
      subststr = match.lookbehind + subststr;
      match = match.replace(match.lookbehind, '');
    }

    return subststr.replace('$1', match);
  });
}

exports.expand = expand;
exports.NAMED_GROUP_PLACEHOLDER = NAMED_GROUP_PLACEHOLDER;
exports.recursiveMatch = recursiveMatch;
exports.recursiveReplace = recursiveReplace;
