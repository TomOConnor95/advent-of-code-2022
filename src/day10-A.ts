const text = await Deno.readTextFile('src/day10Data.txt');
// const text = await Deno.readTextFile('src/day10TestInput.txt');
const rawData = text.split('\n');

let cycleNumber = 1
const valuesOverTime: number[] = [];
let currentValue = 1;

rawData.forEach(row => {
    if (row === 'noop'){
        valuesOverTime.push(currentValue);
        cycleNumber++;
        return;
    }

    const [instructionName, argument] = row.split(' ');

    if (instructionName !== 'addx') {
        throw new Error(`unsupported instruction ${instructionName}`);
    }
    

    const addAmount = parseInt(argument);
    
    valuesOverTime.push(currentValue);
    cycleNumber ++;
    valuesOverTime.push(currentValue);
    cycleNumber ++;
    currentValue += addAmount
});

const scores = valuesOverTime.reduce((acc, current, index) => {
    if (index === 19 || (((index -19) % 40) === 0)) {
        return [...acc, current * (index +1)];
    }
    return acc;

}, [0])
const score = scores.reduce((acc, curr) => acc + curr)

console.log(valuesOverTime)
console.log(scores)

console.log(score)