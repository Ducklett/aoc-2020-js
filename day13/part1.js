const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' }).trim()

// const input = `939
// 7,13,x,x,59,x,31,19`

let [depart, busses] = input.split('\n')

depart = parseInt(depart)

// premature binary search :p
const findNextAfter = depart => bus => {
    let lowerBound = 1
    let upperBound = 1

    while (bus * upperBound < depart) upperBound *= 2

    while (true) {
        let avg = Math.ceil(lowerBound + ((upperBound - lowerBound) / 2))

        let t = bus * avg
        if (t > depart && bus * (avg - 1) < depart) return t

        if (t < depart) {
            lowerBound = avg
        } else if (t > depart) {
            upperBound = avg
        }
    }
}

busses = busses.split(',')
    .filter(b => b != 'x')
    .map(t => parseInt(t))

const busToTake = busses
    .map(findNextAfter(depart))
    .reduce((min, cur, i) => (cur - depart) < min[0] ? [cur - depart, busses[i]] : min, [999, -1])

console.log(busToTake[0] * busToTake[1])