const text = await Deno.readTextFile("src/day3Data.txt");
const rawData = text.split('\n');

let totalScore = 0;

const scores: number[] = [];

// const rawData = [
//     'vJrwpWtwJgWrhcsFMMfFFhFp',
//     'jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL',
//     'PmmdzqPrVvPwwTWBwg',
//     'wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn',
//     'ttgJtRGJQctTZtZT',
//     'CrZsJsPPZsGzwwsLwLmpwMDw',
// ]

for (let outerIndex = 0; outerIndex < rawData.length; outerIndex = outerIndex + 3) {
  const firstElf = rawData[outerIndex];
  const secondElf = rawData[outerIndex + 1];
  const thirdElf = rawData[outerIndex + 2];

  const firstElfLetters = new Set(firstElf.split(''));
  const secondElfLetters = new Set(secondElf.split(''));
  const thirdElfLetters = [...new Set(thirdElf.split(''))];

  const firstMatches = new Set();
  [...firstElfLetters].forEach((letter) => {
    if (secondElfLetters.has(letter)) {
      firstMatches.add(letter);
    }
  });

  let foundAMatch = false;
  let innerIndex = 0;
  while (foundAMatch === false) {
    const letter = thirdElfLetters[innerIndex];
    if (firstMatches.has(letter)) {
      foundAMatch = true;
      if (letter === letter.toUpperCase()) {
        const letterScore = letter.charCodeAt(0) - 65 + 1 + 26;
        scores.push(letterScore);
        totalScore += letterScore;
      } else {
        const letterScore = letter.charCodeAt(0) - 97 + 1;
        scores.push(letterScore);
        totalScore += letterScore;
      }
    }
    innerIndex++;
  }
}

console.log(totalScore);
