const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' }).trim()
// const input = fs.readFileSync(__dirname + '/test.txt', { encoding: 'utf-8' }).trim()

const squares = input.split('\n\n').map(t => {
    let [id, ...data] = t.split('\n')
    id = parseInt(id.split(' ')[1])
    data = data.join('')
    return { id, data }
})

const printSquare = (id, data) => {
    console.log(`Tile ${id}`)
    for (let i = 0; i < 10; i++) {
        console.log(data.substr(i * 10, 10))
    }
}

const transform = (data, cb) => {
    const toId = (x, y) => x + (10 * y)
    let copy = []
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            let i = toId(...cb(x, y))
            copy[i] = data[toId(x, y)]
        }
    }

    return copy.join('')
}

const transformationTable = [
    (x, y) => [x, y],
    (x, y) => [9 - x, y],
    (x, y) => [x, 9 - y],
    (x, y) => [9 - x, 9 - y],
    (x, y) => [y, x],
    (x, y) => [9 - y, x],
    (x, y) => [y, 9 - x],
    (x, y) => [9 - y, 9 - x],
]

const opposite = side => {
    switch (side) {
        case 'left': return 'right'
        case 'right': return 'left'
        case 'up': return 'down'
        case 'down': return 'up'
    }
}

const match = (side, a, b) => {
    const sides = {
        up: s => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => s[i]),
        down: s => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => s[i + 90]),
        left: s => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => s[i * 10]),
        right: s => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => s[i * 10 + 9]),
    }


    const aSide = sides[side](a)
    const bSide = sides[opposite(side)](b)
    for (let i = 0; i < 10; i++) {
        if (aSide[i] != bSide[i]) return false
    }
    return true
}

const connectSquares = ({ id, data }, squares) => {
    const sides = [
        'up',
        'down',
        'left',
        'right',
    ]

    const connections = []

    for (let side of sides) {
        squareLoop:
        for (let square of squares) {
            if (square.id == id) continue
            for (let i = 0; i < transformationTable.length; i++) {
                let transformation = transformationTable[i]
                let squareData = transform(square.data, transformation)

                if (match(side, data, squareData)) {
                    connections.push({ side, transform: i, square })
                    break squareLoop;
                }
            }
        }
    }

    return connections
}

const isCorner = square => {
    const connections = connectSquares(square, squares)
    return (connections.length == 2)
}

const corners = squares.filter(isCorner)
console.log(corners.reduce((acc, cur) => acc == 0 ? cur.id : acc * cur.id, 0))