const text = await Deno.readTextFile('src/day13Data.txt');
// const text = await Deno.readTextFile('src/day13TestInput.txt');
const packetPairs = text.split('\n\n');

const parsedData = packetPairs.map(packetPair => {
    const [packetA, packetB] = packetPair.split('\n');
    const parsedA = JSON.parse(packetA);
    const parsedB = JSON.parse(packetB);

    return {a: parsedA, b: parsedB}
})

const indecesWithCorrectOrder: number[] = [];

const checkOrder: (valueA: any, valueB: any) => 'correct' | 'incorrect' | null  = (valueA: any, valueB: any) => {
    console.log('checking', valueA, valueB)

    if (typeof valueA === 'number' && typeof valueB === 'number') {
        if (valueA < valueB) {
            console.log('a less than b!')
            return 'correct';
        } else if (valueA > valueB){
            console.log('b less than a!');
            return 'incorrect';
        }
    }
    if (typeof valueA === 'undefined' && typeof valueB !== 'undefined') {
        console.log('a undef, b def!');
        return 'correct';
    }
    if (typeof valueA !== 'undefined' && typeof valueB === 'undefined') {
        console.log('a def, b undef!');
        return 'incorrect';
    }

    if (Array.isArray(valueA) && Array.isArray(valueB) ) {
        return checkOrderOfArray(valueA, valueB)
    }
    if (Array.isArray(valueA) && !Array.isArray(valueB) ) {
        return checkOrderOfArray(valueA, [valueB])
    }
    if (!Array.isArray(valueA) && Array.isArray(valueB) ) {
        return checkOrderOfArray([valueA], valueB)
    }
    return null;
}

const checkOrderOfArray = (arrayA: any[], arrayB: any[]) => {
    const maxArrayLength = Math.max(arrayA.length, arrayB.length)

    for (let index=0; index<maxArrayLength; index++) {

        const order = checkOrder(arrayA[index], arrayB[index]);
        if (order === 'correct' || order === 'incorrect') {
            return order;
        }
    }
    return null;
};

parsedData.forEach((pair, pairIndex) => {
    // console.log('----------')
    // console.log('new pair!', pair, pairIndex)
    // console.log('----------')
    const order = checkOrderOfArray(pair.a, pair.b)

    if (order === 'correct') {
        indecesWithCorrectOrder.push(pairIndex + 1);
    }
})
console.log(indecesWithCorrectOrder);
console.log(indecesWithCorrectOrder.reduce((acc, curr)=> acc+curr, 0))