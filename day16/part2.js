const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' }).trim()

// const input = `class: 0-1 or 4-19
// row: 0-5 or 8-19
// seat: 0-13 or 16-19

// your ticket:
// 11,12,13

// nearby tickets:
// 3,9,18
// 15,1,5
// 5,14,9`

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

const legalTickets = (({ constrains, nearbyTickes }) => {
    const isLegal = ticket => ticket.map(v => {
        for (let constraint of constrains) {

            for (let { min, max } of constraint.ranges) {
                // legal
                if (v >= min && v <= max) {
                    return true
                }
            }
        }
        // illegal
        return false
    }).reduce((acc, cur) => acc && cur, true)

    return nearbyTickes.filter(isLegal)
})(data)

const findFieldIndices = (tickets, constrains) => {
    let singleMatch = []

    const constrainsWithMatchingFields = constrains.map((c, i) => {
        // check which ticket values match this constraint
        const matches = []
        fieldCheck:
        for (let i = 0; i < tickets[0].length; i++) {
            for (let t of tickets) {
                let field = t[i]
                if ((field >= c.ranges[0].min && field <= c.ranges[0].max) || field >= c.ranges[1].min && field <= c.ranges[1].max) {
                    // field matches
                } else {
                    continue fieldCheck
                }
            }
            matches.push(i)
        }
        if (matches.length == 1) singleMatch.push(i)
        return { ...c, matches }
    })

    while (singleMatch.length != 0) {

        let value = constrainsWithMatchingFields[singleMatch[0]].matches[0]

        for (let i in constrainsWithMatchingFields) {
            if (i == singleMatch[0]) continue
            let c = constrainsWithMatchingFields[i]

            const valueIndex = c.matches.indexOf(value)
            if (valueIndex == -1) continue
            c.matches.splice(valueIndex, 1)
            if (c.matches.length == 1) {
                singleMatch.push(i)
            }
        }

        singleMatch.splice(0, 1)
    }

    return constrainsWithMatchingFields.map(({ name, matches }) => ({ name, field: matches[0] }))
}

const mul = findFieldIndices(legalTickets, data.constrains)
    .filter(c => c.name.indexOf("departure") == 0)
    .map(c => data.yourTicket[c.field])
    .reduce((acc,cur) => acc*cur)
console.log(mul)
