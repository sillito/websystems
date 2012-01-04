function Car(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
}

Car.prototype.age = function() {
    return (new Date).getFullYear() - this.year
}

var c1 = new Car('toyota', 'corolla', 1996);
var c2 = new Car('honda', 'accord', 2010);

console.log(c1.age())
console.log(c2.age())