const text = await Deno.readTextFile('src/day13Data.txt');
// const text = await Deno.readTextFile('src/day13TestInput.txt');
const packetList = text.split('\n\n').join('\n').split('\n');

const parsedData = packetList.map(packet => JSON.parse(packet));
parsedData.push([[2]]);
parsedData.push([[6]]);


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

parsedData.sort((packetA: any, packetB: any) => {
    const order = checkOrderOfArray(packetA, packetB);
    if (order === 'correct'){
        return -1;
    }
    if (order === 'incorrect'){
        return 1;
    }
    return 0;
})

console.log(parsedData)

let dividerPacketIndexA = -1;
let dividerPacketIndexB = -1;


parsedData.forEach((packet, packetIndex) => {
    if (JSON.stringify(packet) === '[[2]]') {
        dividerPacketIndexA = packetIndex + 1;
    }
    if (JSON.stringify(packet) === '[[6]]') {
        dividerPacketIndexB = packetIndex + 1;
    }
})

console.log(dividerPacketIndexA, dividerPacketIndexB, dividerPacketIndexA * dividerPacketIndexB);
