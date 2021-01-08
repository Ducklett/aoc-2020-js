const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' }).trim()
    .replace('8: 42', '8: 42 | 42 8')
    .replace('11: 42 31', '11: 42 31 | 42 11 31')


const [rules, messages] = (() => {
    const parseRule = r => {
        const rule = (type, data) => ({ type, ...data })
        let options = r.split(" | ")
        return (r[0] == '"')
            ? rule('char', { char: r[1] })
            : (options.length > 1
                ? rule('option', { options: options.map(o => o.split(' ')) })
                : rule('set', { order: options[0].split(' ') }))
    }

    let [rules, messages] = input.split('\n\n')

    rules = rules.split('\n').map(line => {
        let [i, rule] = line.split(':')
        return [i, parseRule(rule.trim())]
    }).reduce((map, [i, rule]) => {
        map[i] = rule
        return map
    }, {})
    messages = messages.split('\n')

    return [rules, messages]
})()

const matchesRule = (message, ruleName, offset = 0) => {

    const flatten = x => {
        if (!Array.isArray(x)) return x
        x = x.reduce((acc, v) => acc.concat(v), []).filter(v => v != 0)
        return x.length == 0 ? 0 : x.length == 1 ? x[0] : x
    }

    const matchesSet = (set, start) => {
        let i = start

        for (let r of set) {
            let j = flatten(Array.isArray(i)
                ? i.map(v => matchesRule(message, r, v))
                : matchesRule(message, r, i))
            if (j == 0) return 0
            i = j
        }
        return i
    }

    const rule = rules[ruleName]

    switch (rule.type) {
        case 'char': return (message[offset] == rule.char) ? offset + 1 : 0
        case 'set': return matchesSet(rule.order, offset)
        case 'option': return flatten(rule.options.map(r => matchesSet(r, offset)))
    }
}

const validMessageCount = messages
    .map(m => {
        let res = matchesRule(m, '0')
        return (Array.isArray(res))
            ? res.filter(v => v == m.length).length > 0
            : res == m.length
    })
    .reduce((acc, cur) => acc + cur, 0)

console.log(validMessageCount)
