const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' }).trim()

const players = input.split('\n\n').map(player => {
    const [name, ...numbers] = player.split('\n')
    return {name, cards: numbers.map(n=>parseInt(n))}
})

const playGame = ([player1, player2]) => {
    const draw = ( arr ) => {
        const fst = arr[0]
        arr.shift()
        return fst
    }
    // let round = 1
    while(true) {
        if (player1.cards.length==0) return player2
        if (player2.cards.length==0) return player1
        // console.log('round ' + round++)
        // console.log('player 1: ' + player1.cards)
        // console.log('player 2: ' + player2.cards)

        const [c1,c2] = [draw(player1.cards), draw(player2.cards)]

        if (c1>c2) {
            player1.cards.push(c1)
            player1.cards.push(c2)
        }
        else {
            player2.cards.push(c2)
            player2.cards.push(c1)
        }
    }

}

const c = playGame(players).cards.reverse()
    .map((v,i) => v*(i+1))
    .reduce((acc,c) => acc+c)


console.log(c)