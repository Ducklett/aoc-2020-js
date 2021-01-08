const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' })

const partitionSpace = (min, max, isUp) => {
    const range = max - min
    return (isUp
        ? [Math.ceil(min + range / 2), max]
        : [min, Math.floor(min + range / 2)])
}

const decodeSeat = encodedSeatPos => {
    let [minRow, maxRow] = [0, 127]
    let [minCol, maxCol] = [0, 7]
    for (let command of encodedSeatPos.split('')) {
        switch (command) {
            case 'F': [minRow, maxRow] = partitionSpace(minRow, maxRow, false); break
            case 'B': [minRow, maxRow] = partitionSpace(minRow, maxRow, true); break
            case 'R': [minCol, maxCol] = partitionSpace(minCol, maxCol, true); break
            case 'L': [minCol, maxCol] = partitionSpace(minCol, maxCol, false); break
        }
    }
    return { row: minRow, column: minCol }
}

const seatIdFromPosition = ({ row, column }) => row * 8 + column

const highestSeatId = input
    .split('\n')
    .map(decodeSeat)
    .map(seatIdFromPosition)
    .reduce((highest, cur) => cur > highest ? cur : highest)

console.log(highestSeatId)