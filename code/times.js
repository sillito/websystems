var count = 7

function times(n, f) {
    for (i=0; i<n; i++)
        f(i)
}

times(count, function(i) {
    console.log(i)
})

Number.prototype.times = function(f) {
    return times(this, f)
}

function f() {
    (12).toFixed()
}


f()

// (12).times(function(i) {
//     console.log(i * 2)
// })
// 
// 12