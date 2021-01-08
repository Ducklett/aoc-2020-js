const fs = require('fs')

const input = fs.readFileSync(__dirname + '/input.txt', { encoding: 'utf-8' }).trim()
// const input = `mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
// trh fvjkl sbzzf mxmxvkd (contains dairy)
// sqjhc fvjkl (contains soy)
// sqjhc mxmxvkd sbzzf (contains fish)`

const foods = input.split('\n').map(l => {
    const [ingredients, allergens] = l.split(' (contains')
    return {
        ingredients: ingredients.trim().split(' '),
        allergens: allergens.replace(')', '').replace(/,/g, '').trim().split(' ')
    }
})

const allergens = [...new Set(foods.map(f => f.allergens).reduce((acc, cur) => acc.concat(cur)))]


let ingredients = [...new Set(foods.map(f => f.ingredients).reduce((acc, cur) => acc.concat(cur)))]

const validIngredients = al => {
    let valid = []
    inglist:
    for (let ing of ingredients) {
        for (let food of foods) {
            // if it has the allergy but NOT the ingredient that's invalid
            if (food.ingredients.indexOf(ing) == -1 && food.allergens.indexOf(al) != -1) {
                continue inglist
            }
        }
        // valid!
        valid.push(ing)
    }
    return valid
}

let rem = []

const allergenValidity = allergens.map(v => {
    let valid = validIngredients(v)
    if (valid.length==1) rem.push(valid[0])
    return {name : v, valid }
})

while (rem.length) {
    for(let allerg of allergenValidity) {
        if (allerg.valid.length>1) {
            let i = allerg.valid.indexOf(rem[0])
            if (i!=-1) allerg.valid.splice(i,1)
            if (allerg.valid.length==1)rem.push(allerg.valid[0])
        }
    }
    rem.splice(0,1)
}

console.log(allergenValidity)

const a = allergenValidity.sort((a,b) => a.name > b.name ? 1:-1)
    .map(b =>b.valid[0])
    .join(',')

console.log(a)
