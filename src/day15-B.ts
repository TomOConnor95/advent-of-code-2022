const text = await Deno.readTextFile('src/day15Data.txt');
const inputMaxCoordinate = 4000000;

// const text = await Deno.readTextFile('src/day15TestInput.txt');
// const inputMaxCoordinate = 20;


const pathRows = text.split('\n');

function isNotNull<T>(value: null| T): value is T {
    return value !== null;
}

const getManhattanDistance = (coordinateA: readonly [number, number], coordinateB: readonly [number, number]) => {
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
// In the task's data, there is a 4000000 x 4000000 grid, so it will be way
// too inefficient to calculate the values for every cell then search for an
// empty cell. Instead we know that the empty cell will be 1 more than the manhattan
// distance away from at least 1 beacon (if in corner), or at least 2 beacons otherwise.
// Searching over these will dramatically reduce the amount of computation necessary.

const isCoordinateInRange = (coordinate: readonly [number, number]) => (
    coordinate[0] >= 0 &&
    coordinate[0] <= inputMaxCoordinate &&
    coordinate[1] >= 0 && 
    coordinate[1] <= inputMaxCoordinate
)

const checkIfAnyBeaconsWithinManhattanDistance = (coordinates: readonly [number, number]) => {
    for (let dataIndex= 0; dataIndex<parsedData.length; dataIndex++){
        if (getManhattanDistance(coordinates, [parsedData[dataIndex].sensorX, parsedData[dataIndex].sensorY]) <= parsedData[dataIndex].manhattanDistance){
            return true;
        }
    }
    return false;
}

const findCoordinates = () => {
    for (let outerIndex = 0; outerIndex < parsedData.length; outerIndex++) {
        const row = parsedData[outerIndex];
        const {sensorX, sensorY, manhattanDistance} = row;
        console.log({sensorX, sensorY, manhattanDistance})
        for (let counter = 0; counter <= manhattanDistance; counter++) {
            const inverseCounter = manhattanDistance + 1 - counter;
            
            const bottomRightEdgeItem = [sensorX + inverseCounter, sensorY - counter] as const;
            const topRightEdgeItem = [sensorX + counter, sensorY + inverseCounter] as const;
            const bottomLeftEdgeItem = [sensorX - counter, sensorY - inverseCounter] as const;
            const topLeftEdgeItem = [sensorX - inverseCounter, sensorY + counter] as const;
    
            if (isCoordinateInRange(bottomRightEdgeItem)) {
                if (!checkIfAnyBeaconsWithinManhattanDistance(bottomRightEdgeItem)) {
                    console.log('found it! bottomRightEdgeItem')
                    return bottomRightEdgeItem;
                }     
            }
            if (isCoordinateInRange(topRightEdgeItem)) {
                if (!checkIfAnyBeaconsWithinManhattanDistance(topRightEdgeItem)) {
                    console.log('found it! topRightEdgeItem')
                    return topRightEdgeItem;
                }     
            }
            if (isCoordinateInRange(bottomLeftEdgeItem)) {
                if (!checkIfAnyBeaconsWithinManhattanDistance(bottomLeftEdgeItem)) {
                    console.log('found it! bottomLeftEdgeItem')
                    return bottomLeftEdgeItem;
                }     
            }
            if (isCoordinateInRange(topLeftEdgeItem)) {
                if (!checkIfAnyBeaconsWithinManhattanDistance(topLeftEdgeItem)) {
                    console.log('found it! topLeftEdgeItem')
                    return topLeftEdgeItem;
                }
            }
        }
    }
}

const coordinates = findCoordinates();

console.log(coordinates)
if (coordinates) {

    console.log(coordinates[0] * 4000000 + coordinates[1])
}