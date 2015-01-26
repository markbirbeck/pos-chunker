var XRegExp = require('xregexp').XRegExp;
var str = '[(DATE 8/CD (MONTH January/NNP) 2014/CD)] TO/TO [(DATE 28/CD (MONTH March/NNP) 2014/CD)]';

console.log('*** start ***');
console.log(XRegExp.matchRecursive(str, '\\(', '\\)', 'g'));
console.log('*** serious one now ***');
console.log(XRegExp.matchRecursive(str, '\\((?<chunk>.*?)\\s', '\\)', 'g'));
console.log('*** end ***');