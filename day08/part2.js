const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' }).trim()

const parseOp = op => {
    const [opcode, arg] = op.split(' ')
    return { opcode, argument: parseInt(arg) }
}

const program = input.split("\n").map(parseOp)

const evaluateProgram = program => {
    const visited = new Set()
    let pc = 0
    let accumulator = 0
    let crashed = false

    do {
        // stop evaluation on infinite loop
        if (visited.has(pc)) {
            crashed = true
            break
        }

        const { opcode, argument } = program[pc]

        visited.add(pc)
        switch (opcode) {
            case 'acc': accumulator += argument; break
            // -1 since we always increment the pc at the end of each instruction
            case 'jmp': pc += (argument - 1); break
            case 'nop': break
        }
        pc++
    } while (pc != program.length)

    return { accumulator, crashed }
}

const fixProgram = (program) => {
    for (let operation of program) {
        const opcode = operation.opcode
        if (opcode == 'acc') continue;
        // try to run the program with this opcode changed, then change it back
        operation.opcode = opcode == 'jmp' ? 'nop' : 'jmp'
        const { accumulator, crashed } = evaluateProgram(program)
        operation.opcode = opcode
        if (!crashed) return accumulator
    }
    console.error("failed to fix program...")
    return -1
}

console.log(fixProgram(program))
