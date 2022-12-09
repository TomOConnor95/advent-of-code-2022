const text = await Deno.readTextFile("src/day4Data.txt");
const rawData = text.split('\n');


let totalScore = 0;

const scores = [];

rawData.forEach((row) => {
  const [firstElf, secondElf] = row.split(',');

  const [firstElfMin, firstElfMax] = firstElf.split('-').map((item) => parseInt(item));
  const [secondElfMin, secondElfMax] = secondElf.split('-').map((item) => parseInt(item));

  if (
    (firstElfMin >= secondElfMin && firstElfMax <= secondElfMax) ||
    (firstElfMin <= secondElfMin && firstElfMax >= secondElfMax)
  ) {
    totalScore += 1;
  }
});
console.log(totalScore);
