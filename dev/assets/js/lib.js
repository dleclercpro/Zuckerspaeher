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

function convertTime (t, format) {
    if (parseInt(t) == t) {
        var d = new Date(parseInt(t));
        var year = d.getFullYear();
        var month = d.getMonth();
        var day = d.getDate();
        var hour = d.getHours();
        var minute = d.getMinutes();
        var second = d.getSeconds();
        var millisecond = d.getMilliseconds(0);

        if (format === "HH:MM - DD.MM.YYYY") {
            return ("0" + hour).slice(-2) + ":" + ("0" + minute).slice(-2) + " - " + day + "." + month + "." + year;
        } else if (format === "HH:MM") {
            return ("0" + hour).slice(-2) + ":" + ("0" + minute).slice(-2);
        }
    } else {
        var d = new Date();
        var year = t.slice(-4);
        var month = t.slice(-7, -5);
        var day = t.slice(-10, -8);
        var hour = t.slice(0, 2);
        var minute = t.slice(3, 5);

        d.setFullYear(year);
        d.setMonth(month - 1);
        d.setDate(day);
        d.setHours(hour);
        d.setMinutes(minute);
        d.setSeconds(0);
        d.setMilliseconds(0);

        return d.getTime();
    }
};

function rankBG (BG, BGScale) {
    if (BG < BGScale[0]) {
        return "bg-very-low";
    } else if (BG >= BGScale[0] && BG < BGScale[1]) {
        return "bg-low";
    } else if (BG >= BGScale[1] && BG < BGScale[2]) {
        return "bg-normal";
    } else if (BG >= BGScale[2] && BG < BGScale[3]) {
        return "bg-high";
    } else if (BG >= BGScale[3]) {
        return "bg-very-high";
    }
};