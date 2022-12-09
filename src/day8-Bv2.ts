const text = await Deno.readTextFile('src/day8Data.txt');
// const text = await Deno.readTextFile('src/day8TestInput.txt');
const rawData = text.split('\n');

const numberRows = rawData.map(row => row.split('').map(letter => parseInt(letter)))

console.time("day8time2");

const calculateViewingDistanceToLeft = (rows: number[][]) => rows.map((row) => row.reduce<number[]>((acc, curr, innerIndex) => {
    if (innerIndex === 0) {
        return [0];
    }
    const prevValue = row[innerIndex -1];
    if (curr <= prevValue) {
        return [...acc, 1]
    }
    const tallerTreeToLeftIndex = row.findLastIndex((value, searchIndex) => (searchIndex < innerIndex) && value >= curr);
    // console.log({tallerTreeToLeftIndex, row, curr, innerIndex})
    if (tallerTreeToLeftIndex <0) {
        return [...acc, innerIndex]
    }
    return [...acc, innerIndex - tallerTreeToLeftIndex]
}, []))

const viewingDistanceToLeft = calculateViewingDistanceToLeft(numberRows);
const viewingDistanceToRight = [...calculateViewingDistanceToLeft(numberRows.map(row => [...row].reverse()))].map(row => row.reverse());

const flipXandY = (input: number[][]) => {
    return input[0].map((_, columnIndex) => input.map(row => row[columnIndex]));
}
const viewingDistanceToTop = flipXandY(calculateViewingDistanceToLeft(flipXandY(numberRows)));
const viewingDistanceToBottom = flipXandY([...calculateViewingDistanceToLeft(flipXandY(numberRows).map(row => [...row].reverse()))].map(row => row.reverse()));

// console.log(viewingDistanceToLeft)
// console.log(viewingDistanceToRight)
// console.log(viewingDistanceToTop)
// console.log(viewingDistanceToBottom)

let highestScenicScore = 0;

const scenicScores = numberRows.map((row, rowIndex) => row.map((_, columnIndex) => {
    const scenicScore = viewingDistanceToLeft[rowIndex][columnIndex] * 
                         viewingDistanceToRight[rowIndex][columnIndex] *
                         viewingDistanceToTop[rowIndex][columnIndex] *
                         viewingDistanceToBottom[rowIndex][columnIndex];
    if (
        scenicScore > highestScenicScore
    ) {
        highestScenicScore = scenicScore;
    }
    return(scenicScore)
}))
// console.log(scenicScores)
console.log(highestScenicScore)
console.timeEnd("day8time2");
