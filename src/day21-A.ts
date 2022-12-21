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
    operation: "+" | "-" | "*" | "/";
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

const getTreeValue = (monkeyTree: OperationMonkey) => {
    const {monkeyA, monkeyB, operation} = monkeyTree;
    if (!monkeyA || !monkeyB) {
        throw new Error('monkey a or b not found')
    }
    
    const monkeyAValue: number = isOperationMonkey(monkeyA) ? getTreeValue(monkeyA) : monkeyA.number;
    const monkeyBValue: number = isOperationMonkey(monkeyB) ? getTreeValue(monkeyB) : monkeyB.number;

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
    return 0;
}

console.log(getTreeValue(monkeyTree))