const text = await Deno.readTextFile("src/day2Data.txt");
const rawData = text.split('\n');

let totalScore = 0;

const scores: number[] = [];

rawData.forEach((row) => {
  const [oppenentChoice, youChoice] = row.split(' ');

  if (oppenentChoice === 'A') {
    //rock
    if (youChoice === 'X') {
      //rock
      const roundScore = 4;
      totalScore += roundScore;
      scores.push(roundScore);
    } else if (youChoice === 'Y') {
      //paper
      const roundScore = 8;
      totalScore += roundScore;
      scores.push(roundScore);
    } else if (youChoice === 'Z') {
      //scissors
      const roundScore = 3;
      totalScore += roundScore;
      scores.push(roundScore);
    }
  } else if (oppenentChoice === 'B') {
    // paper
    if (youChoice === 'X') {
      //rock
      const roundScore = 1;
      totalScore += roundScore;
      scores.push(roundScore);
    } else if (youChoice === 'Y') {
      //paper
      const roundScore = 5;
      totalScore += roundScore;
      scores.push(roundScore);
    } else if (youChoice === 'Z') {
      // scissors
      const roundScore = 9;
      totalScore += roundScore;
      scores.push(roundScore);
    }
  } else if (oppenentChoice === 'C') {
    // scissors
    if (youChoice === 'X') {
      //rock
      const roundScore = 7;
      totalScore += roundScore;
      scores.push(roundScore);
    } else if (youChoice === 'Y') {
      //paper
      const roundScore = 2;
      totalScore += roundScore;
      scores.push(roundScore);
    } else if (youChoice === 'Z') {
      // scissors
      const roundScore = 6;
      totalScore += roundScore;
      scores.push(roundScore);
    }
  }
});

console.log(totalScore);
