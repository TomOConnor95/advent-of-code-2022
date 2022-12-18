const text = await Deno.readTextFile('src/day15Data.txt');
// const text = await Deno.readTextFile('src/day15TestInput.txt');

const testInputCheckRow = 10;

const inputTestRow = 2000000;
// const inputTestRow = testInputCheckRow;

const pathRows = text.split('\n');

function isNotNull<T>(value: null| T): value is T {
    return value !== null;
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
    }
}).filter(isNotNull);

const OccupiedPointsInRowToTest = new Set<string>();

const getManhattanDistance = (coordinateA: [number, number], coordinateB: [number, number]) => {
    return Math.abs(coordinateA[0] - coordinateB[0]) + Math.abs(coordinateA[1] - coordinateB[1]);
}

parsedData.forEach(row => {
    const {sensorX, sensorY, beaconX, beaconY} = row;

    const manhattanDistance = getManhattanDistance([sensorX, sensorY], [beaconX, beaconY]);

    for (let x = sensorX - manhattanDistance; x<=sensorX + manhattanDistance; x++) {
        if (getManhattanDistance([x, inputTestRow],[sensorX, sensorY]) <= manhattanDistance) {
            OccupiedPointsInRowToTest.add(String(x));  
        }
    }
})

parsedData.forEach(row => {
    const {beaconX, beaconY} = row;

    if (beaconY === inputTestRow) {
        OccupiedPointsInRowToTest.delete(String(beaconX));
    }
})
console.log(OccupiedPointsInRowToTest)
console.log(OccupiedPointsInRowToTest.size)