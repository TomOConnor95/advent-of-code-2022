const text = await Deno.readTextFile('src/day16Data.txt');
// const text = await Deno.readTextFile('src/day16TestInput.txt');

function isNotNull<T>(value: null| T): value is T {
    return value !== null;
}

const rows = text.split('\n').map(row => {
    const match = row.match(/Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? (.+)/);
    if (match === null) {
        return null;
    }
    const [_, valveName, flowRate, connectedValves] = match;
    return {
        valveName,
        flowRate: parseInt(flowRate),
        connectedValves: connectedValves.split(', '),
    }
}).filter(isNotNull);

type Valve = {flowRate: number, connectedValves: string[]};
const valves = rows.reduce<Record<string, Valve>>((acc, curr) => {
    const {valveName, ...others} = curr;
    return {
        ...acc,
        [valveName]: {
            ...others
        }
    }
}, {})

console.log(valves)

const getDistancesFromNode = (valves: Record<string, Valve>, node: string) => {
    const distances = Object.keys(valves).reduce<Record<string, {distance: number, toVisit: boolean}>>((acc, curr) => {
        if (curr === node) {
            return {...acc, [curr]: {distance: 0, toVisit: true}}
        }
        return {...acc, [curr]: {distance: Infinity, toVisit: false}}
    }, {})
    let numberToVisit = 1;

    while (numberToVisit > 0) {
        Object.keys(valves).forEach(key => {
            if (distances[key].toVisit) {
                valves[key].connectedValves.forEach(node => {
                    if (
                        distances[node].distance > distances[key].distance + 1
                    ) {
                        distances[node].distance = distances[key].distance + 1;
                        distances[node].toVisit = true;
                    }
                });
                distances[key].toVisit = false;
            }
            
        })
        numberToVisit = Object.keys(valves).reduce((acc, key) => {
            if (distances[key].toVisit) {
                return acc + 1;
            }
            return acc;
        }, 0);
    }
    return distances;
}

const distancesCache: Record<string, Record<string, {
    distance: number;
    toVisit: boolean;
}>> = Object.keys(valves).reduce((acc, curr) => {
    return {...acc, [curr]: getDistancesFromNode(valves, curr)}
}, {});


type ScoreObject = {value: number, remainingTime: number};


const timeToOpenValve = 1;
const getPotentialValuesPerNode = (valves: Record<string, Valve>, key: string, remainingTime: number, initialValue: number) => {
    const node = key.slice(-2);
    const distances = distancesCache[node];

    const potentialValues = Object.keys(valves).reduce<Record<string, ScoreObject>>((acc, curr) => {
        if (valves[curr].flowRate === 0) {
            // console.log('flowRate 0')
            // return {...acc, [curr]: 0}
            return {...acc}
        }
        if (remainingTime - (distances[curr].distance + timeToOpenValve + 1) <= 0) {
            // console.log('not enough time')
            return {...acc}
        }
        return {...acc, [`${key}:${curr}`]: {
            value: initialValue + (remainingTime - (distances[curr].distance + timeToOpenValve)) * valves[curr].flowRate,
            remainingTime: remainingTime - (distances[curr].distance + timeToOpenValve )
        }}
    }, {})
    return potentialValues
};

const potentialValuesOverTime: (Record<string, ScoreObject>)[] = [];

const potentialValues = getPotentialValuesPerNode(valves, 'AA', 30, 0);
console.log(potentialValues)
console.log('---')
potentialValuesOverTime.push(potentialValues)

// This gets pretty slow, but is good enough for now :D
const getNewPotentialValues = (previousValues: Record<string, ScoreObject>) => {
    return Object.keys(previousValues).reduce<Record<string, ScoreObject>>((acc, key) => {
        const valvesAfterSwitchOff = structuredClone(valves);
        const keys = key.split(':');
        keys.forEach(prevKey => {
            valvesAfterSwitchOff[prevKey].flowRate = 0;
        });
        const newPotentialValues = getPotentialValuesPerNode(valvesAfterSwitchOff, key, previousValues[key].remainingTime, previousValues[key].value);

        return {...acc, ...newPotentialValues}
    }, {})
}

/*
const newValues = getNewPotentialValues(potentialValuesOverTime[potentialValuesOverTime.length-1]);
    if (Object.keys(newValues).length === 0) {
        console.log('FINISHING');
    }
    potentialValuesOverTime.push(newValues);
*/
//*
while (true) {
    const newValues = getNewPotentialValues(potentialValuesOverTime[potentialValuesOverTime.length-1]);
    if (Object.keys(newValues).length === 0) {
        console.log('FINISHING');
        break;
    }
    console.log(newValues)
    potentialValuesOverTime.push(newValues);
}
// */

const highestValues = potentialValuesOverTime.map(value => Object.values(value).reduce((acc, curr) => {
    if (
        curr.value > acc
    ) {
        return curr.value;
    }
    return acc;
}, 0))
highestValues.sort()
console.log(highestValues[highestValues.length - 1]);
