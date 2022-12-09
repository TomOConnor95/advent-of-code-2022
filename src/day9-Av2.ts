const text = await Deno.readTextFile('src/day9Data.txt');
// const text = await Deno.readTextFile('src/day9TestInput.txt');
const rawData = text.split('\n');


type Coordinate = [number, number]
const startCoordinates: Coordinate = [0, 0]; // x,y

const headCoordinates: Coordinate = [...startCoordinates]
const tailCoordinates: Coordinate = [...startCoordinates]

// Will add items off tailCoordinates.join(',') to this set,
//then get the size of the set at the end
const TailVisitedPositions = new Set([tailCoordinates.join(',')]);
type Direction = 'R'| 'L' | 'U' | 'D'
const moveHead = (direction: Direction, headCoordinates: Coordinate) => {
    if (direction === 'R') {
        headCoordinates[0] += 1;
    }
    if (direction === 'L') {
        headCoordinates[0] -= 1;
    }
    if (direction === 'U') {
        headCoordinates[1] += 1;
    }
    if (direction === 'D') {
        headCoordinates[1] -= 1;
    }
    console.log('head moved', direction, headCoordinates)
}


const moveNextKnotPosition = (nextKnotInChainPosition: Coordinate, currentPosition: Coordinate) => {
    // This mutates currentPosition!
    const sameX = nextKnotInChainPosition[0] === currentPosition[0];
    const sameY = nextKnotInChainPosition[1] === currentPosition[1];
    const xDistance = nextKnotInChainPosition[0] - currentPosition[0];
    const yDistance = nextKnotInChainPosition[1] - currentPosition[1];
    console.log({xDistance, yDistance})
    console.log('abs', Math.abs(xDistance), Math.abs(yDistance))
    if (Math.abs(xDistance) > 2) {
        throw new Error('xDistance should never be greater than 2!')
    }
    if (Math.abs(yDistance) > 2) {
        throw new Error('yDistance should never be greater than 2!')
    }

    if (sameY) {
        if (sameX) {
            // Head and tail are in the same position, so do nothing
            return;
        }
        if (Math.abs(xDistance) === 1) {
            // head and tail are one unit apart, so no need to move
            console.log('xdistance is one should return')
            return;
        }

        if (xDistance > 0) {
            // Head is to the right of tail so move tail to the right by one
            currentPosition[0] +=1;
        } else {
            currentPosition[0] -=1;
        }
        console.log('tail moved',  currentPosition)
        return;
    }

    if (sameX) {
        if (sameY) {
            // Head and tail are in the same position, so do nothing
            return;
        }
        if (Math.abs(yDistance) === 1) {
            console.log('ydistance is one should return')

            // head and tail are one unit apart, so no need to move
            return;
        }
        if (yDistance > 0) {
            // Head is to the right of tail so move tail to the right by one
            currentPosition[1] +=1;
        } else {
            currentPosition[1] -=1;
        }
        console.log('tail moved',  currentPosition)
        return;
    }

    if (Math.abs(xDistance) === 1 && Math.abs(yDistance) === 1) {
        // head and tail are one diagonal unit apart, so no need to move
        return;
    }

    if (Math.abs(xDistance) === 2 && Math.abs(yDistance) === 1) {
        currentPosition[1] = nextKnotInChainPosition[1];
        currentPosition[0] += xDistance/2
    } 
    if (Math.abs(xDistance) === 1 && Math.abs(yDistance) === 2) {
        currentPosition[0] = nextKnotInChainPosition[0];
        currentPosition[1] += yDistance/2
    } 
    console.log('tail moved', currentPosition)

    return ;
}

rawData.forEach(row => {
    console.log('Instruction', row)
    const [direction, distanceString] = row.split(' ');
    const distance = parseInt(distanceString);

    [...Array(distance)].map(() => 0).forEach(() => {
        moveHead(direction as Direction, headCoordinates);

        moveNextKnotPosition(headCoordinates, tailCoordinates)
        TailVisitedPositions.add(tailCoordinates.join(','));

    })
});

// console.log(TailVisitedPositions)
console.log(TailVisitedPositions.size)