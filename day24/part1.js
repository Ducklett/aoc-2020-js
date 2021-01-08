
const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' }).trim()
// const input = `sesenwnenenewseeswwswswwnenewsewsw
// neeenesenwnwwswnenewnwwsewnenwseswesw
// seswneswswsenwwnwse
// nwnwneseeswswnenewneswwnewseswneseene
// swweswneswnenwsewnwneneseenw
// eesenwseswswnenwswnwnwsewwnwsene
// sewnenenenesenwsewnenwwwse
// wenwwweseeeweswwwnwwe
// wsweesenenewnwwnwsenewsenwwsesesenwne
// neeswseenwwswnwswswnw
// nenwswwsewswnenenewsenwsenwnesesenew
// enewnwewneswsewnwswenweswnenwsenwsw
// sweneswneswneneenwnewenewwneswswnese
// swwesenesewenwneswnwwneseswwne
// enesenwswwswneneswsenwnewswseenwsese
// wnwnesenesenenwwnenwsewesewsesesew
// nenewswnwewswnenesenwnesewesw
// eneswnwswnwsenenwnwnwwseeswneewsenese
// neswnwewnwnwseenwseesewsenwsweewe
// wseweeenwnesenwwwswnew`

const instructions = input.split('\n').map(line => {
    const dirs = []
    let i = 0
    while (i < line.length) {
        if (line[i] == 's' && line[i + 1] == 'e') {
            i += 2
            dirs.push('se')
        }
        else if (line[i] == 's' && line[i + 1] == 'w') {
            i += 2
            dirs.push('sw')
        }
        else if (line[i] == 'n' && line[i + 1] == 'e') {
            i += 2
            dirs.push('ne')
        }
        else if (line[i] == 'n' && line[i + 1] == 'w') {
            i += 2
            dirs.push('nw')
        }
        else if (line[i] == 'e') {
            i += 1
            dirs.push('e')
        }
        else {/*w */
            i += 1
            dirs.push('w')
        }
    }
    return dirs
})

const opp = dir => {
    switch (dir) {
        case 'sw': return 'ne'
        case 'se': return 'nw'
        case 'ne': return 'sw'
        case 'nw': return 'se'
        case 'e': return 'w'
        case 'w': return 'e'
    }
}

const makeTile = () => ({ isWhite: true, })

let floor = {}
floor['0,0'] = makeTile()

const index = (x, y) => `${x},${y}`
const parseIndex = (i) => i.split(',').map(c => parseInt(c))

// hex grid:
// - start at center 0,0
// - rows of uneven number(like 1) only populate indices with uneven number, so you get (1,-1) (1,1)
// - moving w/e just moves in row, moving nw moves row-1 and w-1

const stepDir = (x, y, dir) => {
    switch (dir) {
        case 'sw': return index(x - 1, y + 1)
        case 'se': return index(x + 1, y + 1)
        case 'ne': return index(x + 1, y - 1)
        case 'nw': return index(x - 1, y - 1)
        case 'e': return index(x + 2, y)
        case 'w': return index(x - 2, y)
    }
}

const step = ([x, y], dir, flip = false) => {
    const i = stepDir(x, y, dir)
    if (!floor[i]) floor[i] = makeTile()
    const tile = floor[i]
    if (flip) tile.isWhite = !tile.isWhite
    return i
}

const perform = instruction => {
    let idx = '0,0'
    for (let i = 0; i < instruction.length; i++) {
        let flip = i + 1 == instruction.length
        // if (flip) console.log('finna flip ' + idx)
        idx = step(parseIndex(idx), instruction[i], flip)
    }
}

instructions.forEach(perform)

const simulateDay = () => {

    // first create adjacent tiles so they partake in the simulation..
    for (let k of Object.keys(floor)) {
        let [x, y] = parseIndex(k)
        for (let dir of ['sw', 'se', 'ne', 'nw', 'e', 'w']) {
            let i = stepDir(x, y, dir)
            if (!floor[i]) floor[i] = makeTile()
        }
    }

    let newFloor = JSON.parse(JSON.stringify(floor))

    for (let k of Object.keys(floor)) {
        let [x, y] = parseIndex(k)
        let blackNeighbour = 0
        for (let dir of ['sw', 'se', 'ne', 'nw', 'e', 'w']) {
            let i = stepDir(x, y, dir)
            if (!floor[i]) floor[i] = makeTile()
            if (!floor[i].isWhite) blackNeighbour++
        }
        if (floor[k].isWhite && blackNeighbour==2) {
            newFloor[k].isWhite = false
        }
        else if (!floor[k].isWhite && (blackNeighbour==0 || blackNeighbour>2)) {
            newFloor[k].isWhite = true
        }
    }

    floor = newFloor
}

// console.log(Object.values(floor).filter(t => !t.isWhite).length)

for(let i=0;i<100;i++){
    simulateDay()
}

// simulateDay()
console.log(Object.values(floor).filter(t => !t.isWhite).length)