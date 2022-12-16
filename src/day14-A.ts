const text = await Deno.readTextFile('src/day14Data.txt');
// const text = await Deno.readTextFile('src/day14TestInput.txt');
const pathRows = text.split('\n');

const parsedData = pathRows.map(pathRow => {
    const paths = pathRow.split(' -> ').map(item => {
        const [distanceFromLeftString, distanceFromTopString] = item.split(',');
        return {
            distanceFromLeft: parseInt(distanceFromLeftString),
            distanceFromTop: parseInt(distanceFromTopString),
        }
    })
    return paths;
})

console.log(parsedData);

const sandEntryCoordinate = {
    distanceFromTop: 0,
    distanceFromLeft: 500,
}

let minimumX = Infinity;
let maximumX = -Infinity;
let minimumY = 0;
let maximumY = -Infinity;

parsedData.forEach(row => {
    row.forEach(item => {
        if (item.distanceFromLeft > maximumX) {
            maximumX = item.distanceFromLeft;
        }
        if (item.distanceFromLeft < minimumX) {
            minimumX = item.distanceFromLeft;
        }
        if (item.distanceFromTop > maximumY) {
            maximumY = item.distanceFromTop;
        }
        if (item.distanceFromTop < minimumY) {
            minimumY = item.distanceFromTop;
        }
    })
})
console.log(
    minimumX, maximumX, minimumY, maximumY
)

type DataGrid = ('.' | '#' | 'o')[][]
const dataGrid: DataGrid = []

for (let x = minimumX -1; x<=maximumX +1; x++) {
    for (let y = minimumY -1; y<=maximumY +1; y++) {
        if (!dataGrid[y]) {
            dataGrid[y] = [];
        }
        dataGrid[y][x] = '.'
    }
}

// console.log(dataGrid)

parsedData.forEach((row) => {
    row.forEach((coordinates, index) => {
        dataGrid[coordinates.distanceFromTop][coordinates.distanceFromLeft] = '#';
        if (index === 0) {
            return;
        }

        const previousCoordinates = row[index - 1];
        const sameX = previousCoordinates.distanceFromLeft === coordinates.distanceFromLeft;
        const sameY = previousCoordinates.distanceFromTop === coordinates.distanceFromTop;

        if (sameX) {
            const min = Math.min(previousCoordinates.distanceFromTop, coordinates.distanceFromTop)
            const max = Math.max(previousCoordinates.distanceFromTop, coordinates.distanceFromTop)

            for (let y = min; y<max; y++){
                dataGrid[y][coordinates.distanceFromLeft] = '#';
            }
        }
        if (sameY) {
            const min = Math.min(previousCoordinates.distanceFromLeft, coordinates.distanceFromLeft)
            const max = Math.max(previousCoordinates.distanceFromLeft, coordinates.distanceFromLeft)

            for (let x = min; x<max; x++){
                dataGrid[coordinates.distanceFromTop][x] = '#';
            }
        }
    })
})

let keepRunningSimulation = true;
let numberOfSettledSand = 0;

const simulateSandFalling = (data: DataGrid) => {
    const sandPosition = {...sandEntryCoordinate};
    let isMoving = true;
    while (isMoving && keepRunningSimulation) {
        if (data[sandPosition.distanceFromTop + 1][sandPosition.distanceFromLeft] === '.') {
            sandPosition.distanceFromTop += 1
            console.log(sandPosition.distanceFromTop)
            if (sandPosition.distanceFromTop >= maximumY) {
                keepRunningSimulation = false;
            }
            continue;
        }
        if (data[sandPosition.distanceFromTop + 1][sandPosition.distanceFromLeft -1] === '.') {
            sandPosition.distanceFromTop += 1;
            sandPosition.distanceFromLeft -= 1;
            continue;
        }
        if (data[sandPosition.distanceFromTop + 1][sandPosition.distanceFromLeft +1] === '.') {
            sandPosition.distanceFromTop += 1;
            sandPosition.distanceFromLeft += 1;
            continue;
        }
        // no spaces to move to
        data[sandPosition.distanceFromTop][sandPosition.distanceFromLeft] = 'o';
        numberOfSettledSand++;
        isMoving = false;
    }
}

while(keepRunningSimulation) {
    simulateSandFalling(dataGrid);
}

console.log(dataGrid.map(row => row.join('')).join('\n'))
console.log(numberOfSettledSand)
