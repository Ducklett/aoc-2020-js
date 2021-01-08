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

const transform = (data, cb, imageSize = 10) => {
    const toId = (x, y) => x + (imageSize * y)
    let copy = []
    for (let y = 0; y < imageSize; y++) {
        for (let x = 0; x < imageSize; x++) {
            let i = toId(...cb(x, y))
            copy[i] = data[toId(x, y)]
        }
    }

    return copy.join('')
}

// I don't know why this still works when applied to the entire image since 9 is hardcoded 
// But it works...?
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

const isCorner = connections => connections.length == 2

const constructImage = () => {
    const isTopLeft = () =>
        (connections[0].side == 'right' || connections[0].side == 'down')
        && (connections[1].side == 'right' || connections[1].side == 'down')

    let corner, connections
    for (let s of squares) {
        connections = connectSquares(s, squares)
        if (isCorner(connections)) {
            corner = s
            break
        }
    }

    console.log(`found corner ${corner.id}`)

    if (!isTopLeft()) {
        for (let transformation of transformationTable) {
            let data = transform(corner.data, transformation)
            let transCorner = { id: corner.id, data }
            connections = connectSquares(transCorner, squares)
            if (isTopLeft()) {
                corner = transCorner
                break
            }
        }
    }

    /// start filling the image
    const image = {
        '0,0': { tile: corner, connections }
    }
    const lastFilled = ['0,0']
    let missingSquares = squares.filter(s => s.id != corner.id)
    let width = 1
    let height = 1

    while (missingSquares.length > 0) {
        for (let l of [...lastFilled]) {
            let connections = image[l].connections.filter(c => c.side == 'right' || c.side == 'down')
            lastFilled.splice(lastFilled.indexOf(l), 1)
            for (let connection of connections) {
                const index = (() => {
                    let [x, y] = l.split(',').map(v => parseInt(v))
                    if (connection.side == 'down') y++
                    else x++

                    width = Math.max(width, x + 1)
                    height = Math.max(height, y + 1)
                    return `${x},${y}`

                })()
                if (image[index]) continue
                let { id, data } = connection.square
                data = transform(data, transformationTable[connection.transform])

                let tile = { id, data }
                let connections = connectSquares(tile, missingSquares)

                lastFilled.push(index)

                image[index] = { tile, connections }

                missingSquares = missingSquares.filter(s => s.id != id)
            }
        }
    }

    const stitchedImage = {
        width: width * 8,
        height: height * 8,
        data: []
    }

    const paintSquare = (square, offsetX, offsetY) => {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                let i = (x + offsetX) + (y + offsetY) * stitchedImage.width
                stitchedImage.data[i] = square[(x + 1) + (y + 1) * 10]
            }
        }
    }

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            paintSquare(image[`${x},${y}`].tile.data, x * 8, y * 8)
        }
    }

    return stitchedImage
}

const image = constructImage()

const findMonster = image => {
    const monster = [
        "                  # ",
        "#    ##    ##    ###",
        " #  #  #  #  #  #   ",
    ]

    const monsterCoords = monster
        .map((row, y) => row.split('').map((c, x) => [x, y, c]))
        .reduce((acc, row) => acc.concat(row), [])
        .filter(([, , c]) => c == '#')
        .map(([x, y, _]) => [x, y])

    let roughness = 0

    for (let t of transformationTable) {

        const data = transform(image.data, t, image.width).split('')
        const monsterAt = (x, y) => {
            const toId = (x, y) => x + y * image.width;
            const isMonster = monsterCoords
                .reduce((legal, [ox, oy]) => legal && data[toId(x + ox, y + oy)] == '#', true)
            if (isMonster) {
                monsterCoords.forEach(([ox, oy]) => {
                    data[toId(x + ox, y + oy)] = 'O'
                })
            }
            return isMonster
        }

        let monsters = 0

        for (let x = 0; x < image.width - monster[0].length; x++) {
            for (let y = 0; y < image.height - monster.length; y++) {
                if (monsterAt(x, y)) monsters++
            }
        }

        if (monsters > 0) {
            roughness = data.filter(v => v != '.').length - monsters * monsterCoords.length

            const ppm = `P3
${image.width} ${image.height}
255
${data.map(v => v == 'O' ? '255 0 0' : v == '#' ? '0 0 0' : '255 255 255').join(' ')}`

            fs.writeFileSync('nessie.ppm', ppm)
        }
    }


    return roughness
}

console.log(findMonster(image))

// const pbm = `P1
// ${image.width} ${image.height}
// ${image.data.join(' ')}`

// fs.writeFileSync('out.pbm', pbm)