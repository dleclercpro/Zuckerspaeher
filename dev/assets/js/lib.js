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

function range (start, stop, step) {
    if (typeof stop == 'undefined') {
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
};