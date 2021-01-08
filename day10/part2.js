const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' }).trim()

const adapters = input.split('\n').map(n => parseInt(n))

adapters.push(0)
adapters.sort((a, b) => a - b)
const builtin = adapters[adapters.length - 1] + 3
adapters.push(builtin)

const findSolutions = (adapters, startIndex = 1, previousAdapter = 0, memo = {}) => {

    if (memo[previousAdapter]) return memo[previousAdapter]

    let solutions = 1
    
    for (let i = startIndex; i < adapters.length - 1; i++) {
        let prev = i == startIndex ? previousAdapter : adapters[i - 1]
        const nextFitsPrevious = (adapters[i + 1] - (prev)) <= 3
        if (nextFitsPrevious) {
            solutions += findSolutions(adapters, i+1, prev, memo)
        }
    }

    memo[previousAdapter] = solutions
    return solutions
}

console.log(findSolutions(adapters))
