// const text = await Deno.readTextFile('src/day18Data.txt');
const text = await Deno.readTextFile('src/day18TestInput.txt');

const coordinates = text.split('\n').map(row => {
    return row.split(',').map(stringNum => parseInt(stringNum));
});

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

console.log(neighbourLog)


const numberOfExposedSides = coordinates.reduce((acc, item) => {
    const key = item.join(':');

    const numberOfExposedSides = (6 - (neighbourLog[key] ?? []).length);
    return acc + numberOfExposedSides;
}, 0)
console.log(numberOfExposedSides)