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

const findCoordinates = () => {
    for (let x = 0; x <= inputMaxCoordinate; x++) {
        for (let y = 0; y <= inputMaxCoordinate; y++) {
            let foundABeaconWithinManhattanDistance = false;
    
            for (let dataIndex= 0; dataIndex<parsedData.length; dataIndex++){
                if (foundABeaconWithinManhattanDistance) {
                    continue;
                }
    
                if (getManhattanDistance([x,y], [parsedData[dataIndex].sensorX, parsedData[dataIndex].sensorY]) <= parsedData[dataIndex].manhattanDistance){
                    foundABeaconWithinManhattanDistance = true;
                    continue
                }
            }
            if (foundABeaconWithinManhattanDistance === false) {

                return [x,y]
            }
        }
    }
}

const coordinates = findCoordinates();

console.log(coordinates)
if (coordinates) {

    console.log(coordinates[0] * 4000000 + coordinates[1])
}