const text = await Deno.readTextFile('src/day15Data.txt');
// const text = await Deno.readTextFile('src/day15TestInput.txt');

// const testInputMaxCoordinate = 20;

// const inputMaxCoordinate = testInputMaxCoordinate;
const inputMaxCoordinate = 4000000;

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


type DataGrid = ('.' | '#' | 'S' | 'B')[][]
const dataGrid: DataGrid = []

for (let x = 0; x<=inputMaxCoordinate; x++) {
    for (let y = 0; y<=inputMaxCoordinate; y++) {
        if (!dataGrid[y]) {
            dataGrid[y] = [];
        }

        dataGrid[y][x] = '.'
    }
}

// const getManhattanDistance = (coordinateA: [number, number], coordinateB: [number, number]) => {
//     return Math.abs(coordinateA[0] - coordinateB[0]) + Math.abs(coordinateA[1] - coordinateB[1]);
// }

// parsedData.forEach(row => {
//     const {sensorX, sensorY, beaconX, beaconY} = row;
//     // dataGrid[sensorY][sensorX] = 'S';
//     // dataGrid[beaconY][beaconX] = 'B';


//     const manhattanDistance = getManhattanDistance([sensorX, sensorY], [beaconX, beaconY]);


//     for (let x = Math.max(sensorX - manhattanDistance, 0); x<=Math.min(sensorX + manhattanDistance, inputMaxCoordinate); x++) {
//         for (let y = Math.max(sensorY - manhattanDistance, 0); y<=Math.min(sensorY + manhattanDistance, inputMaxCoordinate); y++) {
//             console.log({x,y})
//             if (getManhattanDistance([x, y],[sensorX, sensorY]) <= manhattanDistance) {
                
//                 if ( dataGrid[y][x] === '.') {

//                     dataGrid[y][x] = '#'
//                 }
//             }
//         }
//     }
// })

// const freeY = dataGrid.findIndex(row => row.findIndex(item => item === '.') > -1);
// const freeX = dataGrid[freeY].findIndex(item => item === '.');

// // Mapping over negatie array indexes gives a weird order, but should be fine to answer question
// // console.log(Object.values(dataGrid).map(row => Object.values(row).join('')).join('\n'))
// console.log(freeX,freeY, freeX*4000000 + freeY); 
