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

const canBagHold = (bagName, bagToHold, map) => {
    if (map[bagName][bagToHold]) return true;
    return Object.keys(map[bagName])
        .filter(k => canBagHold(k, bagToHold, map))
        .length > 0
}

const bagCount = Object.keys(map).filter(b => canBagHold(b, "shiny gold", map)).length

console.log(bagCount)
