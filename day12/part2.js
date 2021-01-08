const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' }).trim()

const actions = input.split('\n').map(a => [a[0], parseInt(a.substr(1))])

const ship = { x: 0, y: 0, wx: 10, wy: 1, direction: 'E' }

const move = (ship, action) => {
    const turn = (ship, amount, left) => {
        if (left) {
            amount = 360 - amount;
        }

        const temp = ship.wx
        ship.wx = ship.wy
        ship.wy = -temp

        if (amount > 90) turn(ship, amount - 90, false)
    }
    const [dir, amount] = action
    switch (dir) {
        case 'N': ship.wy += amount; break
        case 'S': ship.wy -= amount; break
        case 'E': ship.wx += amount; break
        case 'W': ship.wx -= amount; break
        case 'L': turn(ship, amount, true); break
        case 'R': turn(ship, amount, false); break
        case 'F':
            ship.x += ship.wx * amount
            ship.y += ship.wy * amount
            break
    }
}

actions.forEach(a => move(ship, a))

console.log(Math.abs(ship.x) + Math.abs(ship.y))
