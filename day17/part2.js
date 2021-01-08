const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' }).trim()

// const input = `.#.
// ..#
// ###`

const space = () => ({
    minX: 0,
    minY: 0,
    minZ: 0,
    minW: 0,
    maxX: 0,
    maxY: 0,
    maxZ: 0,
    maxW: 0,
})

const getInSpace = (space, x, y, z, w) => space[`${x},${y},${z},${w}`]
const setInSpace = (space, x, y, z, w, v) => {
    space.minX = Math.min(x, space.minX)
    space.minY = Math.min(y, space.minY)
    space.minZ = Math.min(z, space.minZ)
    space.minW = Math.min(w, space.minW)
    space.maxX = Math.max(x + 1, space.maxX)
    space.maxY = Math.max(y + 1, space.maxY)
    space.maxZ = Math.max(z + 1, space.maxZ)
    space.maxW = Math.max(w + 1, space.maxW)
    space[`${x},${y},${z},${w}`] = v
}

const front = space()

const startingPlane = input.split('\n').map(row => row.split(''))
for (let y = 0; y < startingPlane.length; y++) {
    for (let x = 0; x < startingPlane[0].length; x++) {
        setInSpace(front, x, y, 0, 0, startingPlane[y][x] == '#' ? 1 : 0)
    }
}

const buffer = {
    front,
    back: space()
}

const swapBuffer = (buffer) => {
    [buffer.front, buffer.back] = [buffer.back, buffer.front]
}

const tick = (buffer) => {
    const [current, next] = [buffer.front, buffer.back]

    const getAdjacentBlockCount = (buffer, x, y, z, w) => {
        let blocks = 0
        for (let ox = -1; ox <= 1; ox++) {
            for (let oy = -1; oy <= 1; oy++) {
                for (let oz = -1; oz <= 1; oz++) {
                    for (let ow = -1; ow <= 1; ow++) {
                        if (ox == 0 && oy == 0 && oz == 0 && ow == 0) continue
                        blocks += getInSpace(buffer, x + ox, y + oy, z + oz, w + ow) ? 1 : 0
                    }
                }
            }
        }
        return blocks
    }

    for (let x = current.minX - 1; x < current.maxX + 1; x++) {
        for (let y = current.minY - 1; y < current.maxY + 1; y++) {
            for (let z = current.minZ - 1; z < current.maxZ + 1; z++) {
                for (let w = current.minW - 1; w < current.maxW + 1; w++) {
                    const active = getInSpace(current, x, y, z, w)
                    const neighbours = getAdjacentBlockCount(current, x, y, z, w)
                    if (active) {
                        setInSpace(next, x, y, z, w, (neighbours == 2 || neighbours == 3) ? 1 : 0)
                    } else {
                        setInSpace(next, x, y, z, w, (neighbours == 3) ? 1 : 0)
                    }
                }
            }
        }
    }

    swapBuffer(buffer)
}

const countInSpace = (b) => {
    let count = 0
    const current = b.front
    for (let x = current.minX; x < current.maxX; x++) {
        for (let y = current.minY; y < current.maxY; y++) {
            for (let z = current.minZ; z < current.maxZ; z++) {
                for (let w = current.minW; w < current.maxW; w++) {
                    const active = getInSpace(current, x, y, z, w)
                    count += active ? 1 : 0
                }
            }
        }
    }
    return count
}

let cycles = 0
while (cycles < 6) {
    tick(buffer)
    cycles++
    console.log(countInSpace(buffer))
}
