const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' }).trim()

const addBag = (bagText, map) => {
    const colorEndIndex = bagText.indexOf("bags") - 1
    const color = bagText.substr(0, colorEndIndex)

    map[color] = {}

    const constraints = bagText.substr(colorEndIndex + 14, bagText.length - (colorEndIndex + 15)).split(", ").map(c => {
        const [count, ...color] = c.split(' ')

        // contain *no* other bags
        if (count === "no") return null

        return [parseInt(count), color.join(' ').replace(/\sbag(s?)$/, '')]
    })

    for (let c of constraints) {
        if (c == null) continue
        let [bagcount, bagcolor] = c
        map[color][bagcolor] = bagcount
    }
}

const map = {}

input.split('\n').forEach(b => addBag(b, map))

const requiredHeldBags = (name, map) => {
    const bag = map[name]
    return Object.keys(bag)
        .map(k => bag[k] + (bag[k] * requiredHeldBags(k, map)) )
        .reduce((acc, cur) => acc + cur, 0)
}

console.log(requiredHeldBags("shiny gold", map))
