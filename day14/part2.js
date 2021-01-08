const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' }).trim()

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

    const findAdress = (addr, mask) => {

        let adresses = []

        let i = mask.indexOf('X')
        if (i != -1) {
            return [
                ...findAdress(addr, mask.replace('X', '1')),
                ...findAdress(addr, mask.replace('X', 'q'))
            ]
        }

        for (let i = 0n; i < mask.length; i++) {
            const c = mask[(mask.length-1) - Number(i)]
            switch (c) {
                case '1': addr |= (1n << i); break
                case '0': break
                // 0 coming from floating mask
                case 'q': if (addr & (1n << i)) addr ^= (1n << i); break
            }
        }
        return [addr]
    }

    for (let instr of instructions) {
        if (instr.op == 'mask') mask = instr.mask
        else {
            for (let addr of findAdress(instr.address, mask)) {
                mem[addr] = instr.value
            }
        }
    }

    return Object.keys(mem).reduce((acc, k) => acc + mem[k], 0n)
}
console.log(evaluate(instructions))