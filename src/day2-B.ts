const text = await Deno.readTextFile("src/day2Data.txt");
const rawData = text.split('\n');

let totalScore = 0;

const scores: number[] = [];

rawData.forEach((row) => {
  const [oppenentChoice, desiredResult] = row.split(' ');

  if (desiredResult === 'X') {
    //lose
    let roundScore = 0;
    if (oppenentChoice === 'A') {
      //rock
      roundScore += 3;
      totalScore += roundScore;
      scores.push(roundScore);
    } else if (oppenentChoice === 'B') {
      //paper
      roundScore += 1;
      totalScore += roundScore;
      scores.push(roundScore);
    } else if (oppenentChoice === 'C') {
      //scissors
      roundScore += 2;
      totalScore += roundScore;
      scores.push(roundScore);
    }
  }
  if (desiredResult === 'Y') {
    //draw
    let roundScore = 3;
    if (oppenentChoice === 'A') {
      //rock
      roundScore += 1;
      totalScore += roundScore;
      scores.push(roundScore);
    } else if (oppenentChoice === 'B') {
      //paper
      roundScore += 2;
      totalScore += roundScore;
      scores.push(roundScore);
    } else if (oppenentChoice === 'C') {
      //scissors
      roundScore += 3;
      totalScore += roundScore;
      scores.push(roundScore);
    }
  }
  if (desiredResult === 'Z') {
    //win
    let roundScore = 6;
    if (oppenentChoice === 'A') {
      //rock
      roundScore += 2;
      totalScore += roundScore;
      scores.push(roundScore);
    } else if (oppenentChoice === 'B') {
      //paper
      roundScore += 3;
      totalScore += roundScore;
      scores.push(roundScore);
    } else if (oppenentChoice === 'C') {
      //scissors
      roundScore += 1;
      totalScore += roundScore;
      scores.push(roundScore);
    }
  }
});
// console.log(scores)
console.log(totalScore);
