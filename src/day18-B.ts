const text = await Deno.readTextFile('src/day18Data.txt');
// const text = await Deno.readTextFile('src/day18TestInput.txt');


const coordinates = text.split('\n').map(row => {
    return row.split(',').map(stringNum => parseInt(stringNum));
});

const coordinateSet = new Set(coordinates.map((curr) => (
    curr.join(':')
), {}))

 
const {minX, maxX, minY, maxY, minZ, maxZ} = coordinates.reduce((acc, curr) => {
    return {
        minX: Math.min(curr[0], acc.minX),
        maxX: Math.max(curr[0], acc.maxX),
        minY: Math.min(curr[1], acc.minY),
        maxY: Math.max(curr[1], acc.maxY),
        minZ: Math.min(curr[2], acc.minZ),
        maxZ: Math.max(curr[2], acc.maxZ),
    }
}, {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity,
    minZ: Infinity,
    maxZ: -Infinity
})

// console.log({minX, maxX, minY, maxY, minZ, maxZ});

// other ideas:
// - chop the shape into slices in one direction (doesn't matter which)
//  - a inner hole in a 2d slice will also be an inner hole in the 3d shape
//  - fill in the inner hole, or exclude it some other way.
//  - performance is fine for filling in the hole
// - fill in the empty space from the outside. Can limit is to min/max/xyz +- 1
//  - Can do a marching squares kind of thing to find all the space
//  - Now calculate the surface area of this shape, minus the outer border

const outsideCoordinates = [[minX -1 ,minY, minZ]];
const outsideCoordinatesKeys = new Set([[minX -1 ,minY, minZ].join(':')]);
const outsideCoordinatesToCheck = [[minX -1 ,minY, minZ]];
let filling = true;
while (filling) {
    const coordinateToCheck = outsideCoordinatesToCheck.pop();
    // console.log(coordinateToCheck);
    if (!coordinateToCheck) {
        break;
    }

    const aboveXNeighbor = [coordinateToCheck[0] + 1, coordinateToCheck[1], coordinateToCheck[2]];
    const belowXNeighbor = [coordinateToCheck[0] - 1, coordinateToCheck[1], coordinateToCheck[2]];
    const aboveYNeighbor = [coordinateToCheck[0], coordinateToCheck[1] + 1, coordinateToCheck[2]];
    const belowYNeighbor = [coordinateToCheck[0], coordinateToCheck[1] - 1, coordinateToCheck[2]];
    const aboveZNeighbor = [coordinateToCheck[0], coordinateToCheck[1], coordinateToCheck[2] + 1];
    const belowZNeighbor = [coordinateToCheck[0], coordinateToCheck[1], coordinateToCheck[2] - 1];

    [
        aboveXNeighbor,
        belowXNeighbor,
        aboveYNeighbor,
        belowYNeighbor,
        aboveZNeighbor,
        belowZNeighbor,
    ].forEach(neighbor => {
        // console.log({neighbor});
        // Adding 2 cells around the outer boundary to ensure that the outer cells
        // are definitely not touching the surface
        if (
            (neighbor[0] < minX - 2) ||
            (neighbor[0] > maxX + 2) ||
            (neighbor[1] < minY - 2) ||
            (neighbor[1] > maxY + 2) ||
            (neighbor[2] < minZ - 2) ||
            (neighbor[2] > maxZ + 2)
        ) {
            // console.log('out of bounds')
            return;
        }
        const neighborKey = neighbor.join(':')
        if (coordinateSet.has(neighborKey)) {
            // console.log('In rock')
            return;
        }
        if (outsideCoordinatesKeys.has(neighborKey)) {
            // console.log('already outside')
            return;
        }
        // console.log('pushing')
        outsideCoordinates.push(neighbor);
        outsideCoordinatesToCheck.push(neighbor);
        outsideCoordinatesKeys.add(neighborKey);
    })

    if (outsideCoordinatesToCheck.length === 0) {
        filling = false;
    }
}
const totalCellsInSearchSpace = (5 + maxX - minX ) * (5 + maxY -minY) * (5 + maxZ -minZ);
console.log('-----------------')
console.log('NUMBER OF INTERNAL CELLS', totalCellsInSearchSpace - outsideCoordinates.length - coordinates.length);
console.log('-----------------')

const neighbourLog: Record<string, number[]> = {}

outsideCoordinates.forEach((coordinate, index) => {
    const aboveXNeighbor = [coordinate[0] + 1, coordinate[1], coordinate[2]];
    const belowXNeighbor = [coordinate[0] - 1, coordinate[1], coordinate[2]];
    const aboveYNeighbor = [coordinate[0], coordinate[1] + 1, coordinate[2]];
    const belowYNeighbor = [coordinate[0], coordinate[1] - 1, coordinate[2]];
    const aboveZNeighbor = [coordinate[0], coordinate[1], coordinate[2] + 1];
    const belowZNeighbor = [coordinate[0], coordinate[1], coordinate[2] - 1];

    [
        aboveXNeighbor,
        belowXNeighbor,
        aboveYNeighbor,
        belowYNeighbor,
        aboveZNeighbor,
        belowZNeighbor,
    ].forEach(neighbor => {
        const neighborKey = neighbor.join(':')
        if (typeof neighbourLog[neighborKey] === 'undefined') {
            neighbourLog[neighborKey] = []
        }
        neighbourLog[neighborKey].push(index);
    })
})

// console.log({neighbourLog})


const numberOfExposedSides = outsideCoordinates.reduce((acc, item) => {
    if (
        (item[0] < minX - 1) ||
        (item[0] > maxX + 1) ||
        (item[1] < minY - 1) ||
        (item[1] > maxY + 1) ||
        (item[2] < minZ - 1) ||
        (item[2] > maxZ + 1)
    ) {
        // Exclude the outer most cells, as these willl only be touching the outer edge,
        // and we don't want to count the outer edge
        // console.log('out of bounds')
        return acc;
    }
    const key = item.join(':');
    // console.log('inbounds key', key);

    const numberOfExposedSides = (6 - (neighbourLog[key] ?? []).length);
    return acc + numberOfExposedSides;
}, 0)
console.log('-----------------');
console.log({numberOfExposedSides})
console.log('-----------------');

