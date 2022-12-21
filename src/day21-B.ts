const text = await Deno.readTextFile('src/day21Data.txt');
// const text = await Deno.readTextFile('src/day21TestInput.txt');

const ENABLE_DEBUG = false;
// const ENABLE_DEBUG = true; 

type NumberMonkey = {
    name: string;
    number: number;
    monkeyAName?: undefined;
    monkeyBName?: undefined;
    operation?: undefined;
}

type OperationMonkey = {
    name: string;
    monkeyAName: string;
    monkeyA?: OperationMonkey | NumberMonkey
    monkeyBName: string;
    monkeyB?: OperationMonkey | NumberMonkey
    operation: "+" | "-" | "*" | "/" | "=";
    number?: undefined;
}

function isOperationMonkey (monkey: NumberMonkey | OperationMonkey): monkey is OperationMonkey {
    return typeof monkey.monkeyAName !== 'undefined';
}

const monkeys = text.split('\n').reduce<Record<string,OperationMonkey | NumberMonkey >>((acc, curr) => {
    const [name, instruction] = curr.split(': ');

    if (instruction.split(' ').length === 1) {
        return {
            ...acc,
            [name]: {
                name,
                number: parseInt(instruction)
            }
        }
    }
    const [monkeyAName, operation, monkeyBName] = instruction.split(' ');
    return {
        ...acc,
        [name]: {
            name,
            monkeyAName,
            monkeyBName,
            operation: operation as '+' | '-' | '*' | '/'
        }  
    }
}, {})

const rootMonkeyName = 'root';

console.log(monkeys)

// Construct a tree of values, then iterate down the tree? 

const monkeyTree = {
    ...monkeys[rootMonkeyName]
} as OperationMonkey;
monkeyTree.operation = '=';
console.log(monkeyTree)

const addChildItems = (monkey: OperationMonkey | NumberMonkey) => {
    if (!isOperationMonkey(monkey)) {
        return;
    }
    const {monkeyAName, monkeyBName} = monkey;
    monkey.monkeyA = monkeys[monkeyAName];
    monkey.monkeyB = monkeys[monkeyBName];
    addChildItems(monkey.monkeyA);
    addChildItems(monkey.monkeyB);
}

addChildItems(monkeyTree);
console.log(monkeyTree)

const HUMAN_NAME = 'humn';

// const findHumanTreeSide = (tree: OperationMonkey) => {
//     if (!isOperationMonkey(tree)) {
//         return null;
//     }
//     const {monkeyAName, monkeyBName, monkeyA, monkeyB, name} = tree;

//     if (monkeyAName === HUMAN_NAME) {
//         return ['monkeyA', name];
//     }
//     if (monkeyBName === HUMAN_NAME) {
//         return ['monkeyA', name];
//     }
//     const aChildResult = findHumanTreeSide(monkeyA);
//     if (aChildResult !== null) {
//         return aChildResult;
//     }

//     const bChildResult = findHumanTreeSide(monkeyB);
//     if (bChildResult !== null) {
//         return bChildResult;
//     }
//     return null;
// }
// console.log('treeside', findHumanTreeSide(monkeyTree))

const getTreeValue = (monkeyTree: OperationMonkey, humanInputValue: number) => {
    const {monkeyA, monkeyB, operation} = monkeyTree;
    if (!monkeyA || !monkeyB) {
        throw new Error('monkey a or b not found')
    }
    
    let monkeyAValue: number = isOperationMonkey(monkeyA) ? getTreeValue(monkeyA, humanInputValue) : monkeyA.number;
    let monkeyBValue: number = isOperationMonkey(monkeyB) ? getTreeValue(monkeyB, humanInputValue) : monkeyB.number;

    if (monkeyA.name === HUMAN_NAME) {
        monkeyAValue = humanInputValue;
    }
    if (monkeyB.name === HUMAN_NAME) {
        monkeyBValue = humanInputValue;
    }

    if (operation === '*') {
        return monkeyAValue * monkeyBValue;
    }
    if (operation === '/') {
        return monkeyAValue / monkeyBValue;
    }
    if (operation === '+') {
        return monkeyAValue + monkeyBValue;
    }
    if (operation === '-') {
        return monkeyAValue - monkeyBValue;
    }
    if (operation === '=') {
        console.log('Equals operation', monkeyAValue, monkeyBValue, monkeyAValue === monkeyBValue)
        return monkeyAValue - monkeyBValue;
    }
    return 0;
}

// Quick and dirty gradient descent kind of thing. 
// Rand a few times tweaking these values
// Can definitely do this in a much smarter way by measuring gradient differences,
// and adjusting the increment accordingly.
let previousInput = 3782852515010;
const increment = 1;



const higherGuess = previousInput + 1;
    const lowerGuess = previousInput - 1;
    const newResultHigher = getTreeValue(monkeyTree, higherGuess);
    const newResultLower = getTreeValue(monkeyTree, lowerGuess);

let upwards = true;
if (Math.abs(newResultHigher) < Math.abs(newResultLower)) {
} else {
    upwards = false;
}
while (true) {
    const newGuess = upwards ? previousInput + increment : previousInput - increment;
    previousInput = newGuess;

    const newResult = getTreeValue(monkeyTree, newGuess);
    console.log(newGuess, newResult);


    if (newResult === 0) {
        break;
    }


}
