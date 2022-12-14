const text = await Deno.readTextFile('src/day12Data.txt');
// const text = await Deno.readTextFile('src/day12TestInput.txt');
const rows = text.split('\n');

const getScoreForLetter = (letter: string) => {
    const lowerCaseLetter = letter.toLowerCase();
    const capitalScore = letter === lowerCaseLetter ? 0 : 26;
    return capitalScore + lowerCaseLetter.charCodeAt(0) - 97 + 1;
  };

type MapItem = {
    height: number,
    modifiedInPreviousRound: boolean,
    minimumPathlength: number
}

let targetX = -1;
let targetY = -1;

const mapData = rows.map((row, rowIndex) => {
    return row.split('').map((letter, letterIndex) => {
        const dataItem: MapItem = {
            height: getScoreForLetter(letter),
            modifiedInPreviousRound: false,
            minimumPathlength: Infinity
        }

        if (letter === 'S') {
            dataItem.height = getScoreForLetter('a');
            dataItem.modifiedInPreviousRound = false;
            targetX = letterIndex
            targetY = rowIndex
        }
        if (letter === 'E') {
            dataItem.height = getScoreForLetter('z');
            dataItem.modifiedInPreviousRound = true;
            dataItem.minimumPathlength = 0;

        }

        return dataItem
    })
})

let thingsChangedInPreviousRound = true


const updateMapItem = (mapItem: MapItem, comparisonItem: MapItem) => {
    // console.log('updateMapItem', mapItem, comparisonItem)
    if (
        (mapItem.height >= comparisonItem.height - 1) &&
        (mapItem.minimumPathlength > comparisonItem.minimumPathlength + 1)) {
        console.log('changingVAlue to', comparisonItem.minimumPathlength + 1);

        thingsChangedInPreviousRound = true;
        mapItem.modifiedInPreviousRound=true;
        mapItem.minimumPathlength = comparisonItem.minimumPathlength + 1;
    }
}

while (thingsChangedInPreviousRound) {
    thingsChangedInPreviousRound = false;
    mapData.forEach((row, rowIndex) => {
        row.forEach((xItem, columnIndex) => {
            if (xItem.modifiedInPreviousRound) {

                if (rowIndex > 0) {
                    const aboveData = mapData[rowIndex -1][columnIndex]
                    updateMapItem(aboveData, xItem);
                }
                if (rowIndex < mapData.length - 1) {
                    const belowData = mapData[rowIndex +1][columnIndex]
                    updateMapItem(belowData, xItem);
                }
                if (columnIndex > 0) {
                    const leftData = mapData[rowIndex][columnIndex - 1]
                    updateMapItem(leftData, xItem);
                }
                if (columnIndex < mapData[0].length - 1) {
                    const rightData = mapData[rowIndex][columnIndex + 1]
                    updateMapItem(rightData, xItem);
                }

            }
        })

    })
    // console.log(mapData.map(row => row.map(item=> item.minimumPathlength).join(',')).join('\n'))
}


// console.log(mapData.map(row => row.map(item=> item.minimumPathlength).join(',')).join('\n'))

// console.log(mapData[targetY][targetX])

let smallestPathLengthToStartingPoint = Infinity;

mapData.forEach(row=> row.forEach(item => {
    if ((item.height === 1 )&& (item.minimumPathlength < smallestPathLengthToStartingPoint)) {
        smallestPathLengthToStartingPoint = item.minimumPathlength
    }
}))


console.log(smallestPathLengthToStartingPoint)