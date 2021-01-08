const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' }).trim()

const adapters = input.split('\n').map(n => parseInt(n))

adapters.sort((a, b) => a - b)
const builtin = adapters[adapters.length - 1] + 3
adapters.push(builtin)

const diff = { 1: 0, 2: 0, 3: 0 }
for (let i = 0; i < adapters.length; i++) {
    const difference = adapters[i] - (i == 0 ? 0 : adapters[i - 1])
    diff[difference]++
}

console.log(diff[1] * diff[3])
