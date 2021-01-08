const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' })

// create a matrix[y][x]
// where 0 represents empty ground and 1 represents a tree
const forest = input.split("\n")
    .map(line => line.split('').map(char => char === '.' ? 0 : 1))

const forestPatternSize = forest[0].length
const down = 1;
const right = 3;

let x = 0
let y = 0

let treesSeen = 0

while (y < forest.length-1) {
    treesSeen += forest[y][x]

    y += down
    x = (x + right) % forestPatternSize
} 

console.log(treesSeen)