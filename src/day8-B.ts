const text = await Deno.readTextFile('src/day8Data.txt');
// const text = await Deno.readTextFile('src/day8TestInput.txt');
const rawData = text.split('\n');

const numberRows = rawData.map(row => row.split('').map(letter => parseInt(letter)))

console.time("day8time");

const viewingDistanceToLeft = numberRows.map((row) => row.reduce<number[]>((acc, curr, innerIndex) => {
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

const viewingDistanceToRight = numberRows.map((row) => row.reduceRight<number[]>((acc, curr, innerIndex) => {
    if (innerIndex === row.length - 1) {
        return [0];
    }
    const prevValue = row[innerIndex + 1];

    if (curr <= prevValue) {
        return [1, ...acc]
    }

    const tallerTreeToRightIndex = row.findIndex((value, searchIndex) => (searchIndex > innerIndex) && value >= curr);
    if (tallerTreeToRightIndex <0) {
        return [(row.length - 1) - innerIndex, ...acc]
    }
    return [tallerTreeToRightIndex - innerIndex, ...acc]
}, []))

// need to iterate vertically so reduce then map
const viewingDistanceToTop = numberRows.reduce<number[][]>((acc, currentRow, outerIndex) => {
    if (outerIndex === 0) {
        return [currentRow.map(() => 0)];
    }
    const previousRow = numberRows[outerIndex -1];

    const rowValues = currentRow.map((height, innerIndex) => {
        if (height <= previousRow[innerIndex]) {
            return 1;
        }

        const tallerTreeToTopIndex = numberRows.findLastIndex(
            (searchRow, searchIndex) => (searchIndex < outerIndex) && searchRow[innerIndex] >= height
        );
        if (tallerTreeToTopIndex <0) {
            return outerIndex;
        }
        return outerIndex - tallerTreeToTopIndex
    })
    return [...acc, rowValues]

}, [])

const viewingDistanceToBottom = numberRows.reduceRight<number[][]>((acc, currentRow, outerIndex) => {
    if (outerIndex === numberRows.length - 1) {
        return [currentRow.map(() => 0)];
    }
    const previousRow = numberRows[outerIndex +1];

    const rowValues = currentRow.map((height, innerIndex) => {
        if (height <= previousRow[innerIndex]) {
            return 1;
        }
        const tallerTreeToBottomIndex = numberRows.findIndex(
            (searchRow, searchIndex) => (searchIndex > outerIndex) && searchRow[innerIndex] >= height
        );
        if (tallerTreeToBottomIndex <0) {
            return (numberRows.length - 1) - outerIndex;
        }
        return tallerTreeToBottomIndex - outerIndex
    })
    return [rowValues, ...acc]
}, [])
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

console.timeEnd("day8time");
