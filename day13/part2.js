const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' }).trim()

// const input = `939
// 7,13,x,x,59,x,31,19`

let busses = input.split('\n')[1].split(',')
    .map(t => t == 'x' ? 'x' : parseInt(t))
    .map((bus, i) => ({ bus, i }))
    .filter(({ bus }) => bus != 'x')


// stolen answer
let factor = 1
let time = 0

for (let bus of busses) {
    while ((time + bus.i) % bus.bus !== 0) {
        time += factor
    }
    factor *= bus.bus
}

console.log(time)
