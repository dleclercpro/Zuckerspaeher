Array.prototype.max = function () {
    return Math.max.apply(null, this);
}

Array.prototype.min = function () {
    return Math.min.apply(null, this);
}

Array.prototype.first = function () {
    return this[0];
}

Array.prototype.last = function () {
    return this[this.length - 1];
}