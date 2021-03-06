const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' }).trim()

let sum = 0

const isDigit = c => c >= '0' && c <= '9'
const isParenOpen = c => c == '('

for (let line of input.split('\n')) {

    const str = line
    let i = 0

    const skipWhitespace = () => {
        while (str[i] == ' ') i++
    }

    const node = (type, data) => ({ type, ...data })

    const parsePrimaryExpression = () => {
        skipWhitespace()
        let c = str[i]
        if (isDigit(c)) {
            let start = i
            while (isDigit(str[i])) i++
            return node('number', { value: str.substr(start, i - start) })
        }
        if (isParenOpen(c)) {
            // skip open paren
            i++
            const b = parseBinaryExpression(-1)
            // skip close paren
            i++
            return b
        }
    }

    const parseBinaryExpression = (parentPrecedence = -1) => {
        const operatorPrecedence = o => o == '+' ? 2: 1

        let left = parsePrimaryExpression()

        skipWhitespace()
        while (i < str.length && operatorPrecedence(str[i]) > parentPrecedence && str[i] != ')') {
            skipWhitespace()
            const operator = str[i]
            i++
            const right = parseBinaryExpression(operatorPrecedence(operator))
            left = node('binaryExpression', { operator, left, right })
        }

        return left
    }

    const evaluateExpression = (tree) => {
        switch (tree.type) {
            case 'number': return parseInt(tree.value)
            case 'binaryExpression':
                switch (tree.operator) {
                    case '+': return evaluateExpression(tree.left) + evaluateExpression(tree.right)
                    case '-': return evaluateExpression(tree.left) - evaluateExpression(tree.right)
                    case '/': return evaluateExpression(tree.left) / evaluateExpression(tree.right)
                    case '*': return evaluateExpression(tree.left) * evaluateExpression(tree.right)
                }
        }
    }

    sum += evaluateExpression(parseBinaryExpression())
}

console.log(sum)
