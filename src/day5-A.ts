const text = await Deno.readTextFile('src/day5Data.txt');
const rawData = text.split('\n');

const initialState = [
  ['T', 'P', 'Z', 'C', 'S', 'L', 'Q', 'N'],
  ['L', 'P', 'T', 'V', 'H', 'C', 'G'],
  ['D', 'C', 'Z', 'F'],
  ['G', 'W', 'T', 'D', 'L', 'M', 'V', 'C'],
  ['P', 'W', 'C'],
  ['P', 'F', 'J', 'D', 'C', 'T', 'S', 'Z'],
  ['V', 'W', 'G', 'B', 'D'],
  ['N', 'J', 'S', 'Q', 'H', 'W'],
  ['R', 'C', 'Q', 'F', 'S', 'L', 'V'],
];

rawData.forEach((row) => {
    const regexMatch = row.match(/move (\d+) from (\d+) to (\d+)/);
    if (regexMatch === null) {
        return;
    }
    const [_, numberOfItems, fromNumber, toNumber] = regexMatch

    const fromIndex = parseInt(fromNumber) - 1;
    const toIndex = parseInt(toNumber) - 1;

    [...Array(parseInt(numberOfItems))].map(() => 0).forEach(() => {
        const item = initialState[fromIndex].pop();
        if (item){
            initialState[toIndex].push(item)
        }
    })
})

const topItems = initialState.map(stack => stack.pop())
console.log(topItems.join(''))