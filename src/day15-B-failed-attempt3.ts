const text = await Deno.readTextFile('src/day15Data.txt');
const inputMaxCoordinate = 4000000;

// const text = await Deno.readTextFile('src/day15TestInput.txt');
// const inputMaxCoordinate = 20;


const pathRows = text.split('\n');

function isNotNull<T>(value: null| T): value is T {
    return value !== null;
}

const getManhattanDistance = (coordinateA: [number, number], coordinateB: [number, number]) => {
    return Math.abs(coordinateA[0] - coordinateB[0]) + Math.abs(coordinateA[1] - coordinateB[1]);
}

const parsedData = pathRows.map(pathRow => {
    const match = pathRow.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/);
    if (match === null) {
        return null;
    }
    const [_, sensorX, sensorY, beaconX, beaconY] = match;
    return {
        sensorX: parseInt(sensorX),
        sensorY: parseInt(sensorY),
        beaconX: parseInt(beaconX),
        beaconY: parseInt(beaconY),
        manhattanDistance: getManhattanDistance([parseInt(sensorX), parseInt(sensorY)],[parseInt(beaconX),parseInt(beaconY)])
    }
}).filter(isNotNull);
console.log(parsedData)
// In the task's data, there is a 4000000 x 4000000 grid, so it will be way
// too inefficient to calculate the values for every cell then search for an
// empty cell. Instead we know that the empty cell will be 1 more than the manhattan
// distance away from at least 1 beacon (if in corner), or at least 2 beacons otherwise.
// Searching over these will dramatically reduce the ammount of computation necessary.
// Still not memory effiecnt enough to store all the single possible cells, so will try
// directly computing all the cells with 2 or more matches
const possibleCells = new Set<string>();
const doubleCells = new Set<string>();

const isCoordinateInRange = (coordinate: readonly [number, number]) => (
    coordinate[0] >= 0 &&
    coordinate[0] <= inputMaxCoordinate &&
    coordinate[1] >= 1 && 
    coordinate[1] <= inputMaxCoordinate
)

parsedData.forEach(row => {
    const {sensorX, sensorY, manhattanDistance} = row;

    for (let counter = 0; counter <= manhattanDistance; counter ++) {
        const inverseCounter = manhattanDistance + 1 - counter;
        
        const bottomRightEdgeItem = [sensorX + inverseCounter, sensorY - counter] as const;
        const topRightEdgeItem = [sensorX + counter, sensorY + inverseCounter] as const;
        const bottomLeftEdgeItem = [sensorX - counter, sensorY - inverseCounter] as const;
        const topLeftEdgeItem = [sensorX - inverseCounter, sensorY + counter] as const;

        const bottomRightEdgeItemKey = `${bottomRightEdgeItem[0]}_${bottomRightEdgeItem[1]}`;
        const topRightEdgeItemKey = `${topRightEdgeItem[0]}_${topRightEdgeItem[1]}`;
        const bottomLeftEdgeItemKey = `${bottomLeftEdgeItem[0]}_${bottomLeftEdgeItem[1]}`;
        const topLeftEdgeItemKey = `${topLeftEdgeItem[0]}_${topLeftEdgeItem[1]}`;

        if (isCoordinateInRange(topRightEdgeItem)) {
            if (possibleCells.has(topRightEdgeItemKey)) {
                doubleCells.add(topRightEdgeItemKey);
            }
            possibleCells.add(topRightEdgeItemKey);
        }
        if (isCoordinateInRange(bottomRightEdgeItem)) {
            if (possibleCells.has(bottomRightEdgeItemKey)) {
                doubleCells.add(bottomRightEdgeItemKey);
            }
            possibleCells.add(bottomRightEdgeItemKey);
        }
        if (isCoordinateInRange(topLeftEdgeItem)) {
            if (possibleCells.has(topLeftEdgeItemKey)) {
                doubleCells.add(topLeftEdgeItemKey);
            }
            possibleCells.add(topLeftEdgeItemKey);
        }
        if (isCoordinateInRange(bottomLeftEdgeItem)) {
            if (possibleCells.has(bottomLeftEdgeItemKey)) {
                doubleCells.add(bottomLeftEdgeItemKey);
            }
            possibleCells.add(bottomLeftEdgeItemKey);
        }

    }
});

console.log(possibleCells.size)
console.log(doubleCells.size)

// const checkIfAnyBeaconsWithinManhattanDistance = (coordinates: [number, number]) => {
//     for (let dataIndex= 0; dataIndex<parsedData.length; dataIndex++){
//         if (getManhattanDistance(coordinates, [parsedData[dataIndex].sensorX, parsedData[dataIndex].sensorY]) <= parsedData[dataIndex].manhattanDistance){
//             return true;
//         }
//     }
//     return false;
// }

// const findCoordinates = () => {
//     for (let x = 0; x <= inputMaxCoordinate; x++) {
//         for (let y = 0; y <= inputMaxCoordinate; y++) {
            
//         }
//     }
// }

// const coordinates = findCoordinates();

// console.log(coordinates)
// if (coordinates) {

//     console.log(coordinates[0] * 4000000 + coordinates[1])
// }