const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' })

const parsePassport = (str) => {
    const fields = str.split(' ').map(field => field.split(':'))
    const passport = {}
    for(let [k,v] of fields) {
        passport[k] = v
    }
    return passport
}

const  passportFields = [
    'byr',
    'iyr',
    'eyr',
    'hgt',
    'hcl',
    'ecl',
    'pid',
    // 'cid'
]

const passportIsValid = (passport) => passportFields
    .filter(field => passport[field] != undefined)
    .length == passportFields.length

const validPassportCount = input.split('\n\n')
    .map(passport => passport.replace(/\n/g, ' '))
    .map(parsePassport)
    .filter(passportIsValid)
    .length

console.log(validPassportCount)