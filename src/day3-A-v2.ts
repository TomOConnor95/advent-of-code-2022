const text = await Deno.readTextFile("src/day3Data.txt");
const rawData = text.split('\n');

let totalScore = 0;

const scores = [];

// const rawData = [
//     'vJrwpWtwJgWrhcsFMMfFFhFp',
//     'jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL',
//     'PmmdzqPrVvPwwTWBwg',
//     'wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn',
//     'ttgJtRGJQctTZtZT',
//     'CrZsJsPPZsGzwwsLwLmpwMDw',
// ]

const getScoreForLetter = (letter: string) => {
  const lowerCaseLetter = letter.toLowerCase();
  const capitalScore = letter === lowerCaseLetter ? 0 : 26;
  return capitalScore + lowerCaseLetter.charCodeAt(0) - 97 + 1;
};

rawData.forEach((row) => {
  const middle = Math.floor(row.length / 2);

  const firstHalf = row.substr(0, middle);
  const secondHalf = row.substr(middle);

  const firstHalfLetters = new Set(firstHalf.split(''));
  const secondHalfLetters = new Set(secondHalf.split(''));

  const letter = [...firstHalfLetters].find((letter) => secondHalfLetters.has(letter));
  const letterScore = getScoreForLetter(letter ?? '');
  scores.push(letterScore);
  totalScore += letterScore;
});
console.log(totalScore);
