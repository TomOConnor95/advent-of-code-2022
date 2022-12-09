const text = await Deno.readTextFile('src/day8Data.txt');
// const text = await Deno.readTextFile('src/day8TestInput.txt');
const rawData = text.split('\n');

const numberRows = rawData.map(row => row.split('').map(letter => parseInt(letter)))

const biggestValueToLeft = numberRows.map((row) => row.reduce<number[]>((acc, curr, innerIndex) => {
    if (innerIndex === 0) {
        return [0];
    }
    const prevValue = row[innerIndex -1];
    if (prevValue > acc[innerIndex-1]) {
        return [...acc, prevValue]
    }
    return [...acc, acc[innerIndex-1]]
}, []))
const biggestValueToRight = numberRows.map((row) => row.reduceRight<number[]>((acc, curr, innerIndex) => {
    if (innerIndex === row.length - 1) {
        return [0];
    }
    const prevValue = row[innerIndex +1 ];
    if (prevValue > acc[0]) {
        return [prevValue, ...acc]
    }
    return [acc[0], ...acc]
}, []))

// need to iterate vertically so reduce then map
const biggestValueToTop = numberRows.reduce<number[][]>((acc, curr, outerIndex) => {
    if (outerIndex === 0) {
        return [curr.map(() => 0)];
    }
    const previousRow = numberRows[outerIndex -1];
    const rowValues = previousRow.map((height, index) => {
        if (height > acc[outerIndex - 1][index]) {
            return height
        }
        return acc[outerIndex - 1][index]
    })
    return [...acc, rowValues]

}, [])

const biggestValueToBottom = numberRows.reduceRight<number[][]>((acc, curr, outerIndex) => {
    if (outerIndex === numberRows.length - 1) {
        return [curr.map(() => 0)];
    }
    const previousRow = numberRows[outerIndex +1];

    const rowValues = previousRow.map((height, index) => {
        if (height > acc[0][index]) {
            return height
        }
        return acc[0][index]
    })
    return [rowValues, ...acc]

}, [])
console.log(biggestValueToLeft)
console.log(biggestValueToRight)
console.log(biggestValueToTop)
console.log(biggestValueToBottom)


let numberOfVisibleTrees = 0;

numberRows.forEach((row, rowIndex) => row.forEach((column, columnIndex) => {
    if ((rowIndex === 0) ||
        (rowIndex === numberRows.length -1 ) ||
        (columnIndex === 0) ||
        (columnIndex === row.length -1 )
    ) {
        console.log('Edge always Visibile!');
        numberOfVisibleTrees++;
        return;

    }
    // console.log(column,
    //     biggestValueToLeft[rowIndex][columnIndex],
    //     biggestValueToRight[rowIndex][columnIndex],
    //     biggestValueToTop[rowIndex][columnIndex],
    //     biggestValueToBottom[rowIndex][columnIndex]
    // )
    if (
        column > biggestValueToLeft[rowIndex][columnIndex] ||
        column > biggestValueToRight[rowIndex][columnIndex] ||
        column > biggestValueToTop[rowIndex][columnIndex] ||
        column > biggestValueToBottom[rowIndex][columnIndex]
    ) {
        console.log('Visibile!');
        
        numberOfVisibleTrees++
    }
}))
console.log(numberOfVisibleTrees)