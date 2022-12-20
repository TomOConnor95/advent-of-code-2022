// const text = await Deno.readTextFile('src/day19Data.txt');
const text = await Deno.readTextFile('src/day19TestInput.txt');

function isNotNull<T>(value: null| T): value is T {
    return value !== null;
}

const blueprints = text.split('\n').map(row => {
    console.log(row)
    const match = row.match(/Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian/);
    if (match === null) {
        return null;
    }
    const [_,
        blueprintNumber,
        oreRobotOreCost,
        clayRobotOreCost,
        obsidianRobotOreCost,
        obsidianRobotClayCost,
        geodeRobotOreCost,
        geodeRobotObsidianCost
    ] = match;
    return {
        blueprintNumber: parseInt(blueprintNumber),
        oreRobotOreCost: parseInt(oreRobotOreCost),
        clayRobotOreCost: parseInt(clayRobotOreCost),
        obsidianRobotOreCost: parseInt(obsidianRobotOreCost),
        obsidianRobotClayCost: parseInt(obsidianRobotClayCost),
        geodeRobotOreCost: parseInt(geodeRobotOreCost),
        geodeRobotObsidianCost: parseInt(geodeRobotObsidianCost),
    }
}).filter(isNotNull);

// console.log(blueprints)

const maxAllowedTime = 24; 

type StateItem = {
    ore: number,
    oreRobots: number,
    clay: number,
    clayRobots: number,
    obsidian: number,
    obsidianRobots: number,
    geode: number,
    geodeRobots: number,
    minute: number,
}
const geodesCollected: number[] = []
blueprints.forEach(blueprint => {

    console.log('--------------------')
    console.log({blueprint})
    console.log('--------------------')
    const {
        blueprintNumber,
        oreRobotOreCost,
        clayRobotOreCost,
        obsidianRobotOreCost,
        obsidianRobotClayCost,
        geodeRobotOreCost,
        geodeRobotObsidianCost,
    } = blueprint

    const state: StateItem[] = [{
        ore: 0,
        oreRobots: 1,
        clay: 0,
        clayRobots: 0,
        obsidian: 0,
        obsidianRobots: 0,
        geode: 0,
        geodeRobots: 0,
        minute: 0,
    }]

    while (state.length <= maxAllowedTime) {
        // console.log('------------');
        // console.log('round number', state.length)
        // console.log('------------');
        const previousState = state[state.length -1];
        const currentState: StateItem = structuredClone(previousState);
        currentState.minute += 1;

        const minedResourcesThisTurn = {
            ore: 0,
            clay: 0,
            obsidian: 0,
            geode: 0
        }
        for (let oreRobot = 1; oreRobot <= currentState.oreRobots; oreRobot++) {
            minedResourcesThisTurn.ore++
        }
        for (let clayRobot = 1; clayRobot <= currentState.clayRobots; clayRobot++) {
            minedResourcesThisTurn.clay++
        }
        for (let obsidianRobot = 1; obsidianRobot <= currentState.obsidianRobots; obsidianRobot++) {
            minedResourcesThisTurn.obsidian++
        }
        for (let geodeRobot = 1; geodeRobot <= currentState.geodeRobots; geodeRobot++) {
            minedResourcesThisTurn.geode++
        }


        if (
            (currentState.obsidian >= geodeRobotObsidianCost) &&
            (currentState.ore >= geodeRobotOreCost)
        ) {
            currentState.obsidian -= geodeRobotObsidianCost;
            currentState.ore -= geodeRobotOreCost;
            console.log('buying geode robot', state.length);
            currentState.geodeRobots += 1;
        }
        if (
            (
                !(currentState.obsidian >= geodeRobotObsidianCost && currentState.ore < geodeRobotOreCost)
            ) &&
            (
                currentState.obsidianRobots < 2
            ) &&
            (currentState.clay >= obsidianRobotClayCost) &&
            (currentState.ore >= obsidianRobotOreCost)
        ) {
            console.log('buying obsidian robot', state.length);
            currentState.clay -= obsidianRobotClayCost;
            currentState.ore -= obsidianRobotOreCost;
            currentState.obsidianRobots += 1;
        }

        if (
            (
                !(currentState.clay >= obsidianRobotClayCost && currentState.ore < obsidianRobotOreCost)
            ) &&
            (
                currentState.clayRobots < 4
            ) &&
            (currentState.ore >= clayRobotOreCost)
        ) {
            console.log('buying clay robot', state.length);
            currentState.ore -= clayRobotOreCost;
            currentState.clayRobots += 1;
        }

        // if (
        //     (oreRobotOreCost >= clayRobotOreCost)&&
        //     (currentState.ore >= oreRobotOreCost)
        // ) {
        //     currentState.ore -= oreRobotOreCost;
        //     console.log('buying ore robot', state.length);

        //     currentState.oreRobots += 1;
        // }

        currentState.ore += minedResourcesThisTurn.ore;
        currentState.clay += minedResourcesThisTurn.clay;
        currentState.obsidian += minedResourcesThisTurn.obsidian;
        currentState.geode += minedResourcesThisTurn.geode;

        state.push(currentState);

    }
    // console.log(state);
    geodesCollected.push(state[state.length -1].geode);
});


const qualityLevels = geodesCollected.map((item, index) => (
    item * blueprints[index].blueprintNumber
));
console.log(qualityLevels);
console.log('total', qualityLevels.reduce((acc, curr) => acc + curr, 0))

/* Have the game setup working, just strategy is not optimal

Strategy ideas:
we want to get the max number of geodeRobots as soon as possibile
once you've got these, you don't need to do anything else, as you won't
get any more geodes
could maybe calculate some kind of expected value
or calculate the total resource per geode miner

oreRobotOreCost,
clayRobotOreCost,
obsidianRobotOreCost,
obsidianRobotClayCost,
geodeRobotOreCost,
geodeRobotObsidianCost,

i.e. 
const requiredOre = 
    geodeRobotOreCost +
    geodeRobotObsidianCost * (
        obsidianRobotOreCost +
        obsidianRobotClayCost * (
            clayRobotOreCost
        )
    )

const requiredClay = geodeRobotObsidianCost * obsidianRobotClayCost

Or something like that. These aren't right as they don't take into
account the accumulation correctly

*/