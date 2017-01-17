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

function sortWithIndices(x) {
  for (i = 0; i < x.length; i++) {
    x[i] = [x[i], i];
  }

  x.sort(function(a, b) {
    return a[0] < b[0] ? -1 : 1;
  });

  indices = [];

  for (i = 0; i < x.length; i++) {
    indices.push(x[i][1]);
    x[i] = x[i][0];
  }

  return indices;
}

function convertTime (t, format) {
    if (parseInt(t) == t) {
        t = parseInt(t);

        var date = new Date(t);

        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        var millisecond = date.getMilliseconds(0);

        if (format === "YYYY.MM.DD - HH:MM:SS") {
            return year + "." + ("0" + month).slice(-2) + "." + ("0" + day).slice(-2) + " - " + ("0" + hour).slice(-2) + ":" + ("0" + minute).slice(-2) + ":" + ("0" + second).slice(-2);
        } else if (format === "HH:MM - DD.MM.YYYY") {
            return ("0" + hour).slice(-2) + ":" + ("0" + minute).slice(-2) + " - " + ("0" + day).slice(-2) + "." + ("0" + month).slice(-2) + "." + year;
        } else if (format === "HH:MM") {
            return ("0" + hour).slice(-2) + ":" + ("0" + minute).slice(-2);
        }
    } else {
        var date = new Date();

        if (format === "YYYY.MM.DD - HH:MM:SS") {
            var year = t.slice(0, 4);
            var month = t.slice(5, 7);
            var day = t.slice(8, 10);
            var hour = t.slice(-8, -6);
            var minute = t.slice(-5, -3);
            var second = t.slice(-2);
            var millisecond = 0;
        } else {
            var year = t.slice(-4);
            var month = t.slice(-7, -5);
            var day = t.slice(-10, -8);
            var hour = t.slice(0, 2);
            var minute = t.slice(3, 5);
            var second = 0;
            var millisecond = 0;
        }


        date.setFullYear(year);
        date.setMonth(month - 1);
        date.setDate(day);
        date.setHours(hour);
        date.setMinutes(minute);
        date.setSeconds(second);
        date.setMilliseconds(millisecond);

        return date.getTime();
    }
}

function rankBG (BG, BGScale) {
    BG = parseFloat(BG);

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

function rankdBGdt (dBGdt, dBGdtScale) {
    dBGdt = parseFloat(dBGdt);
    
    var arrowUp = decodeEntity("&#8593;");
    var arrowRightUp = decodeEntity("&#8599;");
    var arrowRight = decodeEntity("&#8594;");
    var arrowRightDown = decodeEntity("&#8600");
    var arrowDown = decodeEntity("&#8595;");

    if (dBGdt < dBGdtScale[0]) {
        return arrowDown;
    } else if (dBGdt >= dBGdtScale[0]  && dBGdt < dBGdtScale[1]) {
        return arrowRightDown;
    } else if (dBGdt >= dBGdtScale[1] && dBGdt < dBGdtScale[2]) {
        return arrowRight;
    } else if (dBGdt >= dBGdtScale[2] && dBGdt < dBGdtScale[3]) {
        return arrowRightUp;
    } else if (dBGdt >= dBGdtScale[3]) {
        return arrowUp;
    }
}

function roundBG (BG) {
    BG = parseFloat(BG);

    return (Math.round(BG * 10) / 10).toFixed(1);
}

function roundTBR (TBR) {
    TBR = parseInt(TBR);

    return Math.round(TBR).toFixed(0);
}

function roundB (B) {
    B = parseInt(B);

    return (Math.round(B * 10) / 10).toFixed(1);
}

function decodeEntity (str) {
    return $("<textarea>").html(str).text();
}