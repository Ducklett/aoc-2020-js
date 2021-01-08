const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' })

const intersect = (a, b) => new Set([...a].filter(v => b.has(v)))

const groupAnswers = input
    .split('\n\n')
    .map(group => group
        .trim().split('\n')
        .map(x => new Set(x)).reduce(intersect))

const answerCount = groupAnswers.reduce((acc, group) => acc + group.size, 0)

console.log(answerCount)