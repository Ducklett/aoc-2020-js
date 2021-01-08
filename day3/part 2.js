const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' })

// create a matrix[y][x]
// where 0 represents empty ground and 1 represents a tree
const forest = input.split("\n")
    .map(line => line.split('').map(char => char === '.' ? 0 : 1))

const getTreeCountForSlope = (forest, right, down) => {
    const forestPatternSize = forest[0].length
    let x = 0
    let y = 0

    let treesSeen = 0

    while (y < forest.length - 1) {
        treesSeen += forest[y][x]

        y += down
        x = (x + right) % forestPatternSize
    }

    return treesSeen
}

const slopes = [
    { right: 1, down: 1 },
    { right: 3, down: 1 },
    { right: 5, down: 1 },
    { right: 7, down: 1 },
    { right: 1, down: 2 },
]

const productOfTreecountForSlopes = slopes
    .map(({ right, down }) => getTreeCountForSlope(forest, right, down))
    .reduce((acc, cur) => !acc ? cur : acc * cur, 0)

console.log(productOfTreecountForSlopes)