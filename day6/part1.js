const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' })

const groupAnswers = input
    .split('\n\n')
    .map(group => new Set(group.trim().replace(/\n/g,'')))

const answerCount = groupAnswers.reduce((acc, group) => acc + group.size, 0)

console.log(answerCount)
