// jscs:disable maximumLineLength

/**
 * Test the recursiveMatch module.
 */

require('should');
var rm = require('../lib/recursiveMatch');

describe('lookbehind', function() {
  it('should capture what comes after lookbehind', function() {
    rm
      .recursiveMatch(
        'We have a green towel and a red car, plus a green door and a red trumpet.',
        '(?<=green )(\\w+)'
      )
      .should.eql(['towel', 'door']);
  });

  it('should capture everything if lookbehind is a trigger', function() {
    rm
      .recursiveMatch(
        'We have a green towel and a red car, plus a green door and a red trumpet.',
        'a (?<=red )\\w+'
      )
      .should.eql(['a red car', 'a red trumpet']);
  });
});
