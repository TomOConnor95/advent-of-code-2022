const text = await Deno.readTextFile('src/day11Data.txt');
// const text = await Deno.readTextFile('src/day11TestInput.txt');
const monkeysInfo = text.split('\n\n');


// parse data
const parsedMonkeysInfo = monkeysInfo.map(monkey => {
    const rows = monkey.split('\n');
    const [, startingItemsString] = rows[1].split('Starting items: ')
    const startingItems = startingItemsString.split(', ').map(item => parseInt(item));

    const [, operationString] = rows[2].split('Operation: new = old ')
    const [mathSymbol, numberString] = operationString.split(' ');
    const number = parseInt(numberString);
    
    const [, divisibleTestNumberString] = rows[3].split('Test: divisible by ')
    const divisibleTestNumber = parseInt(divisibleTestNumberString); 
    
    const [, trueMonkeyNumberString] = rows[4].split('If true: throw to monkey ')
    const trueMonkeyNumber = parseInt(trueMonkeyNumberString); 

    const [, falseMonkeyNumberString] = rows[5].split('If false: throw to monkey ')
    const falseMonkeyNumber = parseInt(falseMonkeyNumberString); 

    return {
        startingItems, mathSymbol, number, numberString, divisibleTestNumber, trueMonkeyNumber, falseMonkeyNumber
    }
});
console.log(parsedMonkeysInfo)

const monkeyInspections = parsedMonkeysInfo.map(() => 0)

const initialRoundData = parsedMonkeysInfo.map(monkey => monkey.startingItems);

const roundsData: number[][][] = [
    structuredClone(initialRoundData)
];

[...Array(20)].map(() => 0).forEach(() => {
    const previousRound = roundsData[roundsData.length - 1];
    
    const newRoundData: number[][] = structuredClone(previousRound)
    console.log(newRoundData)
    newRoundData.forEach((monkey, monkeyIndex) => {
        monkey.forEach(monkeyItem => {
            monkeyInspections[monkeyIndex] += 1;

            const monkeyInfo = parsedMonkeysInfo[monkeyIndex]
            
            let newWorryLevel = monkeyItem;
            const amount = monkeyInfo.numberString === 'old' ? monkeyItem : monkeyInfo.number;

            if (monkeyInfo.mathSymbol === '+') {
                newWorryLevel += amount;
            } else if (monkeyInfo.mathSymbol === '*') {
                newWorryLevel *= amount;
            }
            newWorryLevel = Math.floor(newWorryLevel/3);

            const divisor = monkeyInfo.divisibleTestNumber;


            if (newWorryLevel % divisor === 0) {
                newRoundData[monkeyInfo.trueMonkeyNumber].push(newWorryLevel);
            } else {
                newRoundData[monkeyInfo.falseMonkeyNumber].push(newWorryLevel);
            }
        })
        newRoundData[monkeyIndex] = [];
    })

    roundsData.push(newRoundData);

})

// console.log(roundsData)
// console.log(monkeyInspections)

const sortedInspections = (monkeyInspections.sort((a,b)=> b-a));

console.log(sortedInspections[0] * sortedInspections[1])