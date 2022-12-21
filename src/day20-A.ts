const text = await Deno.readTextFile('src/day20Data.txt');
// const text = await Deno.readTextFile('src/day20TestInput.txt');

const ENABLE_DEBUG = false;
// const ENABLE_DEBUG = true; 

const numbers = text.split('\n').map((row, index) => {
  return {
    number: parseInt(row),
    originalIndex: index
  }  
})

ENABLE_DEBUG && console.log(numbers, numbers.length);

const {min, max} = numbers.reduce((acc, curr) => {
    return {
        min: Math.min(acc.min, curr.number),
        max: Math.max(acc.max, curr.number),
    }
}, {min: Infinity, max: -Infinity})
ENABLE_DEBUG && console.log({min,max});

const range = max - min;
const safetyAddValue = Math.ceil(range/(numbers.length -1))*(numbers.length -1);
ENABLE_DEBUG && console.log({safetyAddValue});

for (let i = 0; i<numbers.length; i++) {
    const numberIndex = numbers.findIndex(item => item.originalIndex === i);
    
    const number = numbers[numberIndex].number;

    let newIndexPosition = 0;

    if (number === 0) {
        ENABLE_DEBUG && console.log('Value is zero. No need to change'); 
        continue;
    }
    if (number > 0) {
        if (numberIndex + number >= numbers.length) {
            newIndexPosition = (numberIndex + number) % (numbers.length -1);
        } else {
            newIndexPosition = numberIndex + number;
        }
    }
    if (number < 0) {
        if (numberIndex + number === 0) {
            ENABLE_DEBUG && console.log('CASE!3')
            newIndexPosition = numbers.length -1;
        } else if (numberIndex + number < 0) {
            newIndexPosition = (numberIndex + number + safetyAddValue) % (numbers.length - 1);
            ENABLE_DEBUG && console.log('CASE!1')
        } else {
            ENABLE_DEBUG && console.log('CASE!2')
            newIndexPosition = numberIndex + number;
        }
    }

    ENABLE_DEBUG && console.log({number, numberIndex, newIndexPosition});

    const temporary = numbers[numberIndex];

    if (newIndexPosition === numberIndex) {
        ENABLE_DEBUG && console.log('No need to change', newIndexPosition); 
        continue;
    }
    if (newIndexPosition > numberIndex) {
        ENABLE_DEBUG && console.log('newIndexPosition > numberIndex', newIndexPosition, numberIndex); 
        numbers.splice(numberIndex, 1);

        numbers.splice(newIndexPosition, 0, temporary)
        ENABLE_DEBUG && console.log(numbers)

        continue;
    }
    if (newIndexPosition < numberIndex) {
        ENABLE_DEBUG && console.log('newIndexPosition < numberIndex', newIndexPosition, numberIndex); 
        numbers.splice(numberIndex, 1);

        numbers.splice(newIndexPosition, 0, temporary)
        ENABLE_DEBUG && console.log(numbers)

        continue;
    }
}

console.log('----------');
console.log(numbers)
const indexOfZero = numbers.findIndex(item => item.number === 0)

const oneThousandAfterZero = numbers[(indexOfZero + 1000) % numbers.length];
const twoThousandAfterZero = numbers[(indexOfZero + 2000) % numbers.length];
const threeThousandAfterZero = numbers[(indexOfZero + 3000) % numbers.length];
console.log({oneThousandAfterZero, twoThousandAfterZero, threeThousandAfterZero});
console.log(oneThousandAfterZero.number + twoThousandAfterZero.number + threeThousandAfterZero.number);
