const text = await Deno.readTextFile('src/day18Data.txt');
// const text = await Deno.readTextFile('src/day18TestInput.txt');


const coordinates = text.split('\n').map(row => {
    return row.split(',').map(stringNum => parseInt(stringNum));
});
console.log(coordinates);

const coordinateSet = new Set(coordinates.map((curr) => (
    curr.join(':')
), {}))

 
let {minX, maxX, minY, maxY, minZ, maxZ} = coordinates.reduce((acc, curr) => {
    return {
        minX: Math.min(curr[0], acc.minX),
        maxX: Math.max(curr[0], acc.maxX),
        minY: Math.min(curr[0], acc.minY),
        maxY: Math.max(curr[0], acc.maxY),
        minZ: Math.min(curr[0], acc.minZ),
        maxZ: Math.max(curr[0], acc.maxZ),
    }
}, {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity,
    minZ: Infinity,
    maxZ: -Infinity
})

console.log({minX, maxX, minY, maxY, minZ, maxZ});


const minZforXY: Record<string, number> = {};
const minXforYZ: Record<string, number> = {};
const minYforXZ: Record<string, number> = {};
const maxZforXY: Record<string, number> = {};
const maxXforYZ: Record<string, number> = {};
const maxYforXZ: Record<string, number> = {};

coordinates.forEach((coordinate) => {
    const XYkey = [coordinate[0], coordinate[1]].join(':');
    const YZkey = [coordinate[1], coordinate[2]].join(':');
    const XZkey = [coordinate[0], coordinate[2]].join(':');
    

    minZforXY[XYkey] = Math.min(minZforXY[XYkey] ?? Infinity, coordinate[2]);
    maxZforXY[XYkey] = Math.max(maxZforXY[XYkey] ?? -Infinity, coordinate[2]);

    minXforYZ[YZkey] = Math.min(minXforYZ[YZkey] ?? Infinity, coordinate[0]);
    maxXforYZ[YZkey] = Math.max(maxXforYZ[YZkey] ?? -Infinity, coordinate[0]);

    minYforXZ[XZkey] = Math.min(minYforXZ[XZkey] ?? Infinity, coordinate[1]);
    maxYforXZ[XZkey] = Math.max(maxYforXZ[XZkey] ?? -Infinity, coordinate[1]);
})

console.log({
    minZforXY,
    minXforYZ,
    minYforXZ,
    maxZforXY,
    maxXforYZ,
    maxYforXZ
})

console.log('beofreFeill', coordinates.length)
// fill in the middle of the shape
// This works for the test data, but isn't good eough for the real data
// as the real data seems to be too convex

Object.keys(minXforYZ).forEach(key => {
    const [y,z] = key.split(':').map(item => parseInt(item));
    if (maxXforYZ[key] - minXforYZ[key] > 2) {
        for (let x=minXforYZ[key] +1; x<maxXforYZ[key]; x++ ) {
            const coordinateKey = [x,y,z].join(':');
            if (!coordinateSet.has(coordinateKey)){
                if (
                    (maxYforXZ[[x,z].join(':')] < y) || 
                    (minYforXZ[[x,z].join(':')] > y) || 
                    (maxZforXY[[x,y].join(':')] < z) || 
                    (minZforXY[[x,y].join(':')] > z)
                    ){
                    return;
                }
                coordinates.push([x,y,z]);
                coordinateSet.add(coordinateKey)
            }
        }
    }
})
Object.keys(minYforXZ).forEach(key => {
    const [x,z] = key.split(':').map(item => parseInt(item));
    if (maxYforXZ[key] - minYforXZ[key] > 2) {
        for (let y=minYforXZ[key] +1; y<maxYforXZ[key]; y++ ) {
            const coordinateKey = [x,y,z].join(':');
            if (!coordinateSet.has(coordinateKey)){
                if (
                    (maxXforYZ[[y,z].join(':')] < x) || 
                    (minXforYZ[[y,z].join(':')] >x) || 
                    (maxZforXY[[x,y].join(':')] < z) || 
                    (minZforXY[[x,y].join(':')] > z)
                    ){
                    return;
                }
                coordinates.push([x,y,z]);
                coordinateSet.add(coordinateKey)
            }
        }
    }
})

Object.keys(minZforXY).forEach(key => {
    const [x,y] = key.split(':').map(item => parseInt(item));
    if (maxZforXY[key] - minZforXY[key] > 2) {
        for (let z=minZforXY[key] +1; z<maxZforXY[key]; z++ ) {
            const coordinateKey = [x,y,z].join(':');
            if (!coordinateSet.has(coordinateKey)){
                if (
                    (maxXforYZ[[y,z].join(':')] < x) || 
                    (minXforYZ[[y,z].join(':')] > x) || 
                    (maxYforXZ[[x,z].join(':')] < y) || 
                    (minYforXZ[[x,z].join(':')] > y)
                    ){
                    return;
                }
                coordinates.push([x,y,z]);
                coordinateSet.add(coordinateKey)
            }
        }
    }
})

console.log('afterFeill', coordinates.length)


const neighbourLog: Record<string, number[]> = {}

coordinates.forEach((coordinate, index) => {
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

const numberOfExposedSides = coordinates.reduce((acc, item) => {
    const key = item.join(':');


    const numberOfExposedSides = (6 - (neighbourLog[key] ?? []).length);
    return acc + numberOfExposedSides;
}, 0)
console.log(numberOfExposedSides)

