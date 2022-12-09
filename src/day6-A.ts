const text = await Deno.readTextFile('src/day6Data.txt');

const last4Letters: string[] = []

const matchingIndex = text.split('').findIndex((letter) => {
    if (last4Letters.length < 4) {
        last4Letters.push(letter)
    } else {
        last4Letters.push(letter);
        last4Letters.shift()
    }

    const uniqueLetters = new Set(last4Letters);
    return uniqueLetters.size === 4;
})
console.log(matchingIndex +1)