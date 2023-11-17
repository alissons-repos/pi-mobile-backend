const natural = require('natural');

const foundString = 'celular';
const lostString = 'celur';

const foundStem = natural.PorterStemmerPt.tokenizeAndStem(foundString);
const lostStem = natural.PorterStemmerPt.tokenizeAndStem(lostString);

console.log('foundStem', foundStem);
console.log('lostStem', lostStem);

const foundStemString = foundStem.join(' ');
const lostStemString = lostStem.join(' ');

console.log('foundStemString:', foundStemString);
console.log('lostStemString:', lostStemString);

const diceStem = natural.DiceCoefficient(foundStemString, lostStemString);

console.log('diceStem', diceStem);

function intersect(set1, set2) {
  const intersection = new Set();
  set1.forEach((value) => {
    if (set2.has(value)) {
      intersection.add(value);
    }
  });
  // set2.forEach((value) => {
  //   if (set1.has(value)) {
  //     intersection.add(value);
  //   }
  // });
  return intersection;
}

function calculateDice(arrStr1, arrStr2) {
  const set1 = new Set(arrStr1);
  const set2 = new Set(arrStr2);

  const diceNum = (2 * intersect(set1, set2).size) / (set1.size + set2.size);
  console.log('Aqui', diceNum);
}

calculateDice(foundStem, lostStem);
