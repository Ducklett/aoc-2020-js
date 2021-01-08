const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' }).trim()

const actions = input.split('\n').map(a => [a[0], parseInt(a.substr(1))])

const ship = { x: 0, y: 0, direction: 'E' }

const move = (ship, action) => {
    const turn = (from, amount, left) => {
        const directions = ['N', 'E', 'S', 'W']
        let directionIndex = directions.indexOf(from)
        if (left) directionIndex -= amount / 90
        else directionIndex += amount / 90

        if (directionIndex < 0) directionIndex += 4
        if (directionIndex > 3) directionIndex -= 4
        return directions[directionIndex]
    }
    const [dir, amount] = action
    switch (dir) {
        case 'N': ship.y += amount; break
        case 'S': ship.y -= amount; break
        case 'E': ship.x += amount; break
        case 'W': ship.x -= amount; break
        case 'L': ship.direction = turn(ship.direction, amount, true); break
        case 'R': ship.direction = turn(ship.direction, amount, false); break
        case 'F': return move(ship, [ship.direction, amount])
    }
}

actions.forEach(a => move(ship, a))

console.log(Math.abs(ship.x) + Math.abs(ship.y))
