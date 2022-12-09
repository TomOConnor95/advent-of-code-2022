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

rawData.forEach((row) => {
  const middle = Math.floor(row.length / 2);

  const firstHalf = row.substr(0, middle);
  const secondHalf = row.substr(middle);

  const firstHalfLetters = new Set(firstHalf.split(''));
  // console.log(row, firstHalf, secondHalf, firstHalfLetters)
  for (let i = 0; i <= secondHalf.length; i++) {
    const letter = secondHalf[i];
    if (firstHalfLetters.has(letter)) {
      if (letter === letter.toUpperCase()) {
        const letterScore = letter.charCodeAt(0) - 65 + 1 + 26;
        scores.push(letterScore);
        totalScore += letterScore;
      } else {
        const letterScore = letter.charCodeAt(0) - 97 + 1;
        scores.push(letterScore);
        totalScore += letterScore;
      }
      return;
    }
  }
});
console.log(totalScore);
