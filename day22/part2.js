const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' }).trim()

const players = input.split('\n\n').map(player => {
    const [name, ...numbers] = player.split('\n')
    return numbers.map(n => parseInt(n))
})

const playGame = ([player1, player2]) => {
    const draw = (arr) => {
        const fst = arr[0]
        arr.shift()
        return fst
    }

    let p1 = new Set()
    let p2 = new Set()

    let round = 1
    const r = p => ({ n: p == player1 ? 'p1' : 'p2', cards: p })

    while (true) {
        if (p1.has(player1.join())) return r(player1)
        if (p2.has(player2.join())) return r(player1)

        if (player1.length == 0) return r(player2)
        if (player2.length == 0) return r(player1)

        p1.add(player1.join())
        p2.add(player2.join())

        // console.log('round ' + round++)
        // console.log('player 1: ' + player1)
        // console.log('player 2: ' + player2)

        const [c1, c2] = [draw(player1), draw(player2)]

        let winner

        if (player1.length >= c1 && player2.length >= c2) {
            let w = playGame([player1.slice(0, c1), player2.slice(0, c2)], true)
            winner = w.n == 'p1' ? player1 : player2
        } else {
            winner = c1 > c2 ? player1 : player2
        }

        if (winner === player1) {
            player1.push(c1)
            player1.push(c2)
        }
        else {
            player2.push(c2)
            player2.push(c1)
        }
    }
}

const c = playGame(players).cards.reverse()
    .map((v, i) => v * (i + 1))
    .reduce((acc, c) => acc + c)


console.log(c)
