const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' })

const parsePassport = (str) => {
    const fields = str.split(' ').map(field => field.split(':'))
    const passport = {}
    for (let [k, v] of fields) {
        passport[k] = v
    }
    return passport
}

const passportFields = [
    'byr',
    'iyr',
    'eyr',
    'hgt',
    'hcl',
    'ecl',
    'pid',
    // 'cid'
]

const passportHasAllFields = (passport) => passportFields
    .filter(field => passport[field] != undefined)
    .length == passportFields.length

const passportIsValid = (passport) => {
    if (!passportHasAllFields(passport)) return false

    //                                 protection against NaN
    const byr = parseInt(passport.byr) || 0
    const iyr = parseInt(passport.iyr) || 0
    const eyr = parseInt(passport.eyr) || 0
    const hgt = parseInt(passport.hgt) || 0

    const heightInCm = passport.hgt.indexOf('cm') != -1

    if (byr < 1920 || byr > 2002) return false
    if (iyr < 2010 || iyr > 2020) return false
    if (eyr < 2020 || eyr > 2030) return false
    if (!(/^\d+(in|cm)$/).test(passport.hgt)) return false
    if (heightInCm && (hgt < 150 || hgt > 193) ) return false
    if (!heightInCm && (hgt < 59 || hgt > 76) ) return false
    if (!(/^#[0-9a-f]{6}$/).test(passport.hcl)) return false
    if (!(/^(amb|blu|brn|gry|grn|hzl|oth)$/).test(passport.ecl)) return false
    if (!(/^\d{9}$/).test(passport.pid)) return false

    return true
}

const validPassportCount = input.split('\n\n')
    .map(passport => passport.replace(/\n/g, ' '))
    .map(parsePassport)
    .filter(passportIsValid)
    .length

console.log(validPassportCount)
