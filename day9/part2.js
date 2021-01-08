const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' }).trim()

const preamble = 25

const numbers = input.split('\n').map(v => parseInt(v))

const findInvalidNumber = (numbers, preamble) => {
    postamble:
    for (let i = preamble; i < numbers.length; i++) {

        const number = numbers[i]
        const offset = i - preamble
        for (let j = offset; j < offset + preamble; j++) {
            for (let k = offset; k < offset + preamble; k++) {
                const sum = numbers[j] + numbers[k]
                if (number == sum) continue postamble
            }
        }

        // couldn't find a sum that matches this number
        return number
    }
}

const findWeakness = (numbers, preamble) => {
    const invalidNumber = findInvalidNumber(numbers, preamble)

    let range = null
    for (let i = 0; i < numbers.length; i++) {
        let acc = 0

        let j;
        for (j = i; acc < invalidNumber; j++) {
            acc += numbers[j]
        }

        if (acc == invalidNumber) {
            range = numbers.slice(i, j)
            break
        }
    }

    const smallest = range.reduce((acc, cur) => acc > cur ? cur : acc)
    const largest = range.reduce((acc, cur) => acc < cur ? cur : acc)

    return smallest + largest
}

console.log(findWeakness(numbers, preamble))