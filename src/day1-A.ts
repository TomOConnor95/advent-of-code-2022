const text = await Deno.readTextFile("src/day1Data.txt");

const rawData=text.split('\n\n');

let highestCount = 0;
const dataArrays = rawData.map((data) => data.split('\n').map((stringNumber) => parseInt(stringNumber)));

const dataArrayCounts = dataArrays.map((array) => {
  const itemCount = array.reduce((curr, acc) => curr + acc, 0);
  if (itemCount > highestCount) {
    highestCount = itemCount;
  }
  return itemCount;
});

console.log(highestCount);
