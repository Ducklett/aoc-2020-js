const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' })

const parseLine = line => {
    const numberSeparator = line.indexOf('-')
    const numberEnd = line.indexOf(' ')
    const minBound = parseInt(line.substr(0, numberSeparator))
    const maxBound = parseInt(line.substr(numberSeparator + 1, numberEnd))
    const character = line[numberEnd + 1]
    const password = line.substr(numberEnd + 4) // skip the ` a: `
    return { minBound, maxBound, character, password }
}

const validateLine = lineInfo => {
    let occurences = 0
    for (let c of lineInfo.password) {
        if (c == lineInfo.character) occurences++
    }
    return occurences >= lineInfo.minBound && occurences <= lineInfo.maxBound
}

const validPasswordCount = input.split("\n")
    .map(parseLine)
    .filter(validateLine)
    .length

console.log(validPasswordCount)