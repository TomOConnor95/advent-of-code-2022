const text = await Deno.readTextFile('src/day17Data.txt');
// const text = await Deno.readTextFile('src/day17TestInput.txt');
const ENABLE_DEBUG = false;
const numberOfRocksToCount = 2022;

const directions = text.split('').map(character => {
    if (character === '<') {
        return 'Left';
    }
    return 'Right';
});

/* 
    The tall, vertical chamber is exactly seven units wide.
    Each rock appears so that its left edge is two units away
    from the left wall and its bottom edge is three units above
    the highest rock in the room (or the floor, if there isn't one).
*/
const rocksInitialPositions = [
    [
        ['.', '.', '@', '@', '@', '@', '.']
    ],
    [
        ['.', '.', '.', '@', '.', '.', '.'],
        ['.', '.', '@', '@', '@', '.', '.'],
        ['.', '.', '.', '@', '.', '.', '.']
    ],
    [
        ['.', '.', '@', '@', '@', '.', '.'], // Note the order of these are reversed, but to order of insertion
        ['.', '.', '.', '.', '@', '.', '.'],
        ['.', '.', '.', '.', '@', '.', '.'],
    ],
    [
        ['.', '.', '@', '.', '.', '.', '.'],
        ['.', '.', '@', '.', '.', '.', '.'],
        ['.', '.', '@', '.', '.', '.', '.'],
        ['.', '.', '@', '.', '.', '.', '.'],
    ],
    [
        ['.', '.', '@', '@', '.', '.', '.'],
        ['.', '.', '@', '@', '.', '.', '.'],
    ],
] as const;

const emptyRow = ['.', '.', '.', '.', '.', '.', '.'] as const;

type Chamber = ('.' | '#' | '@')[][];
let chamber: Chamber = []



let windCounter = 0;
let maxHeightOfRocks = 0;


const doHorizontalMove = (windDirection: 'Left' | 'Right') => {
    const potentialChamber = structuredClone(chamber);
    let isValidMove = true;
    // not particularly efficient, but probably doesn't matter
    chamber.forEach((row, rowIndex) => {
        if (!isValidMove) {
            return;
        }
        row.forEach((item, columnIndex) => {
            if (!isValidMove) {
                return;
            }
            if (item !== '@') {
                return;
            }
            if (windDirection === 'Left') {
                if ((columnIndex === 0) || (chamber[rowIndex][columnIndex -1] === '#')) {
                    isValidMove = false;
                    return;
                }
                potentialChamber[rowIndex][columnIndex] = '.';
                potentialChamber[rowIndex][columnIndex - 1] = '@';
            }
            if (windDirection === 'Right') {
                if ((columnIndex === chamber[rowIndex].length - 1) || (chamber[rowIndex][columnIndex + 1] === '#')) {
                    isValidMove = false;
                    return;
                }
                // console.log('moving right', potentialChamber[rowIndex][columnIndex], potentialChamber[rowIndex][columnIndex + 1])
                potentialChamber[rowIndex][columnIndex] = chamber[rowIndex][columnIndex - 1] === '@' ? '@' : '.';
                potentialChamber[rowIndex][columnIndex + 1] = '@';
                // console.log('aftermove', potentialChamber)

            }
        })
    })
    if (isValidMove) {
        chamber = potentialChamber;

        ENABLE_DEBUG && console.log('Valid Horizontal Move', windDirection);
        ENABLE_DEBUG && console.log(chamber.map(item => item.join('')).join('\n'));
    } else {
        ENABLE_DEBUG && console.log('Invalid Horizontal Move', windDirection)
    }
}
const doVerticalMove = () => {
    const potentialChamber: Chamber = structuredClone(chamber);
    let isValidMove = true;
    // not particularly efficient, but probably doesn't matter
    chamber.forEach((row, rowIndex) => {
        if (!isValidMove) {
            return;
        }
        row.forEach((item, columnIndex) => {
            if (!isValidMove) {
                return;
            }
            if (item !== '@') {
                return;
            }
            
            if ((rowIndex === 0) || (chamber[rowIndex - 1][columnIndex] === '#')) {
                isValidMove = false;
                return;
            }
            potentialChamber[rowIndex][columnIndex] = '.';
            potentialChamber[rowIndex - 1][columnIndex] = '@';
        })
    })
    if (isValidMove) {
        chamber = potentialChamber;
        ENABLE_DEBUG && console.log('Valid Vertical Move') 
        ENABLE_DEBUG && console.log(chamber.map(item => item.join('')).join('\n'))
    } else {
        chamber.forEach((row, rowIndex) => {
            row.forEach((item, columnIndex) => {
                if (item === '@') {
                    chamber[rowIndex][columnIndex] = '#';
                    if (rowIndex + 1> maxHeightOfRocks) {
                        maxHeightOfRocks = rowIndex + 1;
                    }
                }
            })
        })
        ENABLE_DEBUG && console.log('Invalid Vertical Move')
        ENABLE_DEBUG && console.log(chamber.map(item => item.join('')).join('\n'))
    }
    return isValidMove;
}


for (let rockIndex=0; rockIndex < numberOfRocksToCount; rockIndex++) {
    console.log('----for loop----', rockIndex)
    const numberOfEmptyRowsAboveRocks = chamber.length - maxHeightOfRocks;
    if (numberOfEmptyRowsAboveRocks > 7) {
        
        console.log(numberOfEmptyRowsAboveRocks);
    }
    if (numberOfEmptyRowsAboveRocks === 0) {
        chamber.push([...emptyRow], [...emptyRow], [...emptyRow])
    }
    if (numberOfEmptyRowsAboveRocks === 1) {
        chamber.push([...emptyRow], [...emptyRow])
    }
    if (numberOfEmptyRowsAboveRocks === 2) {
        chamber.push([...emptyRow])
    }
    if (numberOfEmptyRowsAboveRocks === 4) {
        chamber.pop();
    }
    if (numberOfEmptyRowsAboveRocks === 5) {
        chamber.pop();
        chamber.pop();
    }
    if (numberOfEmptyRowsAboveRocks === 6) {
        chamber.pop();
        chamber.pop();
        chamber.pop();
    }
    if (numberOfEmptyRowsAboveRocks === 7) {
        chamber.pop();
        chamber.pop();
        chamber.pop();
        chamber.pop();
    }
    chamber = [...chamber, ...structuredClone(rocksInitialPositions[rockIndex % rocksInitialPositions.length])]

    let settled = false;
    while (!settled) {
        const windDirection = directions[windCounter % directions.length];
        windCounter++;
        doHorizontalMove(windDirection);
        const isValid = doVerticalMove();
        if (!isValid) {
            settled = true;
        }
    }
}
console.log('-----final State------')
console.log(chamber.reverse().map(item => item.join('')).join('\n'))
Deno.writeTextFileSync('./17output.txt', chamber.reverse().reverse().map(item => item.join('')).join('\n'))
console.log(maxHeightOfRocks)