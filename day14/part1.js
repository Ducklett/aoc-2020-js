const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' }).trim()
// const input = `mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
// mem[8] = 11
// mem[7] = 101
// mem[8] = 0`

const parseInstruction = str => {
    if (str[1] == 'a' /*mask*/) {
        return { op: 'mask', mask: str.split(' = ')[1] }

    } else /*mem*/ {
        const [address, value] = str.match(/\d+/g).map(s => BigInt(s))
        return { op: 'mem', address, value }
    }
}

const instructions = input.split('\n').map(parseInstruction)

const evaluate = instructions => {
    const mem = {}
    let mask = null

    const setValue = (value, mask) => {
        for (let i = 0n; i < mask.length; i++) {
            const c = mask[(mask.length-1)-Number(i)]
            switch (c) {
                case 'X': break
                case '1': value |= (1n << i); break
                case '0': if (value & (1n << i)) value ^= (1n << i); break
            }
        }
        return value
    }

    for (let instr of instructions) {
        if (instr.op == 'mask') mask = instr.mask
        else mem[instr.address] = setValue(instr.value, mask)
    }

    return Object.keys(mem).reduce((acc, k) => acc + mem[k], 0n)
}
console.log(evaluate(instructions))