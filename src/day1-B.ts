const text = await Deno.readTextFile("src/day1Data.txt");
const rawData = text.split('\n\n');

let highestCounts = [0, 0, 0];

const dataArrays = rawData.map((data) => data.split('\n').map((stringNumber) => parseInt(stringNumber)));
// const dataArrayLengths = dataArrays.map(array => array.length)
const dataArrayCounts = dataArrays.map((array) => {
  const itemCount = array.reduce((curr, acc) => curr + acc, 0);
  if (itemCount > highestCounts[0]) {
    highestCounts = [itemCount, highestCounts[0], highestCounts[1]];
  } else if (itemCount > highestCounts[1]) {
    highestCounts = [highestCounts[0], itemCount, highestCounts[1]];
  } else if (itemCount > highestCounts[2]) {
    highestCounts = [highestCounts[0], highestCounts[1], itemCount];
  }
  return itemCount;
});

console.log(highestCounts.reduce((curr, acc) => curr + acc, 0));
