const text = await Deno.readTextFile('src/day10Data.txt');
// const text = await Deno.readTextFile('src/day10TestInput.txt');
const rawData = text.split('\n');

let cycleNumber = 1
const valuesOverTime: number[] = [];
let currentValue = 1;
const crtValuesOverTime: string[] = [];

const updateCrt = () => {
    if (
        (Math.abs((currentValue+1) - (cycleNumber % 40)) <= 1)
    ) {
        crtValuesOverTime.push('#')
    } else {
        crtValuesOverTime.push('.')
    }
    if (cycleNumber % 40 === 0) {
        crtValuesOverTime.push('\n');
    }
}
rawData.forEach(row => {
    if (row === 'noop'){
        valuesOverTime.push(currentValue);
        updateCrt()
        cycleNumber++;
        return;
    }

    const [instructionName, argument] = row.split(' ');

    if (instructionName !== 'addx') {
        throw new Error(`unsupported instruction ${instructionName}`);
    }
    
    const addAmount = parseInt(argument);
    
    valuesOverTime.push(currentValue);
    updateCrt()
    cycleNumber ++;

    valuesOverTime.push(currentValue);
    updateCrt()
    cycleNumber ++;
    currentValue += addAmount
});

console.log(crtValuesOverTime.join(''))