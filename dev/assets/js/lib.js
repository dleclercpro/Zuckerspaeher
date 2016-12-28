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
}

function convertTime (t, format) {
    if (parseInt(t) == t) {
        var date = new Date(parseInt(t));
        
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        var millisecond = date.getMilliseconds(0);

        if (format === "HH:MM - DD.MM.YYYY") {
            return ("0" + hour).slice(-2) + ":" + ("0" + minute).slice(-2) + " - " + day + "." + month + "." + year;
        } else if (format === "HH:MM") {
            return ("0" + hour).slice(-2) + ":" + ("0" + minute).slice(-2);
        }
    } else {
        var date = new Date();

        var year = t.slice(-4);
        var month = t.slice(-7, -5);
        var day = t.slice(-10, -8);
        var hour = t.slice(0, 2);
        var minute = t.slice(3, 5);

        date.setFullYear(year);
        date.setMonth(month - 1);
        date.setDate(day);
        date.setHours(hour);
        date.setMinutes(minute);
        date.setSeconds(0);
        date.setMilliseconds(0);

        return date.getTime();
    }
}

function rankBG (BG, BGScale) {
    if (BG < BGScale[0]) {
        return "BG-very-low";
    } else if (BG >= BGScale[0] && BG < BGScale[1]) {
        return "BG-low";
    } else if (BG >= BGScale[1] && BG < BGScale[2]) {
        return "BG-normal";
    } else if (BG >= BGScale[2] && BG < BGScale[3]) {
        return "BG-high";
    } else if (BG >= BGScale[3]) {
        return "BG-very-high";
    }
}