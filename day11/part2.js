const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' }).trim()

const State = { Floor: '.', EmptySeat: 'L', OccupiedSeat: '#' }

const layout = input
    .split("\n")
    .map(row => row.split(''))

const buffer = {
    front: layout,
    // deep copy the initial state into the back buffer
    back: JSON.parse(JSON.stringify(layout))
}

const swapBuffer = buffer => {
    [buffer.front, buffer.back] = [buffer.back, buffer.front]
}

const tick = buffer => {
    let changeOccured = false

    const current = buffer.front
    const next = buffer.back

    const sizeX = current[0].length
    const sizeY = current.length

    for (let y = 0; y < sizeY; y++) {
        for (let x = 0; x < sizeX; x++) {
            const seatState = current[y][x]

            // initially just copy the current state
            // other rules can then override this
            next[y][x] = seatState

            if (seatState == State.Floor) continue

            // look in al directions
            let adjacentSeatsOccupied = 0
            for (let dirX = -1; dirX <= 1; dirX++) {
                for (let dirY = -1; dirY <= 1; dirY++) {
                    if (dirX == 0 && dirY == 0) continue

                    // find seat in this direction
                    for (let d = 1; ; d++) {
                        const xIndex = x + dirX*d
                        const yIndex = y + dirY*d
                        if (xIndex < 0 || xIndex >= sizeX) break
                        if (yIndex < 0 || yIndex >= sizeY) break

                        const foundSeat = current[yIndex][xIndex]
                        if (foundSeat == State.OccupiedSeat) {
                            adjacentSeatsOccupied++
                            break
                        } else if (foundSeat == State.EmptySeat) {
                            break
                        }
                    }

                }
            }

            if (seatState == State.EmptySeat && adjacentSeatsOccupied == 0) {
                next[y][x] = State.OccupiedSeat
                changeOccured = true
            } else if (seatState == State.OccupiedSeat && adjacentSeatsOccupied >= 5) {
                next[y][x] = State.EmptySeat
                changeOccured = true
            }
        }
    }
    swapBuffer(buffer)

    return changeOccured
}

const countOccupiedSeats = buffer => buffer.front
    .reduce((a, b) => a.concat(b))
    .reduce((acc, s) => acc + (s == State.OccupiedSeat ? 1 : 0), 0)

while (tick(buffer)) { }

console.log(countOccupiedSeats(buffer))