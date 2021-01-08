// const input = `389125467`
const input = `653427918`
const len = 1000000//9
const preset = input.split('').map(c => parseInt(c))

let head
let tail
let one

let prev

const node = (value) => ({ value })
for (let i = 0; i < len; i++) {
    if (i == 0) {
        head = node(preset[i])
        prev = head
    } else if (i < preset.length) {
        let cur = node(preset[i])
        // since the initial values are provided out of order prev is set later on
        prev.next = cur
        prev = cur
    }
    else {
        let cur = node(i + 1)
        cur.prev = prev
        prev.next = cur
        prev = cur
    }

    if (i + 1 == len) {
        tail = prev
        tail.next = head
    }

    if (i < preset.length && preset[i] == 1) {
        one = prev
    }
}

let cur = head
for (let i = 0; i < Math.min(len, preset.length + 1); i++) {
    let prev = head
    while (true) {
        if (cur.value == 1) {
            if (prev.value == len) {
                cur.prev = prev
                break
            }
        } else if (prev.value == cur.value - 1) {
            cur.prev = prev
            break
        }
        prev = prev.next
    }

    cur = cur.next
}

const printList = () => {
    let cur = head
    do {
        // console.log(`${cur.prev?.value} <- ${cur.value} -> ${cur.next?.value}`)
        process.stdout.write(cur.value + ' ')
        cur = cur.next
    } while (cur != head)
    process.stdout.write("\n")
}

const moves = 10000000 //100
let current = head
let drawn
let drawnValues

const draw = () => {
    let cup = current.next
    current.next = cup.next.next.next
    return cup
}

const destination = () => {
    let dst = current.prev
    while (drawnValues.indexOf(dst.value) != -1) {
        dst = dst.prev
    }
    return dst
}

for (let move = 0; move < moves; move++) {
    // if (move % 1000 == 0) console.log(`move ${move}`)
    // console.log('move ' + (move + 1))
    // console.log('current ' + current.value)
    // console.log('cups: ')

    // printList(head)

    drawn = draw()

    drawnValues = [drawn.value, drawn.next.value, drawn.next.next.value]
    // console.log('pick up: ', drawnValues.join(' '))
    const dest = destination()
    // console.log('destination: ' + dest.value)
    let next = dest.next
    dest.next = drawn
    drawn.next.next.next = next

    current = current.next
}

console.log(one.next.value * one.next.next.value)

// part 1
// let c = one.next
// const res = []
// while (c.value != 1) {
//     res.push(c.value)
//     c = c.next
// }
// console.log(res.join(''))
