const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' })

const parseLine = line => {
    const numberSeparator = line.indexOf('-')
    const numberEnd = line.indexOf(' ')
    const firstPosition = parseInt(line.substr(0, numberSeparator))
    const secondPosition = parseInt(line.substr(numberSeparator + 1, numberEnd))
    const character = line[numberEnd + 1]
    const password = line.substr(numberEnd + 4) // skip the ` a: `
    return { firstPosition, secondPosition, character, password }
}

const validateLine = lineInfo => {
    //                                       index is 1-based, convert to 0-based
    const firstCharacter = lineInfo.password[lineInfo.firstPosition - 1]
    const secondCharacter = lineInfo.password[lineInfo.secondPosition - 1]

    if (firstCharacter == lineInfo.character && secondCharacter != lineInfo.character) return true
    if (firstCharacter != lineInfo.character && secondCharacter == lineInfo.character) return true
    return false
}

const validPasswordCount = input.split("\n")
    .map(parseLine)
    .filter(validateLine)
    .length

console.log(validPasswordCount)