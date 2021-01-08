const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' }).trim()

const parseOp = op => {
    const [opcode, arg] = op.split(' ')
    return { opcode, argument: parseInt(arg)}
}

const program = input.split("\n").map(parseOp)

const evaluateProgram = program => {
    const visited = new Set()
    let pc = 0
    let accumulator = 0

    do {
        // stop evaluation on infinite loop
        if (visited.has(pc)) break

        const {opcode, argument} = program[pc]

        visited.add(pc)
        switch(opcode) {
            case 'acc': accumulator += argument; break
            // -1 since we always increment the pc at the end of each instruction
            case 'jmp': pc += (argument-1); break
            case 'nop': break
        }
        pc++
    } while(true)

    return accumulator
}

console.log(evaluateProgram(program))