const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' }).trim()

const preamble = 25

const numbers = input.split('\n').map(v => parseInt(v))

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
    console.log(number)
}
