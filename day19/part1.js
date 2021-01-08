const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' }).trim()

// const input = `0: 4 1 5
// 1: 2 3 | 3 2
// 2: 4 4 | 5 5
// 3: 4 5 | 5 4
// 4: "a"
// 5: "b"

// ababbb
// bababa
// abbbab
// aaabbb
// aaaabbb`

const [rules, messages] = (() => {
    const parseRule = r => {
        const rule = (type, data) => ({ type, ...data })
        r = r.trim()
        if (r[0] == '"') {
            return rule('char', { char: r[1] })
        } else {
            let options = r.split(" | ")
            if (options.length > 1) {
                return rule('option', { options: options.map(o => o.split(' ')) })
            } else {
                return rule('set', { order: options[0].split(' ') })
            }
        }
    }
    let [rules, messages] = input.split('\n\n')

    rules = rules.split('\n').map(line => {
        let [i, rule] = line.split(':')
        rule = parseRule(rule)
        return [i, rule]
    }).reduce((map, [i, rule]) => {
        map[i] = rule
        return map
    }, {})
    messages = messages.split('\n')

    return [rules, messages]
})()

const matchesRule = (message, ruleName, offset = 0) => {
    if (offset>=message.length) return 0

    const matchesSet = (set, start) => {
        let i = start
        for (let r of set) {
            let j = matchesRule(message, r, i)
            if (j == 0) return 0
            i = j
        }
        return i
    }

    const rule = rules[ruleName]

    let res;
    switch (rule.type) {
        case 'char': res = (message[offset] == rule.char) ? offset + 1 : 0; break
        case 'set':
            res = matchesSet(rule.order, offset); break
        case 'option':
            res = rule.options
                .map(r => matchesSet(r, offset))
                .reduce((found, cur) => found != 0 ? found : cur); break
    }
    return res
}

const validMessageCount = messages
    .map(m => matchesRule(m, '0') == m.length)
    .reduce((acc, cur) => acc + Number(cur), 0)

console.log(validMessageCount)