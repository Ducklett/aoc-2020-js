const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' }).trim()

const parseInput = input => {
    let [constrains, yourTicket, nearbyTickes] = input.split('\n\n')
    constrains = constrains.split('\n').map(c => {
        let [name, ranges] = c.split(':')
        ranges = ranges
            .split('or')
            .map(r => r.trim().split('-').map(v => parseInt(v)))
            .map(r => ({ min: r[0], max: r[1] }))
        return { name, ranges }

    })

    yourTicket = yourTicket.split(':')[1].trim().split(',').map(v => parseInt(v))
    nearbyTickes = nearbyTickes.split(':')[1].trim().split('\n').map(t =>
        t.split(',').map(v => parseInt(v)))

    return { constrains, yourTicket, nearbyTickes }
}

const data = parseInput(input)

const errorRate = ({ constrains, nearbyTickes }) => {
    const ticketErrorRate = ticket => ticket.map(v =>
        constrains.filter(({ ranges: [r1, r2] }) =>
            (v >= r1.min && v <= r1.max) || (v >= r2.min && v <= r2.max))
            .length == 0 ? v : 0
    ).reduce((acc, cur) => acc + cur)

    return nearbyTickes.map(ticketErrorRate).reduce((acc, cur) => acc + cur)
}
console.log(errorRate(data))
