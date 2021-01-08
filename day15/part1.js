const startingNumbers = [15, 12, 0, 14, 3, 1]

const numberMap = {}
let turn = 0
let lastSpoken = 0

const speak = (n, starting = false) => {
    if (starting || numberMap[n] === undefined) {
        // new
        numberMap[n] = turn
        lastSpoken = 0
    } else {
        // existing
        lastSpoken = turn - numberMap[n]
        numberMap[n] = turn
    }
    turn++
}

startingNumbers.forEach(v => speak(v, true))

// really fucking slow but it works
// to lazy for now
// -1 since we start counting turns at 0
while (turn < 30000000 - 1) speak(lastSpoken)

console.log(lastSpoken)
