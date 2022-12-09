const text = await Deno.readTextFile("src/day3Data.txt");
const rawData = text.split('\n');

let totalScore = 0;

const scores: number[] = [];

const getScoreForLetter = (letter: string) => {
  const lowerCaseLetter = letter.toLowerCase();
  const capitalScore = letter === lowerCaseLetter ? 0 : 26;
  return capitalScore + lowerCaseLetter.charCodeAt(0) - 97 + 1;
};

for (let outerIndex = 0; outerIndex < rawData.length; outerIndex = outerIndex + 3) {
  const firstElf = rawData[outerIndex];
  const secondElf = rawData[outerIndex + 1];
  const thirdElf = rawData[outerIndex + 2];

  const firstElfLetters = new Set(firstElf.split(''));
  const secondElfLetters = new Set(secondElf.split(''));
  const thirdElfLetters = new Set(thirdElf.split(''));

  const matchingLetter = [...firstElfLetters].find(
    (letter) => secondElfLetters.has(letter) && thirdElfLetters.has(letter),
  );

  const letterScore = getScoreForLetter(matchingLetter ?? '');
  scores.push(letterScore);
  totalScore += letterScore;
}

console.log(totalScore);
