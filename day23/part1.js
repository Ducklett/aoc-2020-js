// const input = `389125467`
const input = `653427918`
const cups = input.split('').map(c => parseInt(c))

const maxCup = cups.reduce((acc, cur) => acc > cur ? acc : cur)
const minCup = cups.reduce((acc, cur) => acc < cur ? acc : cur)

const moves = 100
let current = cups[0]

const wrap = i => i % cups.length

const draw = () => {
    return cups.splice(wrap(cups.indexOf(current) + 1), 1)[0]
}

const destination = () => {
    // destination cup = cup with label == (cups[current]-1)
    // keep subtracting one until it is a cup not picked up
    // if it goes below the lowest value, wrap to the highest value
    let label = current - 1
    while (cups.indexOf(label) == -1) {
        label--
        // console.log(label)
        if (label < minCup) label = maxCup
    }
    return cups.indexOf(label)
}

for (let move = 0; move < moves; move++) {
    // console.log('move ' + (move + 1))
    // console.log('current ' + current)
    // console.log('cups: ' + cups.join(' '))
    let drawn = [draw(), draw(), draw()]
    // console.log('pick up: ' + drawn.join(' '))
    const dest = destination()
    // console.log('destination: ' + cups[dest])
    cups.splice(dest + 1, 0, ...drawn);
    current = cups[wrap(cups.indexOf(current) + 1)]
}

let start = cups.indexOf(1)
const res = cups.map((v,i) => cups[wrap(i+start)]).splice(1).join('')
console.log(res)