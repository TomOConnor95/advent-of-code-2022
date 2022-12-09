const text = await Deno.readTextFile('src/day6Data.txt');

const last14Letters: string[] = []

const matchingIndex = text.split('').findIndex((letter) => {
    if (last14Letters.length < 13) {
        last14Letters.push(letter)
        return false;
    } else if (last14Letters.length < 14) {
        last14Letters.push(letter)
    } else {
        last14Letters.push(letter);
        last14Letters.shift()
    }

    const uniqueLetters = new Set(last14Letters);
    return uniqueLetters.size === 14;
})
console.log(matchingIndex +1)