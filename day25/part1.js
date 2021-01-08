// example
// const pk1 = 5764801
// const pk2 = 17807724
// real
const pk1 = 11404017
const pk2 = 13768789
const sub = 7

const tf = (num, sub) => {

    // let num = 1
    // while (loop > 0) {
        num = num * sub
        num %= 20201227
        // loop--
    // }
    return num
}

let l1 = 1
let l2 = 1
let found =0
let num=1
let i=1
while (true) {
    num = tf(num, sub)
    if (num == pk1) {
        l1=i
        found++
    }
    if (num == pk2) {
        l2=i
        found++
    }
    if (found==2) break
    i++
}

console.log('1', l1)
console.log('2', l2)


{
    let l=0
    let num =1
    while(l<l2) {
        num=tf(num, pk1)
        l++
    }

console.log('sol', num)
}
